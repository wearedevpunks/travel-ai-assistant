import {
  ExceptionFilter,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common"
import { Log } from "@punks/backend-core"

export interface RuntimeErrorInformation {
  exception: any
  request: any
  response: any
}

export abstract class AppExceptionsFilterBase implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()

    if (!(exception instanceof HttpException)) {
      this.logError({
        exception,
        request,
        response,
      }).catch((error) => {
        Log.getLogger("AllExceptionsFilter").error(
          "Error logging failed",
          error
        )
      })
    }

    const status = this.getErrorStatusCode(exception)
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      ...(exception
        ? {
            type: this.getExceptionType(exception),
            message: this.getExceptionMessage(exception),
            stack: this.getExceptionStack(exception),
          }
        : {}),
    })
  }

  protected getExceptionType(exception: any) {
    return exception.constructor?.name
  }

  protected getExceptionStack(exception: any) {
    return exception.stack
  }

  protected getExceptionMessage(exception: any) {
    return exception.message ?? "Internal server error"
  }

  protected getErrorStatusCode(exception: any) {
    const customErrorCode = this.getCustomErrorStatusCode(exception)
    if (customErrorCode) {
      return customErrorCode
    }

    if (exception instanceof HttpException) {
      return exception.getStatus()
    }

    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  protected abstract logError(info: RuntimeErrorInformation): Promise<void>

  protected abstract getCustomErrorStatusCode(
    exception: any
  ): number | undefined
}
