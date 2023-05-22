import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MessagesWsModule } from './messages-ws/messages-ws.module';
import { join } from 'path';

@Module({
  imports: [    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname,'..','public'), 
    }),
    MessagesWsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
