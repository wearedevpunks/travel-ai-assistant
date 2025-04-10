"use client"

import { useState, useRef, useCallback, useEffect } from "react"
import { buildBackendUrl } from "@/settings"

export type SpeechRecognitionState = "idle" | "recording" | "processing" | "error"

interface UseSpeechToTextOptions {
  endpoint?: string
  onTranscriptionStart?: () => void
  onTranscriptionComplete?: (text: string) => void
  onError?: (error: Error) => void
  autoSubmitOnSilence?: boolean
  silenceThreshold?: number // in milliseconds
  onAutoSubmit?: () => void
}

export function useSpeechToText({
  endpoint = buildBackendUrl("/v1/travel-planner/stt"),
  onTranscriptionStart,
  onTranscriptionComplete,
  onError,
  autoSubmitOnSilence = true,
  silenceThreshold = 2000, // 2 seconds of silence
  onAutoSubmit,
}: UseSpeechToTextOptions = {}) {
  const [state, setState] = useState<SpeechRecognitionState>("idle")
  const [error, setError] = useState<string | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const microphoneStreamRef = useRef<MediaStream | null>(null)
  const lastSoundDetectedRef = useRef<number>(Date.now())
  
  // Stop recording
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop()
    }
    
    // Clear any silence timer
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
      silenceTimerRef.current = null
    }
  }, [state])
  
  // Analyze audio for silence detection
  const setupSilenceDetection = useCallback((stream: MediaStream) => {
    if (!autoSubmitOnSilence) return
    
    try {
      // Create audio context and analyzer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      audioContextRef.current = audioContext
      
      const analyser = audioContext.createAnalyser()
      analyserRef.current = analyser
      analyser.fftSize = 256
      
      // Connect microphone to analyzer
      const microphone = audioContext.createMediaStreamSource(stream)
      microphone.connect(analyser)
      
      // Create data array for analyzer
      const dataArray = new Uint8Array(analyser.frequencyBinCount)
      
      // Function to check sound levels
      const checkSoundLevel = () => {
        if (state !== "recording") return
        
        analyser.getByteFrequencyData(dataArray)
        
        // Calculate average volume
        let sum = 0
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i]
        }
        const average = sum / dataArray.length
        
        // If there's sound (above a threshold)
        if (average > 5) { // Adjust threshold as needed
          lastSoundDetectedRef.current = Date.now()
        } else {
          // Check if we've been silent long enough
          const silenceDuration = Date.now() - lastSoundDetectedRef.current
          if (silenceDuration > silenceThreshold && state === "recording") {
            console.log("Silence detected, auto-stopping recording")
            if (mediaRecorderRef.current) {
              mediaRecorderRef.current.stop()
            }
            if (onAutoSubmit) {
              onAutoSubmit()
            }
          }
        }
        
        // Continue checking
        if (state === "recording") {
          requestAnimationFrame(checkSoundLevel)
        }
      }
      
      // Start checking sound levels
      requestAnimationFrame(checkSoundLevel)
    } catch (err) {
      console.error("Error setting up silence detection:", err)
    }
  }, [autoSubmitOnSilence, silenceThreshold, onAutoSubmit, state])
  
  // Start recording
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      audioChunksRef.current = []
      
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      microphoneStreamRef.current = stream
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }
      
      mediaRecorder.onstop = async () => {
        try {
          // Clean up audio analysis
          if (audioContextRef.current) {
            audioContextRef.current.close().catch(console.error)
            audioContextRef.current = null
            analyserRef.current = null
          }
          
          // All tracks must be stopped when we're done
          stream.getTracks().forEach(track => track.stop())
          
          if (audioChunksRef.current.length === 0) {
            setState("idle")
            return
          }
          
          setState("processing")
          
          // Convert audio chunks to blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          
          // Convert blob to base64
          const reader = new FileReader()
          reader.readAsDataURL(audioBlob)
          
          reader.onloadend = async () => {
            try {
              const base64data = reader.result as string
              
              // Send to backend
              const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  audioData: base64data,
                }),
              })
              
              if (!response.ok) {
                throw new Error(`Speech-to-text request failed: ${response.statusText}`)
              }
              
              const result = await response.json()
              
              if (result && result.text) {
                onTranscriptionComplete?.(result.text)
              } else {
                throw new Error("No transcription returned")
              }
              
              setState("idle")
            } catch (err) {
              console.error("Error processing speech:", err)
              setError(err instanceof Error ? err.message : "Error processing speech")
              setState("error")
              onError?.(err instanceof Error ? err : new Error(String(err)))
            }
          }
        } catch (err) {
          console.error("Error processing recording:", err)
          setError(err instanceof Error ? err.message : "Error processing recording")
          setState("error")
          onError?.(err instanceof Error ? err : new Error(String(err)))
        }
      }
      
      // Start recording
      mediaRecorder.start()
      setState("recording")
      onTranscriptionStart?.()
      
      // Initialize silence detection
      setupSilenceDetection(stream)
      
    } catch (err) {
      console.error("Error starting recording:", err)
      setError(err instanceof Error ? err.message : "Error starting recording")
      setState("error")
      onError?.(err instanceof Error ? err : new Error(String(err)))
    }
  }, [endpoint, onTranscriptionStart, onTranscriptionComplete, onError, setupSilenceDetection])
  
  // Cancel recording
  const cancelRecording = useCallback(() => {
    if (mediaRecorderRef.current && state === "recording") {
      // Clear any silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
        silenceTimerRef.current = null
      }
      
      // Clean up audio analysis
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error)
        audioContextRef.current = null
        analyserRef.current = null
      }
      
      const tracks = mediaRecorderRef.current.stream?.getTracks()
      tracks?.forEach((track) => track.stop())
      audioChunksRef.current = []
      setState("idle")
    }
  }, [state])
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error)
      }
      
      if (microphoneStreamRef.current) {
        microphoneStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])
  
  return {
    state,
    error,
    startRecording,
    stopRecording,
    cancelRecording,
    isRecording: state === "recording",
    isProcessing: state === "processing",
  }
}