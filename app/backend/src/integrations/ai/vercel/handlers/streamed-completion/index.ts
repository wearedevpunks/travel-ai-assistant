import { Injectable } from "@nestjs/common"
import { AiVercelCompletionModelsProvider } from "../../providers/completion-models"
import { AiVercelCompletionsServiceStreamedCompletion } from "./types"
import { streamText } from "ai"
import { Log } from "@punks/backend-core"
import { AiVercelCompletionsService } from "../../services/completions"

@Injectable()
export class VercelStreamedCompletionHandler {
  private readonly logger = Log.getLogger(AiVercelCompletionsService.name)

  constructor(
    private readonly completionModelsProvider: AiVercelCompletionModelsProvider
  ) {}

  async createStreamedCompletion(
    input: AiVercelCompletionsServiceStreamedCompletion
  ) {
    const model = this.completionModelsProvider.resolve(input.model)

    // Build the streaming call
    const streamResult = streamText({
      model,
      onError: (error) => {
        this.logger.exception(
          "LLM error while streaming completion",
          error as any
        )
        input.callbacks?.onError?.(error)
      },
      onFinish: (finalResponse) => {
        this.logger.debug("LLM finished streaming completion", finalResponse)
        input.callbacks?.onFinish?.(finalResponse)
      },
      onStepFinish: (stepResponse) => {
        this.logger.debug("LLM finished streaming step", stepResponse)
        input.callbacks?.onStepFinish?.(stepResponse)
      },
      ...input.prompt,
    })

    return streamResult
  }
}
