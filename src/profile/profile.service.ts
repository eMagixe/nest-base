import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { PasswordResetCodeDTO, ProfileViewDTO, SetPasswordDTO } from './dto/index.js'
import { UserStatus } from '@app'
import { PasswordResetService } from './password-reset.service.js'
import { PrismaService } from '@prisma/prisma.service'
import { WelcomeEmailService } from '@email'

@Injectable()
export class ProfileService {
	constructor(
		private readonly welcomeEmailService: WelcomeEmailService,
		private readonly prisma: PrismaService,
		private readonly passwordResetService: PasswordResetService
	) {}

	public async getProfile(id: string): Promise<ProfileViewDTO> {
		const user = await this.prisma.user.findUnique({
			where: { id },
			select: {
				email: true,
				firstName: true,
				lastName: true,
				role: true
			}
		})

		if (!user) {
			throw new NotFoundException('Пользователь не найден')
		}

		return {
			id,
			email: user.email,
			firstName: user.firstName,
			lastName: user.lastName,
			role: user.role
		}
	}

	async setPassword({ code, password, email }: SetPasswordDTO): Promise<void> {
		const user = await this.prisma.user.findFirst({
			where: {
				email: {
					equals: email,
					mode: 'insensitive'
				}
			}
		})

		if (user) {
			if (user.status === UserStatus.banned) {
				throw new ForbiddenException('Пользователь заблокирован')
			} else {
				if (code && password) {
					return await this.passwordResetService.setPassword(user.id, code, password)
				}
			}
		}
	}

	async resetPassword(email: string): Promise<void> {
		const user = await this.prisma.user.findFirst({
			where: {
				email: {
					equals: email,
					mode: 'insensitive'
				}
			}
		})

		if (user) {
			if (user.status === UserStatus.banned) {
				throw new ForbiddenException('Пользователь заблокирован')
			} else {
				const resetData: PasswordResetCodeDTO = await this.passwordResetService.createOrReplace(user.id)
				await this.welcomeEmailService.send({
					email,
					name: user.firstName,
					code: resetData.code,
					expiresAt: resetData.expiresAt
				})
			}
		}
	}
}
