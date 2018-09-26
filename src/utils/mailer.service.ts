import * as nodemailer from 'nodemailer'

import { Injectable } from '@nestjs/common'

import { Config } from '../config'

@Injectable()
export class MailerService {
	constructor() {}

	async sendmail(to, data, subject, from = Config.email.from) {
		return await this.send(to, data, subject, from)
	}

	async send(to, html, subject, from) {
		const smtp = nodemailer.createTransport(Config.email.provider)
		const test = {
			to,
			from,
			subject,
			html
		}
		try {
			return await smtp.sendMail(test)
		} catch (error) {
			return Promise.reject(error)
		}
	}
}
