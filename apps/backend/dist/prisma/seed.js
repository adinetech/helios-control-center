"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcrypt"));
const pg_1 = require("pg");
const adapter_pg_1 = require("@prisma/adapter-pg");
const pool = new pg_1.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new adapter_pg_1.PrismaPg(pool);
const prisma = new client_1.PrismaClient({ adapter });
async function main() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@solarops.cloud';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';
    const adminName = process.env.ADMIN_NAME || 'SolarOps Admin';
    const existingAdmin = await prisma.user.findUnique({
        where: { email: adminEmail },
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        const admin = await prisma.user.create({
            data: {
                email: adminEmail,
                password: hashedPassword,
                name: adminName,
                role: client_1.Role.ADMIN,
            },
        });
        console.log(`Created default admin user: ${admin.email}`);
    }
    else {
        console.log(`Admin user ${adminEmail} already exists.`);
    }
    const farmCount = await prisma.farm.count();
    if (farmCount === 0) {
        await prisma.farm.createMany({
            data: [
                { name: 'Nevada Solar One', location: 'Nevada, USA', capacityKw: 64000, status: 'ONLINE' },
                { name: 'Kamuthi Solar Power Project', location: 'Tamil Nadu, India', capacityKw: 648000, status: 'ONLINE' },
                { name: 'Ouarzazate Solar Power Station', location: 'Drâa-Tafilalet, Morocco', capacityKw: 510000, status: 'ONLINE' },
            ],
        });
        console.log('Seeded default solar farms.');
    }
    else {
        console.log('Solar farms already exist. Skipping seed.');
    }
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map