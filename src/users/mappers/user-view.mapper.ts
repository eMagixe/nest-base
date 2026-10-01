import { ViewUserDTO } from '@users/dto'
import { User } from '@generated/prisma/client'

export class UserViewMapper {
	static mapOne(user: User): ViewUserDTO {
		return {
			id: user.id,
			email: user.email,
			lastName: user.lastName,
			firstName: user.firstName,
			role: user.role,
			status: user.status,
			createdAt: user.createdAt,
			createdBy: user.createdBy
		}
	}

	static mapMany(users: User[]): ViewUserDTO[] {
		return users.map(this.mapOne)
	}
}
