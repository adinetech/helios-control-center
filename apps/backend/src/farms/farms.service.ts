import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.farm.findMany();
  }

  async findById(id: string) {
    return this.prisma.farm.findUnique({ where: { id } });
  }

  async create(data: any) {
    return this.prisma.farm.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.farm.update({ where: { id }, data });
  }
}
