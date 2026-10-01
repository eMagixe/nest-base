import { Injectable, UnauthorizedException } from '@nestjs/common'
import { UserJWT } from '@auth/models/user-jwt'
import { config, Hasher, UserStatus } from '@app'
import { AccessDTO, LoginDataDTO, LoginDTO } from './dto'
import { PrismaService } from '@prisma/prisma.service'
import { ProfileService } from '@profile/profile.service'

const ERROR_MESSAGE = 'Неверный email или пароль'

@Injectable()
export class AuthService {
	private readonly jwt = new UserJWT(config.jwt.secret, config.jwt.expirationSeconds)

	constructor(
		private readonly prisma: PrismaService,
		private readonly profile: ProfileService
	) {}

	public async login(dto: LoginDTO): Promise<AccessDTO> {
		const user: LoginDataDTO = await this.retrieveForLogin(dto.email)
		this.checkLoginPermission(user)
		const match = await Hasher.verify(dto.password, user.hash)
		if (!match) {
			throw new UnauthorizedException(ERROR_MESSAGE)
		}

		const token = await this.jwt.sign(user.id, user.role)
		const profile = await this.profile.getProfile(user.id)

		return { token, ...profile }
	}

	private async retrieveForLogin(email: string): Promise<LoginDataDTO> {
		const user = await this.prisma.user.findFirst({
			where: { email: { equals: email, mode: 'insensitive' } },
			select: { id: true, hash: true, role: true, status: true }
		})

		if (!user || !user.hash) {
			throw new UnauthorizedException(ERROR_MESSAGE)
		}

		return {
			id: user.id,
			role: user.role,
			status: user.status,
			hash: user.hash
		}
	}

	private checkLoginPermission(user: LoginDataDTO): void {
		if (user.status !== UserStatus.active) {
			throw new UnauthorizedException(ERROR_MESSAGE)
		}
	}
}
