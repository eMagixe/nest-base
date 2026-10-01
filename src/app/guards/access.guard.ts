import { CanActivate, ExecutionContext, ForbiddenException, Logger, UnauthorizedException } from '@nestjs/common'
import { config, RequestWithUser, ROLES_METADATA_KEY, UserRole } from '@app'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { JWTUser, UserJWT } from '@auth/models/user-jwt'

const TOKEN_ERROR = 'Токен не действителен'

export class AccessGuard implements CanActivate {
	private readonly jwt: UserJWT = new UserJWT(config.jwt.secret, config.jwt.expirationSeconds)
	private readonly reflector: Reflector = new Reflector()
	private readonly logger: Logger = new Logger('AccessGuard')

	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request: RequestWithUser = context.switchToHttp().getRequest<RequestWithUser>()
		const token = this.extractToken(request)
		if (!token) return Promise.resolve(false)
		const user: JWTUser = await this.verify(token)
		this.checkRoles(context, user)

		request.user = user

		return true
	}

	private extractToken(request: Request): string {
		const authorization: string | undefined = request.headers.authorization
		if (!authorization || typeof authorization !== 'string') {
			throw new UnauthorizedException(TOKEN_ERROR)
		}
		const [type, token] = authorization.split(' ')
		if (type !== 'Bearer') {
			throw new UnauthorizedException(TOKEN_ERROR)
		}
		return token
	}

	private async verify(token: string): Promise<JWTUser> {
		try {
			return await this.jwt.verify(token)
		} catch (error) {
			this.logger.warn(`Попытка верификации токена: ${TOKEN_ERROR}`)
			throw new UnauthorizedException(TOKEN_ERROR)
		}
	}

	private checkRoles(context: ExecutionContext, user: JWTUser): void {
		const forMethod: UserRole[] = this.reflector.get<UserRole[]>(ROLES_METADATA_KEY, context.getHandler())

		if (forMethod?.length) {
			if (forMethod.includes(user.userRole as UserRole)) return
			else throw new ForbiddenException()
		}

		const forController: UserRole[] = this.reflector.get<UserRole[]>(ROLES_METADATA_KEY, context.getClass())

		if (!forController?.length) return

		if (!forController.includes(user.userRole as UserRole)) throw new ForbiddenException()
	}
}
