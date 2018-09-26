import { Injectable, Inject } from '@nestjs/common';
import { Sequelize } from "sequelize-typescript";
import { Config } from "../config";
import { userRepo } from '../config/constants'
import { CryptoService } from "../utils/crypto.service";
import { Users } from './model/users.model';
import { paginate } from '../utils/utils.functions'
import * as moment from 'moment'
import { MailerService } from 'utils/mailer.service';

const Op = Sequelize.Op;

@Injectable()
export class UsersService {
  constructor(
    @Inject(userRepo) private readonly user: typeof Users,
    private readonly cryptoService: CryptoService,
    private readonly mailerService: MailerService,
  ) {}

  async getAll(options) {
		if (options['limit']) {
			return await paginate(this.user, options, this.genQuery(options))
		}
		return await this.user.findAll(this.genQuery(options))
	}

  async auth(userAuth, value, password) {
    console.log(await this.cryptoService.encryptPassword(password));
    const user = await this.findByMethod(userAuth, value);
    if (user && user.password) {
      if (await this.cryptoService.compare(password, user.password)) {
        return this.createToken(user);
      }
      return -2;
    }
    return -1;
  }

  async findByMethod(key: string, value: string): Promise<Users> {
    return this.user.findOne({
      attributes: { include: ["password"] },
      where: {
        [key]: value
      }
    });
  }

  async createToken(user) {
    const {
      user_id,
      name,
      username,
      email,
      image,
    } = user;
    return this.cryptoService.createToken(
      {
        user_id,
        username,
        email,
        name,
        image
      },
      Config.userKey,
      false
    );
  }

  genQuery(options) {
		let q = {}
		if (options['include']) q['include'] = options['include']
		if (options['orderby']) q['order'] = [[this.hasKey(options['orderby']), options['sort']]]
		if (options['limit']) q['limit'] = options['limit']
		if (options['page']) q['page'] = options['page']

		if (options['search']) {
			q['where'] = {
				[Op.or]: {
					name: {
						[Op.like]: `%${options['search']}%`
					},
					username: {
						[Op.like]: `%${options['search']}%`
					}
				}
			}
		}

		return q
  }
  
  hasKey(key) {
		return new Users().hasKey(key) ? key : 'user_id'
  }
  
  async encrpytPassword(password) {
    return await this.cryptoService.encryptPassword(password);
  }

  async sendResetPassword(user: Users) {
    if (user) {
      const token = await this.cryptoService.randomToken();
      user.resetPasswordToken = token;
      user.resetPasswordExpires = moment()
        .add({ [Config.resetpass.unit]: Config.resetpass.amount })
        .format();
      const saved = await user.save();
      if (saved) {
        const html = `Please use this <a href="${
          Config.resetpass.host
        }/reset/${token}">Link</a> to reset your password.`;
        return await this.mailerService.sendmail(
          user.email,
          html,
          "Reset Password"
        );
      }
    }
    return false;
  }

  async findByResetToken(token) {
    return await this.user.findOne({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          [Op.gt]: new Date()
        }
      }
    });
  }

  authToken(token) {
    return this.cryptoService.authorization(token, Config.userKey);
  }
}
