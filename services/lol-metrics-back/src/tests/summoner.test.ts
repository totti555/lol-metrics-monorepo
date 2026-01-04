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
import {
  mockPuuid,
  mockAccountUrl,
  mockPlatformUrl,
  mockRiotAccount,
  mockSummonerData,
  mockChampionMasteries,
  mockMatchDto,
} from "./mocks/summoner.mock";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockAxiosError = (status: number) => {
  jest.spyOn(axios, "isAxiosError").mockReturnValue(true);
  mockedAxios.get.mockRejectedValue({
    response: { status },
    message: "API error",
  });
};

const mockRoutingUtils = () => {
  jest
    .spyOn(require("@/utils/riotRouting"), "getAccountApiUrl")
    .mockReturnValue(mockAccountUrl);
  jest
    .spyOn(require("@/utils/riotRouting"), "getPlatformApiUrl")
    .mockReturnValue(mockPlatformUrl);
};

describe("riotIdToSummoner", () => {
  const platformId = "EUW1" as RiotPlatformId;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env.RIOT_API_KEY = "test-key";
    mockRoutingUtils();
  });

  it("returns summoner data on success", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRiotAccount })
      .mockResolvedValueOnce({ data: mockSummonerData });

    const result = await riotIdToSummoner("name", "tag", platformId);
    expect(result).toMatchObject({
      ...mockSummonerData,
      name: "name",
      tagLine: "tag",
      lastMatches: [],
    });
  });

  it("throws NotFoundError if riotAccount.data is missing", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: null });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws NotFoundError if summonerData.data is missing", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockRiotAccount })
      .mockResolvedValueOnce({ data: null });
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws UnauthorizedError on 401", async () => {
    mockAxiosError(401);
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it("throws ForbiddenError on 403", async () => {
    mockAxiosError(403);
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      ForbiddenError
    );
  });

  it("throws NotFoundError on 404", async () => {
    mockAxiosError(404);
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      NotFoundError
    );
  });

  it("throws RateLimitError on 429", async () => {
    mockAxiosError(429);
    await expect(riotIdToSummoner("name", "tag", platformId)).rejects.toThrow(
      RateLimitError
    );
  });
});

describe("getLastMatchesByPuuid", () => {
  const platformId = "EUW1" as RiotPlatformId;

  beforeEach(() => {
    jest.resetModules();
    process.env.RIOT_API_KEY = "test-key";
    jest
      .spyOn(require("@/utils/riotRouting"), "getAccountApiUrl")
      .mockReturnValue(mockAccountUrl);
  });

  it("returns empty array if no matches", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    const result = await getLastMatchesByPuuid(mockPuuid, platformId);
    expect(result).toEqual([]);
  });

  it("returns simplified matches", async () => {
    const matchIds = ["match1", "match2"];
    mockedAxios.get
      .mockResolvedValueOnce({ data: matchIds })
      .mockResolvedValue({ data: mockMatchDto });

    const result = await getLastMatchesByPuuid(mockPuuid, platformId);

    expect(result).toHaveLength(2);
    expect(result[0]).toHaveProperty("gameDuration", 1800);
    expect(result[0].playerStats).toMatchObject({
      championId: 1,
      kills: 5,
      deaths: 2,
      assists: 10,
    });
  });

  it("returns empty array on error", async () => {
    mockedAxios.get.mockRejectedValue(new Error("API error"));
    const result = await getLastMatchesByPuuid(mockPuuid, platformId);
    expect(result).toEqual([]);
  });
});

describe("getSummonerChampionMasteries", () => {
  const platformId = "EUW1" as RiotPlatformId;
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
    const result = await getSummonerChampionMasteries(mockPuuid, platformId);
    expect(result).toEqual([]);
  });

  it("returns transformed champion masteries", async () => {
    mockedAxios.get.mockResolvedValue({ data: mockChampionMasteries });
    const result = await getSummonerChampionMasteries(mockPuuid, platformId);

    expect(mockedAxios.get).toHaveBeenCalledWith(
      `${mockPlatformUrl}/lol/champion-mastery/v4/champion-masteries/by-puuid/${mockPuuid}`,
      {
        headers: { "X-Riot-Token": "test-key" },
      }
    );

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

  it("returns empty array on error", async () => {
    const consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    mockedAxios.get.mockRejectedValue(new Error("API error"));

    const result = await getSummonerChampionMasteries(mockPuuid, platformId);

    expect(result).toEqual([]);
    expect(consoleLogSpy).toHaveBeenCalledWith(
      "Error fetching champion masteries:",
      expect.any(Error)
    );

    consoleLogSpy.mockRestore();
  });
});
