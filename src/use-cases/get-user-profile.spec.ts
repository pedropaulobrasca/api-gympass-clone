import { hash } from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'

import { ResourceNotFoundError } from './errors/resource-not-found'
import { GetUserProfileUseCase } from './get-user-profile'

// Test unitario ele serve para testar uma unidade totalmente isolada do sistema
// Ou seja ele não depende de nenhuma outra parte do sistema para ser testado

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able get user profile by id', async () => {
    const createdUser = await usersRepository.create({
      name: 'Pedro Paulo',
      email: 'pedropaulobrasca@gmail.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.id).toEqual(expect.any(String))
    expect(user.name).toEqual('Pedro Paulo')
  })

  it('should not be able get user profile by wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
