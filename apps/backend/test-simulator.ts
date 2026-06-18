import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: 'postgresql://admin:password@100.100.28.107:5432/helios?schema=public'
    }
  }
});

async function main() {
  const farms = await prisma.farm.findMany({ where: { status: 'ONLINE' } });
  console.log(`Found ${farms.length} farms`);
  if (farms.length === 0) return;

  const now = new Date();
  const hour = now.getHours() + now.getMinutes() / 60; // 0 to 24

  for (const farm of farms) {
    let irradiance = 0;
    if (hour >= 6 && hour <= 18) {
      const timeMapped = ((hour - 6) / 12) * Math.PI;
      irradiance = Math.sin(timeMapped) * 1000;
      irradiance += (Math.random() * 200) - 150;
      if (irradiance < 0) irradiance = 0;
    } else {
      irradiance = Math.random() * 5;
    }

    let temperatureC = 15 + Math.sin(((hour - 4) / 20) * Math.PI) * 20 + (Math.random() * 2);

    const isWarning = Math.random() < 0.05;
    if (isWarning) {
      temperatureC += 10;
    }

    const efficiencyLoss = Math.max(0, (temperatureC - 25) * 0.004);
    const powerOutputKw = (farm.capacityKw * (irradiance / 1000)) * (1 - efficiencyLoss);

    const pv1PowerKw = powerOutputKw * 0.6;
    const pv2PowerKw = powerOutputKw * 0.4;
    const loadPowerKw = 0.5 + Math.random() * 0.5;
    const batterySoc = 50 + Math.sin(hour / 24 * Math.PI * 2) * 30;
    const gridPowerKw = powerOutputKw > loadPowerKw ? -(powerOutputKw - loadPowerKw) : (loadPowerKw - powerOutputKw);

    try {
      await prisma.telemetry.create({
        data: {
          farmId: farm.id,
          powerOutputKw: Math.max(0, powerOutputKw),
          temperatureC,
          irradiance,
          pv1PowerKw,
          pv2PowerKw,
          totalPvPowerKw: powerOutputKw,
          batterySoc: Math.max(0, Math.min(100, batterySoc)),
          batteryVoltage: 24.5 + Math.random(),
          batteryPowerKw: powerOutputKw > loadPowerKw ? powerOutputKw - loadPowerKw : loadPowerKw - powerOutputKw,
          gridPowerKw,
          loadPowerKw,
        },
      });
      console.log(`Inserted for ${farm.name}`);
    } catch (e) {
      console.error(`Error inserting for ${farm.name}:`, e.message);
    }
  }
}

main().then(() => prisma.$disconnect()).catch(console.error);
