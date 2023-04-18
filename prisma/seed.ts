// import prisma from '../lib/prisma';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Movements
  // await prisma.movement.createMany({
  //   data: [
  //     { name: 'Clean and Jerk' },
  //     { name: 'Snatch' },
  //     { name: 'Deadlift' },
  //     { name: 'Back Squat' },
  //     { name: 'Front Squat' },
  //     { name: 'Overhead Squat' },
  //     { name: 'Thruster' },
  //     { name: 'Push Press' },
  //     { name: 'Push Jerk' },
  //     { name: 'Split Jerk' },
  //     { name: 'Sumo Deadlift High Pull' },
  //     { name: 'Hang Clean' },
  //     { name: 'Hang Snatch' },
  //     { name: 'Power Clean' },
  //     { name: 'Power Snatch' },
  //     { name: 'Hang Power Clean' },
  //     { name: 'Hang Power Snatch' },
  //     { name: 'Turkish Get-Up' },
  //     { name: 'Kettlebell Swing' },
  //     { name: "Farmer's Carry" },
  //     { name: 'Wall Ball Shots' },
  //     { name: 'Box Jumps' },
  //     { name: 'Double Unders (Jump Rope)' },
  //     { name: 'Dumbbell or Kettlebell Thruster' },
  //     { name: 'Dumbbell or Kettlebell Snatch' },
  //   ],
  // });

  // User
  await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@mail.com',
      lifts: {
        create: [
          {
            movement: 'Deadlift',
            sets: {
              create: [
                {
                  rep: 1,
                  weight: 150,
                },
                {
                  rep: 3,
                  weight: 140,
                },
                {
                  rep: 5,
                  weight: 120,
                },
              ],
            },
          },
          {
            movement: 'Clean',
            sets: {
              create: [
                {
                  rep: 1,
                  weight: 92.5,
                },
                {
                  rep: 2,
                  weight: 90,
                },
                {
                  rep: 3,
                  weight: 85,
                },
              ],
            },
          },
          {
            movement: 'Clean & Jerk',
            sets: {
              create: [
                {
                  rep: 1,
                  weight: 80,
                },
                {
                  rep: 3,
                  weight: 75,
                },
                {
                  rep: 5,
                  weight: 65,
                },
              ],
            },
          },
          {
            movement: 'Snatch',
            sets: {
              create: [
                {
                  rep: 1,
                  weight: 50,
                },
                {
                  rep: 2,
                  weight: 45,
                },
                {
                  rep: 3,
                  weight: 45,
                },
                {
                  rep: 5,
                  weight: 40,
                },
                {
                  rep: 10,
                  weight: 35,
                },
                {
                  rep: 15,
                  weight: 30,
                },
              ],
            },
          },
        ],
      },
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
