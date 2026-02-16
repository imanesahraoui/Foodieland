
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common'; 
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const frontendUrl = configService.get<string>('FRONTNED_URL');
  console.log('Config FRONTNED_URL:', frontendUrl);
  app.enableCors({
    origin: frontendUrl,
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const port = configService.get<number>('PORT')!;
  const host = configService.get<string>('HOST')!;
  console.log(`Starting server on ${host}:${port}...`);
  await app.listen(port, host);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
