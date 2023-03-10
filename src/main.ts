import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { SeederService } from './database/seeds/seeder.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Lecture App API')
    .setDescription('It contains superadmin, admin(one admin for every franchisee) student and lecturer roles.')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('franchisee')
    .addTag('user')
    .addTag('lecture')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const seeder = app.get(SeederService)
  await seeder.seed();
  await app.listen(3000);

}
bootstrap();
