import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { ProfileModule } from '@profile'
import { EmailModule } from '@email'

@Module({
	imports: [ProfileModule, EmailModule],
	controllers: [UsersController],
	providers: [UsersService]
})
export class UsersModule {}
