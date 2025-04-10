import { Catch } from "@nestjs/common"
import { Log } from "@punks/backend-core"
import {
  AppExceptionsFilterBase,
  RuntimeErrorInformation,
} from "./errors-handler"

@Catch()
export class AppExceptionsFilter extends AppExceptionsFilterBase {
  protected async logError(info: RuntimeErrorInformation): Promise<void> {
    Log.getLogger("[AppExceptionsFilter]").exception(
      `Internal Server Error: ${info.exception?.message}`,
      info.exception
    )
  }

  protected getCustomErrorStatusCode(exception: any): number | undefined {
    return undefined
  }
}
