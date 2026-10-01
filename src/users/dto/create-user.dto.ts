import { UserRole } from '@app'
import { IsEmail, IsEnum, Length } from 'class-validator'

export class CreateUserDTO {
	@IsEmail()
	email!: string

	@Length(1, 50)
	firstName!: string

	@Length(1, 50)
	lastName!: string

	@IsEnum(UserRole)
	role!: UserRole
}
