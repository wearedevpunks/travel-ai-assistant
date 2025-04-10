import { Module } from "@nestjs/common"
import { MockedRepositories } from "./repositories"

@Module({
  imports: [],
  providers: [...MockedRepositories],
  exports: [...MockedRepositories],
})
export class MockedCollectionsModule {}
