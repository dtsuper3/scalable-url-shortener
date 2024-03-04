import { Module } from '@nestjs/common';
import { UrlsModule } from './urls/urls.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('REACT_APP_MONGODB_URI'),
      }),
    }),
    UrlsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
