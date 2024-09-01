import { hash } from 'bcryptjs'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

export class RegisterUserService {
  constructor(private usersRepository: any) {}

  async execute({ name, email, password }: RegisterServiceProps) {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new Error('User already exists')
    }

    const password_hash = await hash(password, 8)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return user
  }
}
