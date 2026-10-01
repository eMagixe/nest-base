import { Body, Controller, Post } from '@nestjs/common'
import { AuthService } from './auth.service.js'
import { AccessDTO, LoginDTO } from './dto/index.js'

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	login(@Body() dto: LoginDTO): Promise<AccessDTO> {
		return this.authService.login(dto)
	}
}
