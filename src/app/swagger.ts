import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

export const setupSwagger = (app: INestApplication): void => {
	const options = new DocumentBuilder()
		.setTitle('NestJS API')
		.setDescription('Default NestJS API for the application initialization')
		.setVersion('0.0.1')
		.build()

	const documentFactory = SwaggerModule.createDocument(app, options)

	SwaggerModule.setup('api/v1/docs', app, documentFactory)
}
