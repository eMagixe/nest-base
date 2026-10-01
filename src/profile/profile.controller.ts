import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileViewDTO, ResetPasswordDTO, SetPasswordDTO } from './dto'
import { AccessGuard, User } from '@app'
import type { JWTUser } from '@auth/models/user-jwt'

@Controller('profile')
export class ProfileController {
	constructor(private readonly profileService: ProfileService) {}

	@Get()
	@UseGuards(AccessGuard)
	getProfile(@User() user: JWTUser): Promise<ProfileViewDTO> {
		return this.profileService.getProfile(user.userId)
	}

	@Post('set-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	async setPassword(@Body() dto: SetPasswordDTO): Promise<void> {
		return await this.profileService.setPassword(dto)
	}

	@Post('reset-password')
	@HttpCode(HttpStatus.NO_CONTENT)
	resetPassword(@Body() { email }: ResetPasswordDTO): Promise<void> {
		if (email) {
			return this.profileService.resetPassword(email)
		} else {
			return Promise.reject()
		}
	}
}
