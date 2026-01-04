import axios from "axios";
import {
  NotFoundError,
  UnauthorizedError,
  ForbiddenError,
  RateLimitError,
} from "@/errors/errors";
import { RiotPlatformId } from "@/utils/riotRouting";
import {
  getLastMatchesByPuuid,
  riotIdToSummoner,
  getSummonerChampionMasteries,
} from "@/services/summoners.service";
import { ChampionMasteryDto } from "@/types/riot";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("riotIdToSummoner", () => {
  const platformId = "EUW1" as RiotPlatformId;
  const accountUrl = "https://account.api";
  const platformUrl = "https://platform.api";
  const puuid = "test-puuid";
  const summonerData = { id: "123", name: "Summoner" };

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.RIOT_API_KEY = "test-key";
    jest
      .spyOn(require("@/utils/riotRouting"), "getAccountApiUrl")
      .mockReturnValue(accountUrl);
    jest
      .spyOn(require("@/utils/riotRouting"), "getPlatformApiUrl")
      .mockReturnValue(platformUrl);
  });

  it("returns summoner data on success", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { puuid } })
      .mockResolvedValueOnce({ data: summonerData });

    const result = await riotIdToSummoner("name", "tag", platformId);
    expect(result).toMatchObject({ ...summonerData, lastMatches: [] });
  });

  it("throws NotFoundError if riotAccount.data is missing", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws NotFoundError if summonerData.data is missing", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: { puuid } })
      .mockResolvedValueOnce({ data: null });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws UnauthorizedError on 401", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    mockedAxios.get.mockRejectedValue({
      response: { status: 401 },
      message: "err",
    });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it("throws ForbiddenError on 403", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    mockedAxios.get.mockRejectedValue({
      response: { status: 403 },
      message: "err",
    });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      ForbiddenError
    );
  });

  it("throws NotFoundError on 404", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    mockedAxios.get.mockRejectedValue({
      response: { status: 404 },
      message: "err",
    });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws RateLimitError on 429", async () => {
    jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
    mockedAxios.get.mockRejectedValue({
      response: { status: 429 },
      message: "err",
    });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      RateLimitError
    );
  });
});

describe("getLastMatchesByPuuid", () => {
  const platformId = "EUW1" as RiotPlatformId;
  const puuid = "test-puuid";
  const accountUrl = "https://account.api";

  beforeEach(() => {
    jest.resetModules();
    process.env.RIOT_API_KEY = "test-key";
    jest
      .spyOn(require("@/utils/riotRouting"), "getAccountApiUrl")
      .mockReturnValue(accountUrl);
  });

  it("returns empty array if no matches", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const result = await getLastMatchesByPuuid(puuid, platformId);
    expect(result).toEqual([]);
  });

  it("returns simplified matches", async () => {
    const matchIds = ["match1", "match2"];
    const matchDto = {
      info: {
        gameDuration: 1000,
        gameCreation: 123456,
        participants: [
          {
            puuid,
            championId: 1,
            kills: 2,
            deaths: 1,
            assists: 3,
            totalMinionsKilled: 10,
            neutralMinionsKilled: 5,
            win: true,
            teamId: 100,
            teamPosition: "TOP",
            item0: 1001,
            item1: 0,
            item2: 1002,
            item3: 0,
            item4: 0,
            item5: 0,
            item6: 0,
          },
        ],
      },
    };
    mockedAxios.get
      .mockResolvedValueOnce({ data: matchIds }) // match ids
      .mockResolvedValue({ data: matchDto }); // match details for each

    const result = await getLastMatchesByPuuid(puuid, platformId);
    expect(result.length).toBe(2);
    expect(result[0]).toHaveProperty("gameDuration", 1000);
    expect(result[0].playerStats).toHaveProperty("championId", 1);
  });

  it("returns empty array on error", async () => {
    mockedAxios.get.mockRejectedValue(new Error("fail"));
    const result = await getLastMatchesByPuuid(puuid, platformId);
    expect(result).toEqual([]);
  });
});

describe("getSummonerChampionMasteries", () => {
  const platformId = "EUW1" as RiotPlatformId;
  const puuid = "test-puuid";
  const platformUrl = "https://platform.api";

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RIOT_API_KEY = "test-key";
    jest
      .spyOn(require("@/utils/riotRouting"), "getPlatformApiUrl")
      .mockReturnValue(platformUrl);
  });

  it("returns empty array when no masteries", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    const result = await getSummonerChampionMasteries(puuid, platformId);
    expect(result).toEqual([]);
  });

  it("returns transformed champion masteries", async () => {
    const mockMasteries: ChampionMasteryDto[] = [
      {
        championId: 157,
        championLevel: 7,
        championPoints: 250000,
        championPointsUntilNextLevel: 0,
        championPointsSinceLastLevel: 21600,
      },
      {
        championId: 92,
        championLevel: 5,
        championPoints: 45000,
        championPointsUntilNextLevel: 12000,
        championPointsSinceLastLevel: 8000,
      },
    ] as ChampionMasteryDto[];

    mockedAxios.get.mockResolvedValue({ data: mockMasteries });
    const result = await getSummonerChampionMasteries(puuid, platformId);

    expect(result).toEqual([
      {
        id: 157,
        level: 7,
        points: 250000,
        pointsUntilNextLevel: 0,
        pointsSinceLastLevel: 21600,
      },
      {
        id: 92,
        level: 5,
        points: 45000,
        pointsUntilNextLevel: 12000,
        pointsSinceLastLevel: 8000,
      },
    ]);
  });

  it("calls correct endpoint with API key", async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    await getSummonerChampionMasteries(puuid, platformId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${platformUrl}/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}`,
      {
        headers: { "X-Riot-Token": "test-key" },
      }
    );
  });

  it("returns empty array on error", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    mockedAxios.get.mockRejectedValue(new Error("API error"));

    const result = await getSummonerChampionMasteries(puuid, platformId);

    expect(result).toEqual([]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Error fetching champion masteries:",
      expect.any(Error)
    );

    consoleLogSpy.mockRestore();
  });
});
