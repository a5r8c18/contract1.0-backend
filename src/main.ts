/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);
 config ();
  // Configurar activos estáticos para avatares
  app.useStaticAssets(join(__dirname, '..', 'Uploads'), {
    prefix: '/Uploads/',
  });

  // Configurar CORS
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:5173'),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Iniciar el servidor
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap().catch((error) => {
  console.error('Failed to start the application:', error);
  process.exit(1);
});
