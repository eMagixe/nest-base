import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { WelcomeEmailService } from './welcome.email.service'
import { TemplateService } from './template.service'

@Module({
	providers: [EmailService, WelcomeEmailService, TemplateService],
	exports: [WelcomeEmailService]
})
export class EmailModule {}
