"use client"

import { useState, useEffect, useRef } from "react"
import { useDebouncedValue } from "./useDebouncedValue"

interface TextChunk {
  text: string
  isProcessed: boolean
}

/**
 * Hook that splits streaming text into chunks for text-to-speech
 * It attempts to split on sentence boundaries (., !, ?) or after stable periods
 */
export function useTextChunker(text: string) {
  const [chunks, setChunks] = useState<TextChunk[]>([])
  const lastProcessedIndexRef = useRef(0)
  const processingRef = useRef(false)
  
  // Use two debounced versions of the text - one fast, one slow
  const fastDebouncedText = useDebouncedValue(text, 500)
  const slowDebouncedText = useDebouncedValue(text, 1500)
  
  // Process any new text and split into chunks
  useEffect(() => {
    // Prevent processing if we're already doing it or if there's no new content
    if (processingRef.current || text.length <= lastProcessedIndexRef.current) {
      return
    }
    
    processingRef.current = true
    
    try {
      // Get the new unprocessed text
      const newText = text.substring(lastProcessedIndexRef.current)
      
      // Look for a sentence boundary in the new text
      const sentenceEndRegex = /[.!?,]\s*/g
      let match: RegExpExecArray | null
      let foundSentence = false
      
      // Reset the regex state
      sentenceEndRegex.lastIndex = 0
      
      // Find all sentence boundaries
      while ((match = sentenceEndRegex.exec(newText)) !== null) {
        const sentenceEnd = match.index + match[0].length
        
        // Create a chunk from the start to this sentence end
        const chunkText = newText.substring(0, sentenceEnd).trim()
        if (chunkText.length > 0) {
          console.log("Found sentence boundary, creating chunk:", chunkText.substring(0, 30))
          setChunks(prev => [...prev, { text: chunkText, isProcessed: false }])
          
          // Update the last processed index
          lastProcessedIndexRef.current += sentenceEnd
          foundSentence = true
          break // Only process one sentence at a time to avoid looping issues
        }
      }
      
      // If we didn't find any complete sentences but text has been stable for a while
      // (detected by slowDebouncedText)
      const isTextStable = slowDebouncedText.length > lastProcessedIndexRef.current && 
                           slowDebouncedText === text;
                           
      if (!foundSentence && isTextStable && newText.trim().length > 0) {
        console.log("Creating chunk from stable text:", newText.trim().substring(0, 30))
        setChunks(prev => [...prev, { text: newText.trim(), isProcessed: false }])
        lastProcessedIndexRef.current += newText.length
      }
    } finally {
      processingRef.current = false
    }
  }, [text, fastDebouncedText, slowDebouncedText])
  
  // Function to mark a chunk as processed
  const markChunkAsProcessed = (index: number) => {
    setChunks(prevChunks => 
      prevChunks.map((chunk, i) => 
        i === index ? { ...chunk, isProcessed: true } : chunk
      )
    )
  }
  
  // Get the next unprocessed chunk
  const getNextUnprocessedChunk = (): { text: string; index: number } | null => {
    const index = chunks.findIndex(chunk => !chunk.isProcessed)
    if (index !== -1) {
      return { text: chunks[index].text, index }
    }
    return null
  }
  
  return {
    chunks,
    getNextUnprocessedChunk,
    markChunkAsProcessed
  }
}