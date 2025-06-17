// scripts/championsFetcher.ts
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const CHAMPION_SUMMARY_URL =
  "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/champion-summary.json";

interface RawChampion {
  id: number;
  name: string;
  alias: string;
  description: string;
  squarePortraitPath: string;
  roles: string[];
  contentId: string;
}

async function fetchChampions() {
  const { data } = await axios.get<RawChampion[]>(CHAMPION_SUMMARY_URL);

  for (const champ of data) {
    await prisma.champion.upsert({
      where: { id: champ.id },
      update: {
        name: champ.name,
        alias: champ.alias,
        description: champ.description,
        portrait: champ.squarePortraitPath,
        roles: champ.roles,
        contentId: champ.contentId,
      },
      create: {
        id: champ.id,
        name: champ.name,
        alias: champ.alias,
        description: champ.description,
        portrait: champ.squarePortraitPath,
        roles: champ.roles,
        contentId: champ.contentId,
      },
    });
  }

  console.log(`Imported ${data.length} champions.`);
  await prisma.$disconnect();
}

fetchChampions().catch((e) => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
