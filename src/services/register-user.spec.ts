import { compare } from 'bcryptjs'
import { describe, expect, it } from 'vitest'

import { RegisterUserService } from './register-user'

// Test unitario ele serve para testar uma unidade totalmente isolada do sistema
// Ou seja ele não depende de nenhuma outra parte do sistema para ser testado

describe('Register Service', () => {
  it('should hash user password upon registration', async () => {
    const registerUserService = new RegisterUserService({
      async findByEmail() {
        return null
      },

      async create(data) {
        return {
          id: 'user-id-1',
          name: data.name,
          email: data.name,
          password_hash: data.password_hash,
          created_at: new Date(),
        }
      },
    })

    const { user } = await registerUserService.execute({
      name: 'John Doe',
      email: 'johndoe1@acme.com',
      password: '123456',
    })

    const isPasswordCorrectlyHashed = await compare(
      '123456',
      user.password_hash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })
})
