import { Controller, Get, Post, Put, Param, Body, UseGuards } from '@nestjs/common';
import { FarmsService } from './farms.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Farms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('farms')
export class FarmsController {
  constructor(private farmsService: FarmsService) {}

  @Get()
  findAll() {
    return this.farmsService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.farmsService.findById(id);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Post()
  create(@Body() body: any) {
    return this.farmsService.create(body);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return this.farmsService.update(id, body);
  }
}
