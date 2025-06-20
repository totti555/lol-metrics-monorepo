import { CDragonSkin } from "@/types/cdragon";

export const mockSkinAhri: CDragonSkin = {
  id: 1000,
  isBase: true,
  contentId: "some-id",
  loadScreenPath: "/lol-game-data/assets/v1/loadscreen.jpg",
};

export const mockSkins: CDragonSkin[] = [
  {
    id: 1000,
    isBase: true,
    contentId: "some-id",
    loadScreenPath: "/lol-game-data/assets/v1/loadscreen.jpg",
  },
  {
    id: 1001,
    isBase: false,
    contentId: "some-id",
    loadScreenPath: "/lol-game-data/assets/v1/loadscreen2.jpg",
  },
];
