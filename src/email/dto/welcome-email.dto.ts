import { PasswordResetEmailDTO } from './password-reset.email.dto.js'

export class WelcomeEmailDTO {
	public readonly template: string = 'welcome'
	public readonly name: string
	public readonly code: string
	public readonly expires: string

	constructor(dto: PasswordResetEmailDTO) {
		this.name = dto.name
		this.code = dto.code
		this.expires = dto.expiresAt.toLocaleDateString('ru-RU')
	}
}
