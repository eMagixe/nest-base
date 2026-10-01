import { Body, Controller, Get, Param, Post, Put, UseGuards } from '@nestjs/common'
import { UsersService } from './users.service.js'
import { BanUserDTO, CreateUserDTO, UpdateUserDTO, ViewUserDTO } from '@users/dto'
import { AccessGuard, IdParamDTO, Roles, User, UserRole, UserStatus } from '@app'
import type { JWTUser } from '@auth/models/user-jwt'

@Controller('users')
@UseGuards(AccessGuard)
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post()
	@Roles(UserRole.admin)
	async create(@Body() dto: CreateUserDTO, @User() { userId }: JWTUser): Promise<ViewUserDTO> {
		return await this.usersService.create(dto, userId)
	}

	@Get()
	findAll(): Promise<ViewUserDTO[]> {
		return this.usersService.findAll()
	}

	@Get(':id')
	findOne(@Param() { id }: IdParamDTO): Promise<ViewUserDTO> {
		return this.usersService.findOne(id)
	}

	@Put(':id')
	@Roles(UserRole.admin)
	update(@Param() { id }: IdParamDTO, @Body() dto: UpdateUserDTO): Promise<ViewUserDTO> {
		return this.usersService.update(id, dto)
	}

	@Put(':id/ban')
	@Roles(UserRole.admin)
	ban(@Param() { id }: IdParamDTO, @Body() dto: BanUserDTO): Promise<UserStatus> {
		return this.usersService.ban(id, dto)
	}
}
