import { PrismaClient } from '@prisma/client'
import bcrypt from "bcryptjs"
import Chance from 'chance'

const prisma = new PrismaClient()
const chance = new Chance()

const main = async () => {
  await prisma.user.createMany({
    data: [
      {
        username: chance.name().toString(),
        passwordHash: await bcrypt.hash(chance.word().toString(), 10)
      },
      {
        username: chance.name().toString(),
        passwordHash: await bcrypt.hash(chance.word().toString(), 10)
      },
      {
        username: chance.name().toString(),
        passwordHash: await bcrypt.hash(chance.word().toString(), 10)
      },
      {
        username: chance.name().toString(),
        passwordHash: await bcrypt.hash(chance.word().toString(), 10)
      },
      {
        username: chance.name().toString(),
        passwordHash: await bcrypt.hash(chance.word().toString(), 10)
      },
      {
        username: chance.name().toString(),
        passwordHash: await bcrypt.hash(chance.word().toString(), 10)
      },
    ]
  })
}

main()