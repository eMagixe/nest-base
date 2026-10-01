import 'dotenv/config'
import { randomUUID } from 'crypto'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client'
import { config, Hasher, UserRole, UserStatus } from '@app'

const prisma = new PrismaClient({
	adapter: new PrismaPg({
		connectionString: process.env.DATABASE_URL!
	})
})

export const seedUser = async (prisma: PrismaClient): Promise<void> => {
	const { email, password, firstName, lastName } = config.seedUser

	if (!(email && password && firstName && lastName)) {
		console.log('Не обнаружена конфигурация для создания пользователя')
		return
	}

	const user = await prisma.user.findFirst({
		where: {
			email: { equals: email, mode: 'insensitive' }
		}
	})

	if (user) {
		console.log('Пользователь с таким email уже существует')
		return
	}

	const id = randomUUID()
	const hash = await Hasher.hash(password)

	await prisma.user.create({
		data: {
			id,
			firstName,
			lastName,
			email,
			hash,
			role: UserRole.admin,
			status: UserStatus.active,
			createdBy: id
		}
	})

	console.log(`Пользователь ${email} успешно создан`)
}

async function main(): Promise<void> {
	await seedUser(prisma)
}

main()
	.catch((error) => {
		console.error(error)
		process.exitCode = 1
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
