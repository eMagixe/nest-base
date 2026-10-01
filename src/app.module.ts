import { Module } from '@nestjs/common'
import { PrismaModule } from '@prisma'
import { AuthModule } from '@auth'
import { ProfileModule } from '@profile'
import { UsersModule } from '@users'

@Module({
	imports: [PrismaModule, AuthModule, ProfileModule, UsersModule]
})
export class AppModule {}
