import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as bcrypt from 'bcrypt';
import { Connection } from 'mongoose';
import { getConnectionToken } from '@nestjs/mongoose';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const connection = app.get<Connection>(getConnectionToken());

  const email = 'admin@test.com';
  const password = 'admin123';

  

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('1. Generated Hash:', hashedPassword);

  const isMatch = await bcrypt.compare(password, hashedPassword);
  console.log('2. Immediate Verification Check:', isMatch);

  if (!isMatch) {
    console.error(
      'CRITICAL ERROR: bcrypt is failing locally. Re-install bcrypt.',
    );
    process.exit(1);
  }

  await connection.collection('admins').deleteMany({ email });
  console.log('3. Deleted old admin user(s)');

  await connection.collection('admins').insertOne({
    email,
    password: hashedPassword,
    fullName: 'Fixed Admin',
    profilePicture: '',
    refreshToken: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('4. Inserted new verified user.');
 
  console.log(`Try logging in now with: ${email} / ${password}`);

  await app.close();
}
bootstrap();
