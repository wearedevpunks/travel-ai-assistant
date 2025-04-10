import { Injectable } from "@nestjs/common"
import { AiVercelCompletionsServiceStreamedCompletion } from "../../handlers/streamed-completion/types"
import { VercelStreamedCompletionHandler } from "../../handlers/streamed-completion"

@Injectable()
export class AiVercelCompletionsService {
  constructor(
    private readonly streamedCompletionHandler: VercelStreamedCompletionHandler
  ) {}

  async createStreamedCompletion(
    input: AiVercelCompletionsServiceStreamedCompletion
  ) {
    return this.streamedCompletionHandler.createStreamedCompletion(input)
  }
}
