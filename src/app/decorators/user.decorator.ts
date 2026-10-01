import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { JWTUser } from '@auth/models/user-jwt'
import { RequestWithUser } from '@app/dto/request-with-user.dto'

/**
 * @description Parameter decorator. Gets the user from the request
 * @returns {JWTUser} The user from the request
 */
export const User = createParamDecorator((data: unknown, context: ExecutionContext): JWTUser => {
	const request: RequestWithUser = context.switchToHttp().getRequest<RequestWithUser>()
	if (!request.user) {
		throw new UnauthorizedException()
	}
	return request.user
})
