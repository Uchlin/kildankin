import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

const users = [
  {
    email: "ian@example.com",
    firstName: "Ян",
    lastName: "Непомнящий",
  },
  {
    email: "vlad@example.com",
    firstName: "Владислав",
    lastName: "Артемьев",
  },
  {
    email: "dan@example.com",
    firstName: "Даниил",
    lastName: "Дубов",
  },
  {
    email: "sash@example.com",
    firstName: "Александр",
    lastName: "Грищук",
  },
  {
    email: "ern@example.com",
    firstName: "Эрнесто",
    lastName: "Инаркиев",
  },
];

async function main() {
  // Очистка базы (опционально, в dev-среде)
  await prisma.match.deleteMany();
  await prisma.round.deleteMany();
  await prisma.participant.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.user.deleteMany();

  // Создание пользователей
  const createdUsers = await Promise.all(
    users.map((user) =>
      prisma.user.create({
        data: {
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: Role.USER,
        },
      })
    )
  );
  const owner = createdUsers[0];
  if (!owner) {
    throw new Error("Владелец турнира не найден");
  }

  const tournament = await prisma.tournament.create({
    data: {
      name: "Шахматный Турнир 2025",
      roundsCount: 5,
      ownerId: owner.id,
    },
  });

  // Создание участников турнира
  const participants = await Promise.all(
    createdUsers.map((user) =>
      prisma.participant.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          rating: Math.floor(Math.random() * 2500 + 1000), // случайный рейтинг
          tournamentId: tournament.id,
          userId: user.id,
        },
      })
    )
  );

  console.log("Seed completed successfully.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
