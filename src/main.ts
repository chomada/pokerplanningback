import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: ['http://localhost:3000','https://pypaplanning.netlify.app/'],
    credentials: true,
  });
  
  await app.listen(3001);
}
bootstrap();
