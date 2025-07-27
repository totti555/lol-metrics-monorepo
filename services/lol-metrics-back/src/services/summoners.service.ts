import {
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
} from "@/errors/errors";
import { Match, Summoner } from "@/types";
import { MatchDto } from "@/types/riot";
import {
  getAccountApiUrl,
  getPlatformApiUrl,
  normalizeRole,
  RiotPlatformId,
} from "@/utils/riotRouting";
import axios from "axios";

export const riotIdToSummoner = async (
  gameName: string,
  tagLine: string,
  platformId: RiotPlatformId
): Promise<Summoner> => {
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

    const puuid = riotAccount.data.puuid;

    const summonerData = await axios.get(
      `${platformUrl}/lol/summoner/v4/summoners/by-puuid/${puuid}`,
      {
        headers: {
          "X-Riot-Token": process.env.RIOT_API_KEY!,
        },
      }
    );

    if (!summonerData.data) {
      throw new NotFoundError("Summoner data not found");
    }

    const lastMatches = await getLastMatchesByPuuid(puuid, platformId);

    return {
      ...summonerData.data,
      lastMatches,
    };
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

export const getLastMatchesByPuuid = async (
  puuid: string,
  platformId: RiotPlatformId,
  count = 5
): Promise<Match[]> => {
  const accountUrl = getAccountApiUrl(platformId);

  try {
    const matchesResponse = await axios.get(
      `${accountUrl}/lol/match/v5/matches/by-puuid/${puuid}/ids`,
      {
        headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
        params: {
          count,
        },
      }
    );

    if (matchesResponse.data?.length === 0) {
      return [];
    }

    const matchIds: string[] = matchesResponse.data;

    const matchDetailsPromises = matchIds.map(async (matchId) => {
      const response = await axios.get<MatchDto>(
        `${accountUrl}/lol/match/v5/matches/${matchId}`,
        {
          headers: { "X-Riot-Token": process.env.RIOT_API_KEY! },
        }
      );
      return simplifyLastMatch(response.data, puuid);
    });

    return await Promise.all(matchDetailsPromises);
  } catch (error: any) {
    console.warn(
      `Error fetching last matches for PUUID ${puuid}:`,
      error.message
    );
    return [];
  }
};

function simplifyLastMatch(matchDto: MatchDto, targetPuuid: string): Match {
  const { gameDuration, gameCreation, participants } = matchDto.info;

  const player = participants.find((p) => p.puuid === targetPuuid)!;

  const championIdsInMatch = participants.map((p) => p.championId);

  const totalTeamKills = participants
    .filter((p) => p.teamId === player.teamId)
    .reduce((acc, p) => acc + p.kills, 0);

  const killParticipation =
    totalTeamKills > 0
      ? Math.round(((player.kills + player.assists) / totalTeamKills) * 100)
      : 0;

  const items = [
    player.item0,
    player.item1,
    player.item2,
    player.item3,
    player.item4,
    player.item5,
    player.item6,
  ].filter((i) => i !== 0);

  return {
    gameDuration,
    gameCreation,
    playerStats: {
      championId: player.championId,
      kills: player.kills,
      deaths: player.deaths,
      assists: player.assists,
      cs: player.totalMinionsKilled + player.neutralMinionsKilled,
      win: player.win,
      role: normalizeRole(player.teamPosition),
      items,
      killParticipation,
    },
    championIdsInMatch,
  };
}
