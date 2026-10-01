import { Injectable } from '@nestjs/common'
import { createTransport, SendMailOptions, Transporter } from 'nodemailer'
import { config } from '@app'

@Injectable()
export class EmailService {
	private readonly transporter: Transporter

	constructor() {
		this.transporter = createTransport({
			service: config.email.service,
			auth: {
				user: config.email.username,
				pass: config.email.password
			}
		})
	}

	public async send(options: SendMailOptions): Promise<void> {
		await this.transporter.sendMail(options)
	}
}
