import "dotenv/config";
import axios from "axios";
import championsSupplementaryData from "@/data/champions.json";
import { CDragonChampionSummary } from "@/types/cdragon";
import { ChampionSupplementaryData } from "@/types/supplementaryDatas";

// TODO: Need to exclude Ruby champ and other special champions
const MAX_REGULAR_CHAMPION_ID = 1000;

it("should validate all supplementary informations are not missing for each champion", async () => {
  const summaryUrl = `${process.env.COMMUNITY_DRAGON_API_URL}/v1/champion-summary.json`;
  const supplementaryDatas: ChampionSupplementaryData[] =
    championsSupplementaryData;
  const { data } = await axios.get<CDragonChampionSummary[]>(summaryUrl);
  const champions = data.filter(
    (champ: CDragonChampionSummary) =>
      champ.id !== -1 && champ.id < MAX_REGULAR_CHAMPION_ID
  );

  const missing = [];

  for (const champ of champions) {
    const supplementaryChampInfos = supplementaryDatas.find(
      (champInfos) => champInfos.key === champ.id
    );

    const missingFields = [];
    if (!supplementaryChampInfos) {
      missingFields.push("entry");
    } else {
      if (!supplementaryChampInfos.release) {
        missingFields.push("release");
      }
      if (!supplementaryChampInfos.world) {
        missingFields.push("world");
      }
    }

    if (missingFields.length > 0) {
      const description = missingFields.includes("entry")
        ? `Champion ${champ.alias} (id: ${champ.id}) is completely missing in supplementary data.`
        : `Champion ${champ.alias} (id: ${champ.id}) is missing fields: ${missingFields.join(", ")}.`;

      missing.push({
        id: champ.id,
        alias: champ.alias,
        missing: missingFields,
        description,
      });
    }
  }
  expect(missing).toEqual([]);
});
