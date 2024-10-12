import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { PrismaClientExceptionFilter } from 'nestjs-prisma';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const environment = configService.get<string>('NODE_ENV');

  app.setGlobalPrefix('/api');
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
      whitelist: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(Reflector), {
      strategy: 'excludeAll',
      excludeExtraneousValues: true,
    }),
  );

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));

  if (environment === 'debug') {
    const swaggerEndpoint =
      configService.get<string>('SWAGGER_ENDPOINT') ?? 'swagger';
    const config = new DocumentBuilder()
      .setTitle('Search Engine')
      .setDescription("Let's try making a minioogle")
      .setVersion('1.0')
      .addTag('default')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup(swaggerEndpoint, app, document);
    Logger.verbose(
      `Swagger Documentation is being served under /${swaggerEndpoint}`,
    );
  }

  const port = Number(configService.get<string>('PORT') ?? '3000');
  Logger.verbose(`Application is running @ ${port}`);
  await app.listen(port);
}
bootstrap();
