import { Injectable } from '@nestjs/common'
import { WelcomeEmailDTO } from '@email/dto'
import { join } from 'path'
import { readFile } from 'fs/promises'
import Handlebars from 'handlebars'

@Injectable()
export class TemplateService {
	private readonly templatesFolder: string = join(process.cwd(), 'src', 'email', 'templates')

	public async render(dto: WelcomeEmailDTO): Promise<string> {
		const filePath = join(this.templatesFolder, `${dto.template}.hbs`)
		const template = await readFile(filePath, 'utf-8')
		const delegate = Handlebars.compile(template)
		return delegate(dto)
	}
}
