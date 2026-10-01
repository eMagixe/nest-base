import { ProfileViewDTO } from '@profile/dto'

export class AccessDTO extends ProfileViewDTO {
	token: string | undefined
}
