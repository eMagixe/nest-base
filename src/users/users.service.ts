import { BadGatewayException, BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { UserRole, UserStatus } from '@app'
import { PasswordResetService } from '@profile'
import { WelcomeEmailService } from '@email'
import { BanUserDTO, CreateUserDTO, UpdateUserDTO, ViewUserDTO } from '@users/dto'
import { PrismaService } from '@prisma'
import { randomUUID } from 'node:crypto'
import { UserViewMapper } from './mappers/user-view.mapper'

@Injectable()
export class UsersService {
	constructor(
		private readonly welcomeEmailService: WelcomeEmailService,
		private readonly prisma: PrismaService,
		private readonly passwordResetService: PasswordResetService
	) {}

	async create(dto: CreateUserDTO, createdBy: string): Promise<ViewUserDTO> {
		await this.checkEmailExists(dto.email)

		const data = {
			id: randomUUID(),
			email: dto.email,
			role: UserRole.user,
			firstName: dto.firstName,
			lastName: dto.lastName,
			status: UserStatus.active,
			createdBy
		}

		const createdUser = await this.prisma.user.create({ data })

		if (createdUser) {
			const resetData = await this.passwordResetService.createOrReplace(createdUser.id)
			await this.welcomeEmailService.send({
				code: resetData.code,
				email: createdUser.email,
				name: createdUser.firstName,
				expiresAt: resetData.expiresAt
			})
			return UserViewMapper.mapOne(createdUser)
		} else {
			throw new BadGatewayException('Пользователь не создан')
		}
	}

	async findAll(): Promise<ViewUserDTO[]> {
		const users = await this.prisma.user.findMany()

		if (users) {
			return UserViewMapper.mapMany(users)
		} else {
			throw new NotFoundException('Пользователи не найдены')
		}
	}

	async findOne(id: string): Promise<ViewUserDTO> {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (user) {
			return UserViewMapper.mapOne(user)
		} else {
			throw new NotFoundException('Пользователь не найден')
		}
	}

	async update(id: string, dto: UpdateUserDTO): Promise<ViewUserDTO> {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (user) {
			if (user.email !== dto.email) await this.checkEmailExists(dto.email)
			const updatedUser = await this.prisma.user.update({ where: { id }, data: dto })
			return UserViewMapper.mapOne(updatedUser)
		} else {
			throw new NotFoundException('Пользователь не найден')
		}
	}

	async ban(id: string, dto: BanUserDTO): Promise<UserStatus> {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (user) {
			const updatedUser = await this.prisma.user.update({
				where: { id },
				data: {
					status: dto.banned ? UserStatus.banned : UserStatus.active
				}
			})
			return updatedUser.status as UserStatus
		} else {
			throw new NotFoundException('Пользователь не найден')
		}
	}

	async delete(id: string): Promise<void> {
		const user = await this.prisma.user.findUnique({ where: { id } })

		if (user) {
			await this.prisma.user.delete({ where: { id } })
		} else {
			throw new NotFoundException('Пользователь не найден')
		}
	}

	async checkEmailExists(email: string): Promise<void> {
		const user = await this.prisma.user.findFirst({
			where: { email: { equals: email, mode: 'insensitive' } },
			select: { id: true }
		})
		if (user) throw new BadRequestException('Пользователь с таким email уже существует')
	}
}
