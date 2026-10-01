import convict from 'convict'
import { randomBytes } from 'crypto'

const schema = convict({
	db: {
		doc: 'Database url',
		format: String,
		default: '',
		env: 'DATABASE_URL'
	},
	port: {
		doc: 'The application port',
		format: Number,
		default: 3030,
		env: 'PORT'
	},
	env: {
		doc: 'Application environment',
		format: String,
		default: 'development',
		env: 'ENV'
	},
	email: {
		service: {
			doc: 'Email service',
			format: String,
			default: 'gmail',
			env: 'EMAIL_SERVICE'
		},
		username: {
			doc: 'Email username',
			format: String,
			default: '',
			env: 'EMAIL_USERNAME'
		},
		password: {
			doc: 'Email password',
			format: String,
			default: '',
			env: 'EMAIL_PASSWORD'
		},
		welcome: {
			subject: {
				doc: '',
				format: String,
				default: 'Код авторизации',
				env: 'EMAIL_WELCOME_SUBJECT'
			},
			title: {
				doc: '',
				format: String,
				default: 'Приветствуем, ',
				env: 'EMAIL_WELCOME_TITLE'
			}
		}
	},
	password: {
		code: {
			min: {
				doc: 'Min length code',
				format: Number,
				default: 9_999,
				env: 'PASSWORD_RESET_MIN_LENGHT_CODE'
			},
			max: {
				doc: 'Max length code',
				format: Number,
				default: 999_999,
				env: 'PASSWORD_RESET_MAX_LENGHT_CODE'
			},
			expirationDays: {
				doc: 'Expiration days',
				format: Number,
				default: 7,
				env: 'PASSWORD_RESET_EXPIRATION_DAYS'
			},
			attempts: {
				doc: 'Password reset attempts',
				format: Number,
				default: 3,
				env: 'PASSWORD_RESET_ATTEMPTS'
			}
		}
	},
	jwt: {
		secret: {
			doc: 'JWT secret',
			format: String,
			default: randomBytes(32).toString('base64url'),
			env: 'JWT_SECRET'
		},
		expirationSeconds: {
			doc: 'JWT expiration seconds',
			format: Number,
			default: 3_600,
			env: 'JWT_EXPIRATION_SECONDS'
		}
	},
	seedUser: {
		email: {
			doc: 'Admin email',
			format: String,
			default: '',
			env: 'ADMIN_EMAIL'
		},
		password: {
			doc: 'Admin password',
			format: String,
			default: '',
			env: 'ADMIN_PASSWORD'
		},
		firstName: {
			doc: 'Admin first name',
			format: String,
			default: '',
			env: 'ADMIN_FIRSTNAME'
		},
		lastName: {
			doc: 'Admin last name',
			format: String,
			default: '',
			env: 'ADMIN_LASTNAME'
		}
	}
})

schema.validate({ allowed: 'strict' })

export const config = schema.getProperties()
