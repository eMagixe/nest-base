import * as argon2 from 'argon2'

export class Hasher {
	public static async hash(password: string): Promise<string> {
		return await argon2.hash(password)
	}
	public static async verify(password: string, hash: string): Promise<boolean> {
		try {
			return await argon2.verify(hash, password)
		} catch (error) {
			console.error(error)
			return false
		}
	}
}
