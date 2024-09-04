import { hash } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { AuthenticateUseCase } from './authenticate'

// Test unitario ele serve para testar uma unidade totalmente isolada do sistema
// Ou seja ele não depende de nenhuma outra parte do sistema para ser testado

describe('Authenticate Use Case', () => {
  it('should be able to authenticate', async () => {
    const usersRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(usersRepository)

    await usersRepository.create({
      name: 'Pedro Paulo',
      email: 'pedropaulobrasca@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      email: 'pedropaulobrasca@gmail.com',
      password: '123456',
    })

    expect(user.id).toEqual(expect.any(String))
  })
})
