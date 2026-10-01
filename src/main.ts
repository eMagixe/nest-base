import { NestFactory } from '@nestjs/core'
import { AppModule } from '@app.module'
import { Logger, ValidationPipe } from '@nestjs/common'
import { config, setupSwagger } from '@app'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	app.useGlobalPipes(new ValidationPipe())

	if (config.env !== 'production') {
		setupSwagger(app)
	}
	await app.listen(config.port)
}

bootstrap().then(() => {
	new Logger().log(`Application Docs on: http://localhost:${config.port}/api/v1/docs`)
})
