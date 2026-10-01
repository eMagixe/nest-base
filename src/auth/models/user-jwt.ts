import { AsyncJWT, JWTData } from './async-jwt.js'
import { UserRole } from '@generated/prisma/enums'

const ONE_SECOND = 1_000

export type JWTUser = {
	userId: string
	userRole: UserRole
}

export class UserJWT {
	private readonly jwt: AsyncJWT

	constructor(
		secret: string,
		private readonly expirationSeconds: number
	) {
		this.jwt = new AsyncJWT(secret)
	}

	public async sign(userId: string, userRole: UserRole): Promise<string> {
		const iat = Math.floor(Date.now() / ONE_SECOND)
		const exp = iat + this.expirationSeconds

		return this.jwt.sign({
			sub: userId,
			role: userRole,
			iat,
			exp
		})
	}

	public async verify(token: string): Promise<JWTUser> {
		const data: JWTData = await this.jwt.verify(token)
		return {
			userId: data.sub,
			userRole: data.role
		}
	}
}
