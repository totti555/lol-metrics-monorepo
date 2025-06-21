import { CDragonChampionSummary, CDragonSkin } from "@/types/cdragon";
import { components } from "@/types/openapi";
import { toCDragonUrl } from "@/utils/cdragon";
import axios from "axios";
import { fetchSkins, findBaseSkinForChampion } from "@/services/skins.service";
import championsSupplementaryData from "@/data/champions.json";

type Champion = components["schemas"]["Champion"];

export const getAllChampions = async (): Promise<Champion[]> => {
  const summaryUrl = `${process.env.COMMUNITY_DRAGON_API_URL}/v1/champion-summary.json`;

  const { data } = await axios.get<CDragonChampionSummary[]>(summaryUrl);
  const skins: CDragonSkin[] = await fetchSkins();
  const supplementaryDatas = championsSupplementaryData;

  const champions: Champion[] = data
    .filter((champion) => champion.id !== -1)
    .map((champion) => {
      const baseSkin = findBaseSkinForChampion(champion.id, skins);
      const champSupplementaryData = supplementaryDatas.find(
        (extraChampInfos) => extraChampInfos.key === champion.id
      );
      return {
        id: String(champion.id),
        name: champion.name,
        alias: champion.alias,
        description: champion.description,
        squarePortrait: `https://cdn.communitydragon.org/latest${champion.squarePortraitPath}`,
        clientPortrait: baseSkin?.loadScreenPath
          ? toCDragonUrl(baseSkin.loadScreenPath)
          : undefined,
        roles: champion.roles,
        releaseDate: champSupplementaryData?.release ?? undefined,
        world: champSupplementaryData?.world ?? undefined,
      } satisfies Champion;
    });

  return champions;
};
