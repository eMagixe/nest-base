import { JWTUser } from '@auth/models/user-jwt'
import { Request } from 'express'

export type RequestWithUser = Request & {
	user: JWTUser
}
