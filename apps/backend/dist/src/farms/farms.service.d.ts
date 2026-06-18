import { PrismaService } from '../prisma/prisma.service';
export declare class FarmsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
    }[]>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
    }>;
    getTelemetry(farmId: string, minutes?: number): Promise<{
        id: string;
        farmId: string;
        timestamp: Date;
        powerOutputKw: number;
        temperatureC: number;
        irradiance: number;
    }[]>;
    findById(id: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
    } | null>;
    create(data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
    }>;
    update(id: string, data: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
    }>;
}
