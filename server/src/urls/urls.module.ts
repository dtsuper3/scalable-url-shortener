import { Module } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { UrlsController } from './urls.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Url, UrlSchema } from './entities/url.entity';
import { ZookeeperModule } from 'src/shared/zookeeper/zookeeper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Url.name,
        schema: UrlSchema,
      },
    ]),
    ZookeeperModule,
  ],
  controllers: [UrlsController],
  providers: [UrlsService],
})
export class UrlsModule {}
