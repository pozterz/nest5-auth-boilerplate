import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'database/database.module';
import { UserProviders } from './users.providers';
import { CryptoService } from '../utils/crypto.service'
import { MailerService } from 'utils/mailer.service';
import { AuthMiddleware } from 'middlewares/auth.middleware';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [CryptoService, MailerService, ...UserProviders, UsersService]
})
export class UsersModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'users/auth', method: RequestMethod.POST },
        { path: 'users/check/:token', method: RequestMethod.GET },
        { path: 'users/reset/:token', method: RequestMethod.POST },
        { path: 'users/reset', method: RequestMethod.POST },
      )
      .forRoutes(UsersController);
  }
}
