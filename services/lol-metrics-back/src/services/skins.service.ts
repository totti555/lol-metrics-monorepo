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

export const getSkinPrice = async (champAlias: string) => {
  const merakianalyticsUrl = `${process.env.MA_URL}/resources/latest/en-US/champions/${champAlias}.json`;
  const { data } = await axios.get(merakianalyticsUrl);
  return data;
};
