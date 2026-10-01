import { UserRole, UserStatus } from '@generated/prisma/enums'

export class ViewUserDTO {
	id!: string
	email!: string
	firstName!: string
	lastName!: string
	role!: UserRole
	status!: UserStatus
	createdAt!: Date
	createdBy!: string
}
