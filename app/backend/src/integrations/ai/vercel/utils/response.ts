import { Log } from "@punks/backend-core"
import { pipeDataStreamToResponse, StreamTextResult } from "ai"
import { Response } from "express"

const logger = Log.getLogger("executeStreamedCompletionAndStream")

export const executeStreamedCompletionAndStream = async (
  res: Response,
  func: () => Promise<StreamTextResult<any, unknown>>
) => {
  try {
    // Set proper headers for SSE
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache, no-transform")
    res.setHeader("Connection", "keep-alive")

    pipeDataStreamToResponse(res, {
      execute: async (writer) => {
        const streamResult = await func()

        streamResult.consumeStream()
        streamResult.mergeIntoDataStream(writer, {
          sendReasoning: false,
        })
      },
      status: 200,
      onError: (error) => {
        logger.exception("Error in stream", error as Error)
        return "Internal server error"
      },
    })
  } catch (error) {
    logger.exception("Error in aiChat endpoint", error)

    // If headers haven't been sent yet, send an error response
    if (!res.headersSent) {
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
      })
    } else {
      try {
        res.write(
          `data: ${JSON.stringify({ error: "Stream error occurred" })}\n\n`
        )
        res.write("data: [DONE]\n\n")
        res.end()
      } catch (e) {
        logger.exception("Failed to write error to stream:", e)
      }
    }
  }
}
