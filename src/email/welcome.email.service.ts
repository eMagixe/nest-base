import { Injectable } from '@nestjs/common'
import { config } from '@app'
import { EmailService } from './email.service.js'
import { PasswordResetEmailDTO, WelcomeEmailDTO } from './dto/index.js'
import { TemplateService } from './template.service.js'

@Injectable()
export class WelcomeEmailService {
	constructor(
		private readonly template: TemplateService,
		private readonly email: EmailService
	) {}

	public async send(dto: PasswordResetEmailDTO): Promise<void> {
		const email = new WelcomeEmailDTO(dto)
		const html = await this.template.render(email)

		await this.email.send({
			to: dto.email,
			subject: config.email.welcome.subject,
			html
		})
	}
}
