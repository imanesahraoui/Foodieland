import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RecipesModule } from './recipes/recipes.module';
import { CategoriesModule } from './category/category.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      ignoreEnvFile: process.env.NODE_ENV === 'production',
      envFilePath: '../.env',
    }),
    RecipesModule,
    CategoriesModule,

    MongooseModule.forRootAsync({
      imports: [ConfigModule, AuthModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const username = configService.get<string>('MONGO_USERNAME');
        const password = configService.get<string>('MONGO_PASSWORD');
        const dbName = configService.get<string>('MONGO_DB_NAME');
        const host = configService.get<string>('MONGO_HOST');
        const port = configService.get<string>('MONGO_PORT');
        const uri = `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;
        console.log('MongoDB URI:', uri);
        return {
          uri,
        };
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
