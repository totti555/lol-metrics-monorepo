import axios from "axios";
import { CDragonSkin, CDragonSkinsResponse } from "@/types/cdragon";

export const fetchSkins = async (): Promise<CDragonSkin[]> => {
  const { data: skinData } = await axios.get<CDragonSkinsResponse>(
    `${process.env.COMMUNITY_DRAGON_API_URL}/v1/skins.json"`
  );

  return Object.values(skinData).map((skin) => ({
    id: skin.id,
    isBase: skin.isBase,
    contentId: skin.contentId,
    loadScreenPath: skin.loadScreenPath,
  }));
};

export const findBaseSkinForChampion = (
  championId: number,
  skins: CDragonSkin[]
): CDragonSkin | undefined => {
  return skins.find((skin) => skin.isBase && skin.id === championId * 1000);
};
