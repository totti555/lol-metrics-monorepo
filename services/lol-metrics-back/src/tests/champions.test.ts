import { getAllChampions } from "@/services/champions.service";
import axios from "axios";
import { fetchSkins } from "@/services/skins.service";
import { mockChampions } from "./mocks/champions.mock";
import { mockSkins } from "./mocks/skins.mock";

jest.mock("axios");
jest.mock("@/services/skins.service", () => {
  const actual = jest.requireActual("@/services/skins.service");
  return {
    ...actual,
    fetchSkins: jest.fn(),
  };
});

const mockedAxios = axios as jest.Mocked<typeof axios>;
const mockedFetchSkins = fetchSkins as jest.Mock;

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
    mockedAxios.get.mockResolvedValueOnce({ data: mockChampions });
    mockedFetchSkins.mockResolvedValueOnce(mockSkins);

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
        releaseDate: "2009-02-21",
        world: "Runeterra",
      },
      {
        id: "2",
        name: "Akali",
        alias: "Akali",
        description: "The Rogue Assassin",
        squarePortrait:
          "https://cdn.communitydragon.org/latest/lol-game-data/assets/v1/champion-icons/84.png",
        clientPortrait: undefined,
        roles: ["Mid"],
        releaseDate: "2010-06-09",
        world: "Freljord",
      },
    ]);
  });

  it("should filter out champions with id === -1", async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: [{ ...mockChampions[0], id: -1 }, ...mockChampions.slice(1)],
    });
    mockedFetchSkins.mockResolvedValueOnce([]);

    const champions = await getAllChampions();

    expect(champions).toEqual([
      {
        id: "2",
        name: "Akali",
        alias: "Akali",
        description: "The Rogue Assassin",
        squarePortrait: "https://api.cdragon.test/v1/champion-icons/84.png",
        clientPortrait: undefined,
        roles: ["Mid"],
        releaseDate: "2010-06-09",
        world: "Freljord",
      },
    ]);
  });

  it("should return empty array if no champions", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: [] });
    mockedFetchSkins.mockResolvedValueOnce([]);
    const champions = await getAllChampions();
    expect(champions).toEqual([]);
  });
});
