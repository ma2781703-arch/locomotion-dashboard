import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Wiping all demo data...");
  await prisma.task.deleteMany({});
  await prisma.projectDeliverable.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.user.deleteMany({});

  console.log("👤 Creating primary Management administrator account...");
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Maulana (Director)",
      username: "admin",
      password: hashedPassword,
      role: "MANAGEMENT",
      position: "Head of Agency & Operations Lead",
      department: "Management",
      bio: "Executive agency leadership, client strategy, and creative operations.",
      avatarUrl:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  console.log(`✅ Production initial account ready:`);
  console.log(`   - Name: ${admin.name}`);
  console.log(`   - Username: ${admin.username}`);
  console.log(`   - Role: ${admin.role}`);
  console.log(`   - Default Password: admin123`);
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
