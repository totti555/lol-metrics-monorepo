import {
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
} from "@/errors/errors";
import {
  getAccountApiUrl,
  getPlatformApiUrl,
  RiotPlatformId,
} from "@/utils/riotRouting";
import axios from "axios";

export const riotIdToSummoner = async (
  gameName: string,
  tagLine: string,
  platformId: RiotPlatformId
) => {
  const accountUrl = getAccountApiUrl(platformId);
  const platformUrl = getPlatformApiUrl(platformId);

  if (!accountUrl || !platformUrl) {
    throw new Error("Invalid platform ID");
  }

  try {
    const riotAccount = await axios.get(
      `${accountUrl}/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY!,
        },
      }
    );

    if (!riotAccount.data) {
      throw new NotFoundError("Riot account not found");
    }

    console.log(riotAccount.data);

    const puuid = riotAccount.data.puuid;

    const summonerData = await axios.get(
      `${platformUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY!,
        },
      }
    );

    console.log(summonerData.data);

    if (!summonerData.data) {
      throw new NotFoundError("Summoner data not found");
    }

    return summonerData.data;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;

      switch (status) {
        case 401:
          throw new UnauthorizedError("Invalid API key");
        case 403:
          throw new ForbiddenError("Forbidden access");
        case 404:
          throw new NotFoundError("Summoner not found");
        case 429:
          throw new RateLimitError("Rate limit exceeded");
        default:
          throw new Error(error.message);
      }
    }
    throw error;
  }
};
