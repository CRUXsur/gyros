import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Enable CORS
  app.enableCors({
    origin: [
      'http://localhost:5173', // Vite default port
      'http://localhost:3001', // Alternative frontend port
      'http://localhost:8080', // Alternative frontend port
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });


  app.setGlobalPrefix('api');

  app.useGlobalPipes( 
    new ValidationPipe({ 
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  await app.listen(process.env.PORT ?? 3001);
  //console.log(`Server is running on port ${process.env.PORT ?? 3001}`);
}
bootstrap();
