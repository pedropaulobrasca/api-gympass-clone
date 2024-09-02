import { User } from '@prisma/client'
import { hash } from 'bcryptjs'

import { UsersRepository } from '@/repositories/users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterServiceProps {
  name: string
  email: string
  password: string
}

interface RegisterUserServiceResponse {
  user: User
}

export class RegisterUserService {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterServiceProps): Promise<RegisterUserServiceResponse> {
    const userAlreadyExists = await this.usersRepository.findByEmail(email)

    if (userAlreadyExists) {
      throw new UserAlreadyExistsError()
    }

    const password_hash = await hash(password, 8)

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })

    return { user }
  }
}
