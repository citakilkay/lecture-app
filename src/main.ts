import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Lecture App API')
    .setBasePath('api')
    .setDescription('It contains superadmin, admin(one admin for every franchisee) student and lecturer roles.')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('franchisee')
    .addTag('user')
    .addTag('lecture')
    .addBearerAuth({
      scheme: 'bearer', bearerFormat: 'JWT',
      type: 'http', openIdConnectUrl: 'http://localhost:3000/api/auth/signin'
    }, 'access-token')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);

}
bootstrap();
