import { Module } from "@nestjs/common"
import { RedisRepositories } from "./repositories"
import { Settings } from "../../settings"
import Redis from "ioredis"

const redisProvider = {
  provide: "REDIS_CLIENT",
  useFactory: () => {
    return new Redis(Settings.getRedisUrl())
  },
}

@Module({
  imports: [],
  providers: [redisProvider, ...RedisRepositories],
  exports: [redisProvider, ...RedisRepositories],
})
export class RedisCollectionsModule {}
