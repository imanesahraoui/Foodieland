import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const connection = app.get<Connection>(getConnectionToken());

  await connection.collection('admins').deleteOne({ email: 'admin@test.com' });
  console.log('Deleted bad user');

  await app.close();
}
bootstrap();
