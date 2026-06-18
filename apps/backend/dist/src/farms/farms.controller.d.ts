import { FarmsService } from './farms.service';
export declare class FarmsController {
    private farmsService;
    constructor(farmsService: FarmsService);
    findAll(): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
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
    create(body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
    }>;
    update(id: string, body: any): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        location: string;
        capacityKw: number;
        status: import("@prisma/client").$Enums.FarmStatus;
    }>;
}
