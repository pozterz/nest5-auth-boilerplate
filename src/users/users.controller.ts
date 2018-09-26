import { Controller, Post, Body, Res, HttpStatus, Get, Query, Req, UseGuards, Patch, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Config } from '../config/'
import response from '../utils/wrapresponse.util'
import { User } from '../decorators/splittoken.decorators'
import { CryptoService } from 'utils/crypto.service';

@Controller('users')
export class UsersController {

  constructor(
    private readonly userService: UsersService,
    private readonly cryptoService: CryptoService,
    ) {}

  @Get()
  async getAllUsers(@Query() query, @Res() res) {
    const { limit = 25, page, orderby, sort, search } = query

		const options = {
			limit: +limit,
			page: +page || 1,
			orderby: orderby || 'user_id',
			sort: sort || 'ASC',
			search: search,
		}

		let status = HttpStatus.OK
		let data = await this.userService.getAll(options)
		return res.status(status).json(response(status, data))
  }

  @Post('auth')
  async auth(@Body() body, @Res() res) {
    let data = {}
    let status = HttpStatus.BAD_REQUEST
    const { password } = body
    let token = null

    if (body[Config.userAuth] && body.password) {
      token = await this.userService.auth(Config.userAuth, body[Config.userAuth], password)
    }

    if (token == -1) {
      data = {
        message: `Please register before use this application.`
      }
    } else if (token == -2) {
      data = {
        message: `Incorrect password.`
      }
    } else if (token) {
      status = HttpStatus.OK
      data = {
        token
      }
    } else {
      data = {
        message: `Invalid email or password.`
      }
    }
    return res.status(status).json(response(status, data))
  }

  @Patch()
  async updatePassword(@Body() body, @User() user, @Req() req, @Res() res) {
    let data = {}
    let status = HttpStatus.BAD_REQUEST

    const { currentPassword, password } = body

    if (currentPassword && password) {
      if (user) {
        if (this.cryptoService.compare(currentPassword, user.password)) {
          user.password = await this.cryptoService.encryptPassword(password)
          await user.save()
          status = HttpStatus.OK
          data = {
            message: 'Done.'
          }
        } else {
          data = {
            message: 'Current password is not match.'
          }
        }
      } else {
        data = {
          message: 'User not found.'
        }
      }
    } else {
      data = {
        message: 'Current password is not match.'
      }
    }

    return res.status(status).json(response(status, data))
  }

  @Post('/reset')
  async requestReset(@Body('username') username, @Res() res) {
    let data = {}
    let status = HttpStatus.BAD_REQUEST

    if (username) {
      const admin = await this.userService.findByMethod('username', username)
      if (admin) {
        await this.userService.sendResetPassword(admin)
        status = HttpStatus.OK
        data = {
          message: 'Reset password email has been sent.'
        }
      } else {
        data = {
          message: 'User not found'
        }
      }
    } else {
      data = {
        message: 'Username is required.'
      }
    }

    return res.status(status).json(response(status, data))
  }

  @Get('check/:token')
  async checkResetToken(@Param('token') token, @Res() res) {
    let data = {}
    let status = HttpStatus.OK

    const user = await this.userService.findByResetToken(token)
    if (!user) {
      status = HttpStatus.BAD_REQUEST
      data = {
        message: 'A token is invalid or has expired.'
      }
    } else {
      data = {
        message: true
      }
    }
    return res.status(status).json(response(status, data))
  }

  @Post('reset/:token')
  async resetPassword(@Param('token') token, @Body('password') password, @Body('confirm_password') confirm, @Res() res) {
    let data = {}
    let status = HttpStatus.OK

    if (password !== confirm) {
      status = HttpStatus.BAD_REQUEST
      data = {
        message: 'Password and confirm password not match.'
      }
    } else {
      const user = await this.userService.findByResetToken(token)
      if (!user) {
          status = HttpStatus.BAD_REQUEST
          data = {
            message: 'A token is invalid or has expired.'
          }
      } else {
        user.password = await this.userService.encrpytPassword(password)
        user.resetPasswordToken = null
        user.resetPasswordExpires = null
        await user.save()
        data = {
          message: 'Done.'
        }
      }
    }

    return res.status(status).json(response(status, data))
  }
}
