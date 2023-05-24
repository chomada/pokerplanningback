import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
 
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });
  const corsOptions: CorsOptions = {
    allowedHeaders: ['origin', 'x-requested-with', 'content-type', 'accept', 'authorization'],
    credentials: true,
    origin: ['https://pypaplanning.netlify.app', 'http://localhost:3000'],
  }
  app.enableCors(corsOptions);

  await app.listen(3001);
}
bootstrap();
