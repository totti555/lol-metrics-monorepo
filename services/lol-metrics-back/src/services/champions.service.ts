import {
  CdragonChampion,
  CDragonChampionSummary,
  CDragonSkin,
  CdragonSkinSummary,
  CdragonSpell,
  SpellKey,
} from "@/types/cdragon";
import { components } from "@/types/openapi";
import { toCDragonUrl, toCDragonUrlVideo } from "@/utils/cdragon";
import axios from "axios";
import {
  fetchSkins,
  findBaseSkinForChampion,
  getSkinPrice,
} from "@/services/skins.service";
import championsSupplementaryData from "@/data/champions.json";
import { ChampionSupplementaryData } from "@/types/supplementaryDatas";

type Champion = components["schemas"]["Champion"];
type ChampionDetails = components["schemas"]["ChampionDetails"];
type Spell = components["schemas"]["Spell"];

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
        (extraChampInfos: ChampionSupplementaryData) =>
          extraChampInfos.key === champion.id
      );
      return {
        id: String(champion.id),
        name: champion.name,
        alias: champion.alias,
        description: champion.description,
        squarePortrait: toCDragonUrl(champion.squarePortraitPath),
        clientPortrait: baseSkin?.loadScreenPath
          ? toCDragonUrl(baseSkin.loadScreenPath)
          : undefined,
        roles: champion.roles,
        releaseDate: champSupplementaryData?.release,
        world: champSupplementaryData?.world,
      } satisfies Champion;
    });

  return champions;
};

export const getChampionById = async (id: string): Promise<ChampionDetails> => {
  const championsUrl = `${process.env.COMMUNITY_DRAGON_API_URL}/v1/champions/${id}.json`;
  const { data } = await axios.get<CdragonChampion>(championsUrl);

  // SUPP DATA
  const champSupplementaryData: ChampionSupplementaryData | undefined =
    championsSupplementaryData.find(
      (extraChampInfos: ChampionSupplementaryData) =>
        extraChampInfos.key === data.id
    );

  // SKINS
  const skins = data.skins;
  const skinsPriceData = await getSkinPrice(data.alias);

  const pricedSkins: components["schemas"]["Skin"][] = skins.map(
    (skin: CdragonSkinSummary) => {
      const matchingSkin = skinsPriceData.skins.find(
        (s: any) => s.id === skin.id
      );
      console.log(skin.uncenteredSplashPath);
      return {
        id: skin.id,
        name: skin.name,
        isBase: skin.isBase,
        image: toCDragonUrl(skin.uncenteredSplashPath),
        rarity: skin.rarity ?? matchingSkin?.rarity ?? "Unknown",
        price: matchingSkin?.cost ?? "Unknown",
      };
    }
  );

  // SPELLS
  const spellsByKey = Object.fromEntries(
    data.spells.map((spell: CdragonSpell) => [
      spell.spellKey.toLowerCase(),
      spell,
    ])
  );

  const Qspell: Spell | undefined = spellByKey(spellsByKey, "q");
  const Wspell: Spell | undefined = spellByKey(spellsByKey, "w");
  const Espell: Spell | undefined = spellByKey(spellsByKey, "e");
  const Rspell: Spell | undefined = spellByKey(spellsByKey, "r");
  const Pspell: Spell | undefined = spellByKey(spellsByKey, "p");

  return {
    id: String(data.id),
    name: data.name,
    alias: data.alias,
    description: data.title,
    bio: data.shortBio,
    releaseDate: champSupplementaryData?.release,
    squarePortrait: toCDragonUrl(data.squarePortraitPath),
    world: champSupplementaryData?.world,
    tacticalInfo: data.tacticalInfo,
    playstyleInfo: data.playstyleInfo,
    skins: pricedSkins,
    roles: data.roles,
    spells: {
      P: Pspell,
      Q: Qspell,
      W: Wspell,
      E: Espell,
      R: Rspell,
    },
  } satisfies ChampionDetails;
};

const spellByKey = (
  spellMap: Record<string, CdragonSpell> | undefined,
  key: SpellKey
): Spell | undefined => {
  const spell = spellMap?.[key];
  if (!spell) {
    return undefined;
  }

  return {
    name: spell.name,
    icon: toCDragonUrl(spell.abilityIconPath),
    description: spell.description,
    video: toCDragonUrlVideo(spell.abilityVideoPath),
  };
};
