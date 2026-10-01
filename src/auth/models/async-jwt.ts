import jwt from 'jsonwebtoken'
import { UserRole } from '@generated/prisma/enums'

const ALGORITHM: jwt.Algorithm = 'HS256'

export type JWTData = {
	/** @description: User ID */
	sub: string

	/** @description: Issued at */
	iat: number

	/** @description: Expiration time */
	exp: number

	/** @description: User ROLE */
	role: UserRole
}

export class AsyncJWT {
	constructor(private readonly secret: string) {}

	public async sign(data: JWTData): Promise<string> {
		return new Promise((resolve, reject) => {
			return jwt.sign(data, this.secret, { algorithm: ALGORITHM }, (error, encoded) => {
				if (error) {
					return reject(error)
				} else {
					if (encoded) return resolve(encoded)
					else return reject(new Error('Cannot sign JWT. Got undefined instead of token'))
				}
			})
		})
	}

	public async verify(token: string): Promise<JWTData> {
		return new Promise((resolve, reject) => {
			return jwt.verify(token, this.secret, { algorithms: [ALGORITHM] }, (error, decoded) => {
				if (error) {
					return reject(error)
				} else {
					if (decoded) {
						if (!this.checkPayload(decoded)) {
							return reject(new Error('Cannot verify JWT. Got invalid payload'))
						} else {
							return resolve(decoded)
						}
					} else return reject(new Error('Cannot verify JWT. Got undefined instead of payload'))
				}
			})
		})
	}

	private checkPayload(decoded: unknown): decoded is JWTData {
		return (
			typeof decoded === 'object' &&
			decoded !== null &&
			'sub' in decoded &&
			'iat' in decoded &&
			'exp' in decoded &&
			'role' in decoded
		)
	}
}
