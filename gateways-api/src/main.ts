import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.setGlobalPrefix('api');
  const config = new DocumentBuilder()
    .setTitle('Gateways API')
    .setDescription('manage gateways and devices')
    .setVersion('1.0')
    .addTag('management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log('running on port: ' + port);
}

bootstrap();
