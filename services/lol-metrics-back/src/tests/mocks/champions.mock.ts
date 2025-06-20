import { CDragonChampionSummary } from "@/types/cdragon";

export const mockChampionAhri: CDragonChampionSummary = {
  id: 1,
  name: "Ahri",
  alias: "Ahri",
  description: "The Nine-Tailed Fox",
  squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/103.png",
  roles: ["Mid"],
};

export const mockChampionAkali: CDragonChampionSummary = {
  id: 2,
  name: "Akali",
  alias: "Akali",
  description: "The Rogue Assassin",
  squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/84.png",
  roles: ["Mid"],
};

export const mockChampions: CDragonChampionSummary[] = [
  mockChampionAhri,
  mockChampionAkali,
];
