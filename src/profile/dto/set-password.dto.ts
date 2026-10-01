import { IsEmail, IsString, IsStrongPassword } from 'class-validator'

export class SetPasswordDTO {
	@IsString()
	code: string | undefined

	@IsEmail()
	email: string | undefined

	@IsStrongPassword()
	password: string | undefined
}
