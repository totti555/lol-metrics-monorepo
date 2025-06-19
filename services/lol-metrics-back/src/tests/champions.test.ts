import { getAllChampions } from "@/services/champions.service";
import axios from "axios";
import { fetchSkins, findBaseSkinForChampion } from "@/services/skins.service";
import { CDragonChampionSummary, CDragonSkin } from "@/types/cdragon";

jest.mock("axios");
jest.mock("@/services/skins.service");

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFetchSkins = fetchSkins as jest.Mock;
const mockedFindBaseSkinForChampion = findBaseSkinForChampion as jest.Mock;

describe("getAllChampions", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...OLD_ENV,
      COMMUNITY_DRAGON_API_URL: "https://api.cdragon.test",
    };
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  it("should return formatted champions", async () => {
    const championData: CDragonChampionSummary[] = [
      {
        id: 1,
        name: "Ahri",
        alias: "Ahri",
        description: "The Nine-Tailed Fox",
        squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/103.png",
        roles: ["Mid"],
      },
    ];
    const skins: CDragonSkin[] = [
      {
        id: 1000,
        isBase: true,
        contentId: "some-id",
        loadScreenPath: "/lol-game-data/assets/v1/loadscreen.jpg",
      },
    ];
    mockedAxios.get.mockResolvedValueOnce({ data: championData });
    mockedFetchSkins.mockResolvedValueOnce(skins);
    mockedFindBaseSkinForChampion.mockReturnValueOnce(skins[0]);

    const champions = await getAllChampions();

    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://api.cdragon.test/v1/champion-summary.json"
    );
    expect(champions).toEqual([
      {
        id: "1",
        name: "Ahri",
        alias: "Ahri",
        description: "The Nine-Tailed Fox",
        squarePortrait:
          "https://cdn.communitydragon.org/latest/lol-game-data/assets/v1/champion-icons/103.png",
        clientPortrait: "https://api.cdragon.test/v1/loadscreen.jpg",
        roles: ["Mid"],
        world: [],
      },
    ]);
  });

  it("should filter out champions with id === -1", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: -1,
          name: "Dummy",
          alias: "Dummy",
          description: "",
          squarePortraitPath: "",
          roles: [],
        },
        {
          id: 2,
          name: "Akali",
          alias: "Akali",
          description: "The Rogue Assassin",
          squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/84.png",
          roles: ["Mid"],
        },
      ],
    });
    mockedFetchSkins.mockResolvedValueOnce([]);
    mockedFindBaseSkinForChampion.mockReturnValueOnce(undefined);

    const champions = await getAllChampions();

    expect(champions).toEqual([
      {
        id: "2",
        name: "Akali",
        alias: "Akali",
        description: "The Rogue Assassin",
        squarePortrait:
          "https://cdn.communitydragon.org/latest/lol-game-data/assets/v1/champion-icons/84.png",
        clientPortrait: undefined,
        roles: ["Mid"],
        world: [],
      },
    ]);
  });

  it("should handle missing base skin", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          id: 3,
          name: "Annie",
          alias: "Annie",
          description: "The Dark Child",
          squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/1.png",
          roles: ["Mid"],
        },
      ],
    });
    mockedFetchSkins.mockResolvedValueOnce([]);
    mockedFindBaseSkinForChampion.mockReturnValueOnce(undefined);

    const champions = await getAllChampions();

    expect(champions[0].clientPortrait).toBeUndefined();
  });

  it("should return empty array if no champions", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedFetchSkins.mockResolvedValueOnce([]);
    const champions = await getAllChampions();
    expect(champions).toEqual([]);
  });
});
