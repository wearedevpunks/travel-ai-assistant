import { Log } from "@punks/backend-core"
import { Response } from "express"

const logger = Log.getLogger("openai-response-utils")

export const executeStreamedSpeechAndStream = async (
  res: Response,
  func: () => Promise<{ stream: NodeJS.ReadableStream, contentType: string }>
) => {
  try {
    // Set proper headers for audio streaming
    const { stream, contentType } = await func()
    
    res.setHeader("Content-Type", contentType)
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")

    // Pipe the stream to the response
    stream.pipe(res)

    // Handle stream errors
    stream.on('error', (error) => {
      logger.exception("Error in streaming speech", error)
      
      if (!res.headersSent) {
        res.status(500).json({
          error: "Stream error",
          message: error instanceof Error ? error.message : "Unknown error",
        })
      } else {
        res.end()
      }
    })
  } catch (error) {
    logger.exception("Error in speech streaming endpoint", error)

    // If headers haven't been sent yet, send an error response
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } else {
      res.end()
    }
  }
}

export const executeSpeechToTextAndReturn = async <T>(
  res: Response,
  func: () => Promise<T>
) => {
  try {
    // Process speech-to-text request
    const result = await func()
    
    // Set headers and return JSON response
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Cache-Control", "no-cache")
    
    // Return the typed response
    res.status(200).json(result)
  } catch (error) {
    logger.exception("Error in speech-to-text endpoint", error)
    
    // Return error response
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    })
  }
}
