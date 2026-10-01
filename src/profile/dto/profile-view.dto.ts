import { UserRole } from '@generated/prisma/enums'

export class ProfileViewDTO {
	id: string | undefined
	email: string | undefined
	firstName: string | undefined
	lastName: string | undefined
	role: UserRole | undefined
}
