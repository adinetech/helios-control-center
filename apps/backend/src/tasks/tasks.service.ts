import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TaskStatus, TaskPriority } from '@prisma/client';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.task.findMany({
      include: {
        farm: { select: { name: true } },
        assignee: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { title: string; description?: string; priority?: TaskPriority; farmId?: string; assigneeId?: string }) {
    return this.prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        status: 'PENDING',
        farmId: data.farmId || null,
        assigneeId: data.assigneeId || null,
      },
      include: {
        farm: { select: { name: true } },
        assignee: { select: { name: true } },
      }
    });
  }

  async updateStatus(id: string, status: TaskStatus) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException('Task not found');

    return this.prisma.task.update({
      where: { id },
      data: { status },
      include: {
        farm: { select: { name: true } },
        assignee: { select: { name: true } },
      }
    });
  }

  async delete(id: string) {
    await this.prisma.task.delete({ where: { id } });
    return { success: true };
  }
}
