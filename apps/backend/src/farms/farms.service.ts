import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FarmsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.farm.findMany();
  }

  async remove(id: string) {
    // Delete linked telemetry first to avoid FK constraint violation
    await this.prisma.telemetry.deleteMany({ where: { farmId: id } });
    return this.prisma.farm.delete({ where: { id } });
  }

  async getTelemetry(farmId: string, minutes: number = 60) {
    const since = new Date(Date.now() - minutes * 60000);
    return this.prisma.telemetry.findMany({
      where: { farmId, timestamp: { gte: since } },
      orderBy: { timestamp: 'asc' },
    });
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
