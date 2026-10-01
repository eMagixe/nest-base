import { Module } from '@nestjs/common'
import { ProfileService } from './profile.service'
import { ProfileController } from './profile.controller'
import { PasswordResetService } from './password-reset.service'
import { EmailModule } from '@email'

@Module({
	imports: [EmailModule],
	controllers: [ProfileController],
	providers: [PasswordResetService, ProfileService],
	exports: [ProfileService, PasswordResetService]
})
export class ProfileModule {}
