import { UserRole, UserStatus } from '@generated/prisma/enums'

export type LoginDataDTO = {
	id: string
	hash: string
	role: UserRole
	status: UserStatus
}
