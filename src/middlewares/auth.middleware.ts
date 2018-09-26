import { Injectable, NestMiddleware, MiddlewareFunction, UnauthorizedException } from '@nestjs/common';

import { UsersService } from '../users/users.service'

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(private readonly userService: UsersService) {}

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      let token = undefined
      const { authorization } = req.headers

      if (authorization) {
        token = authorization.split('Bearer ').join('')
      }

      if(token){
        const decodedToken = this.userService.authToken(token)
        req.token = token
        if (!decodedToken) {
          req.user = decodedToken
          return next();
        }
      }
      return next(new UnauthorizedException())
    };
  }
}