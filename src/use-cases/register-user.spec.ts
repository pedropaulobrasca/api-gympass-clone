import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUserUseCase } from './register-user'

// Test unitario ele serve para testar uma unidade totalmente isolada do sistema
// Ou seja ele não depende de nenhuma outra parte do sistema para ser testado

describe('Register Use Case', () => {
  it('should hash user password upon registration', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUserUseCase(inMemoryUsersRepository)

    const { user } = await registerUserUseCase.execute({
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
    const registerUseCase = new RegisterUserUseCase(inMemoryUsersRepository)

    const { user } = await registerUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })

  it('should throw an error if user already exists', async () => {
    const inMemoryUsersRepository = new InMemoryUsersRepository()
    const registerUserUseCase = new RegisterUserUseCase(inMemoryUsersRepository)

    const email = 'johndoe@acme.com'

    await registerUserUseCase.execute({
      name: 'John Doe',
      email,
      password: '123456',
    })

    await expect(async () => {
      await registerUserUseCase.execute({
        name: 'John Doe',
        email,
        password: '123456',
      })
    }).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
