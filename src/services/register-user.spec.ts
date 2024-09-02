import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUserService } from './register-user'

// Test unitario ele serve para testar uma unidade totalmente isolada do sistema
// Ou seja ele não depende de nenhuma outra parte do sistema para ser testado

describe('Register Service', () => {
  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUserService = new RegisterUserService(inMemoryUsersRepository)

    const { user } = await registerUserService.execute({
      name: 'John Doe',
      email: 'johndoe@acme.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should to register', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUseCase = new RegisterUserService(inMemoryUsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should throw an error if user already exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUserService = new RegisterUserService(inMemoryUsersRepository)

    const email = 'johndoe@acme.com'

    const { user } = await registerUserService.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    console.log('user', user)

    expect(async () => {
      await registerUserService.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
