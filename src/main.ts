import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { Request, Response } from 'express';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const clientDistPath = join(__dirname, '..', '..', 'client', 'dist');

  app.useStaticAssets(clientDistPath);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(clientDistPath);
  app.setViewEngine('html');


  app.use((_: Request, res: Response) => {
    res.sendFile(join(clientDistPath, 'index.html'));
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
