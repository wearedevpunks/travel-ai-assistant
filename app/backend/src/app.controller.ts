import { Controller, Get, Res } from "@nestjs/common"
import { ApiOperation } from "@nestjs/swagger"
import { Log } from "@punks/backend-core"

@Controller()
export class AppController {
  private readonly logger = Log.getLogger(AppController.name)

  @Get()
  index(@Res() res: any) {
    return res.redirect("swagger")
  }

  @Get("health")
  @ApiOperation({
    operationId: "healthCheck",
  })
  health() {
    this.logger.debug("Health check completed successfully")
    return {
      healthy: true,
    }
  }
}
