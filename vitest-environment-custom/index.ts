import 'dotenv/config'

import { execSync } from 'node:child_process'
import { randomUUID } from 'node:crypto'

import { PrismaClient } from '@prisma/client'
import type { Environment } from 'vitest'

const prisma = new PrismaClient()

const generateDatabaseURL = (schema: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error()
  }

  const url = new URL(process.env.DATABASE_URL)

  url.searchParams.set('schema', schema)

  return url.toString()
}

const customEnvironment: Environment = {
  name: 'custom',
  transformMode: 'ssr',

  // Função de setup para configurar o contexto do VM
  async setupVM() {
    const vm = await import('node:vm')
    const context = vm.createContext()
    return {
      getVmContext() {
        return context
      },
      teardown() {
        // Função chamada após todos os testes terminarem
        console.log('VM teardown')
      },
    }
  },

  // Função de setup personalizada
  setup() {
    const schema = randomUUID()
    const databaseURL = generateDatabaseURL(schema)

    process.env.DATABASE_URL = databaseURL

    execSync('pnpm dlx prisma migrate deploy')

    return {
      async teardown() {
        try {
          // Exclui o schema temporário após os testes
          await prisma.$executeRawUnsafe(
            `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
          )
          console.log(`Schema ${schema} deletado com sucesso.`)
        } catch (error) {
          console.error(`Erro ao deletar o schema ${schema}:`, error)
        } finally {
          await prisma.$disconnect()
        }
      },
    }
  },
}

export default customEnvironment
