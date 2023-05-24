import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{cors:true});
  app.enableCors({
    allowedHeaders: ['content-type'],
    origin: ['http://localhost:3000','https://pypaplanning.netlify.app/'],
    credentials: true,
  });
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

  await app.listen(3001);
}
bootstrap();
