import { NestFactory, FastifyAdapter } from '@nestjs/core';
import { AppModule } from './app.module';
import { Config } from './config/'
import * as helmet from 'helmet';
import * as express from 'express'
import * as bodyParser from 'body-parser'

// import * as rateLimit from 'express-rate-limit';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api')
  app.use('/upload', express.static(__dirname + '/../upload'))
  app.use(bodyParser.json({ limit: '3MB' }))
  app.use(helmet());
  app.enableCors()
  // uncomment here if you want to use API rate limit and install express-rate-limit
  // app.use(rateLimit({
  //   windowMs: 15 * 60 * 1000, // 15 minutes
  //   max: 100 // limit each IP to 100 requests per windowMs
  // }));
  await app.listen(Config.port);
}
bootstrap();
