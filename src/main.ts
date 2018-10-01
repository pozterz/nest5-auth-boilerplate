import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config/'
import * as helmet from 'helmet';
import * as express from 'express'
import * as bodyParser from 'body-parser'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// import * as rateLimit from 'express-rate-limit';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix(Config.path.preFixApi)
  app.use(Config.path.upload, express.static(Config.path.static))
  app.use(bodyParser.json({ limit: '3MB' }))
  app.use(helmet());
  app.enableCors()
  // uncomment here if you want to use API rate limit and install express-rate-limit
  // app.use(rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   max: 100 // limit each IP to 100 requests per windowMs
  // }));
  const options = new DocumentBuilder()
        .setBasePath('/api')
        .setTitle('APIs')
        .setDescription('APIs Documentation')
        .setVersion('1.0')
        .addTag('v1')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);
  await app.listen(Config.port);
}
bootstrap();
