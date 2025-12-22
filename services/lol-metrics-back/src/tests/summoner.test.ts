import axios, { AxiosError } from "axios";
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
} from "@/services/summoners.service";

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
