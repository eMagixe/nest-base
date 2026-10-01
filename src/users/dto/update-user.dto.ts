import { IsEmail, Length } from 'class-validator'

export class UpdateUserDTO {
	@IsEmail()
	email!: string

	@Length(1, 50)
	firstName!: string

	@Length(1, 50)
	lastName!: string
}
