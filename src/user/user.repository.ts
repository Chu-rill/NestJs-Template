import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infra/db/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(username, email, password, phone, role) {
    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password, // Ensure to hash the password in production
        phone,
        role,
      },
    });
    return user;
  }

  async createUserOauth(firstName, lastName, email, profile) {
    const user = await this.prisma.user.create({
      data: {
        username: `${firstName} ${lastName}`, // Combine firstName and lastName to create a username
        email,
        profile,
      },
    });
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }
  async findUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        phone: true,
        role: true,
        isVerified: true,
      },
    });
    return user;
  }
  async update(id: string, updatedUser: Prisma.UserUpdateInput) {
    const updated = await this.prisma.user.update({
      where: { id },
      data: {
        ...updatedUser,
      },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        profile: true,
        phone: true,
        role: true,
        isVerified: true,
      },
    });
    return updated;
  }
  async verifyUser(email: string) {
    const user = await this.prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });
    return user;
  }
  async delete(id: string) {
    const user = await this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        phone: true,
        role: true,
        isVerified: true,
      },
    });
    return user;
  }
}
