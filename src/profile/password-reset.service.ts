import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from '@prisma/prisma.service'
import { Prisma } from '@generated/prisma/client'
import { PasswordResetCodeDTO } from './dto'
import { config, Hasher } from '@app'
import { randomInt } from 'crypto'

@Injectable()
export class PasswordResetService {
	constructor(private readonly prisma: PrismaService) {}

	public async createOrReplace(userId: string): Promise<PasswordResetCodeDTO> {
		const expiresAt = this.expiresAt()
		const code = this.generateCode()
		const hash = await Hasher.hash(code)

		const user: Prisma.PasswordResetUncheckedCreateInput = {
			userId,
			expiresAt,
			attempts: 0,
			code: hash,
			createdAt: new Date()
		}

		await this.prisma.passwordReset.upsert({
			where: { userId },
			update: user,
			create: user
		})

		return {
			code,
			expiresAt
		}
	}

	public async setPassword(userId: string, code: string, password: string): Promise<void> {
		await this.checkBeforeReset(userId, code).then(async () => {
			const hash = await Hasher.hash(password)
			await this.prisma.passwordReset.delete({ where: { userId } })
			await this.prisma.user.update({
				where: { id: userId },
				data: { hash }
			})
		})
	}

	private async checkBeforeReset(userId: string, code: string): Promise<void> {
		const resetData = await this.prisma.passwordReset.findFirst({
			where: {
				userId,
				expiresAt: { gte: new Date() }
			}
		})

		if (!resetData) {
			throw new UnauthorizedException('Код для сброса пароля не найден')
		} else if (resetData.attempts >= config.password.code.attempts) {
			throw new UnauthorizedException('Превышено количество попыток сброса пароля')
		} else if (!(await Hasher.verify(code, resetData.code))) {
			await this.incrementAttempts(userId, resetData.attempts)
			throw new UnauthorizedException('Неверный код для сброса пароля')
		}
	}

	private async incrementAttempts(userId: string, attempts: number): Promise<void> {
		await this.prisma.passwordReset.update({
			where: { userId },
			data: { attempts: attempts + 1 }
		})
	}

	private generateCode(): string {
		const { min, max } = config.password.code
		const code = randomInt(min, max + 1)
		const count = String(max).length
		return String(code).padStart(count, '0')
	}

	private expiresAt(): Date {
		const { expirationDays } = config.password.code
		const expiresAt = new Date()
		expiresAt.setDate(expiresAt.getDate() + expirationDays)
		return expiresAt
	}
}
