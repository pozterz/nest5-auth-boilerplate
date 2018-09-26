import * as bcrypt from 'bcrypt'
import * as crypto from 'crypto'
import * as jwt from 'jsonwebtoken'

import { Injectable } from '@nestjs/common'

import { Config } from '../config'

@Injectable()
export class CryptoService {
	constructor() {}

	async createToken(data, key, expires) {
		if (expires) {
			data.iat = expires
		}
		return jwt.sign(data, key, { expiresIn: '24h' })
	}

	authorization(token, key) {
		return jwt.verify(token, key, (err, decoded) => decoded)
	}

	async randomToken(len = 20) {
		return await crypto.randomBytes(len).toString('hex')
	}

	async encryptPassword(password) {
		return bcrypt.hash(password, Config.saltRound)
	}

	async compare(password, hash) {
		return bcrypt.compare(password, hash)
	}
}
