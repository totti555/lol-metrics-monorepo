import { getAllChampions, getChampionById } from "@/services/champions.service";
import axios from "axios";
import { fetchSkins } from "@/services/skins.service";
import { mockChampions } from "./mocks/champions.mock";
import { mockSkins } from "./mocks/skins.mock";
import { mockChampionAnnie, mockMAChampionAnnie } from "./mocks/champion.mock";
import { components } from "@/types/openapi";

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
type ChampionDetails = components["schemas"]["ChampionDetails"];

describe("Champions services", () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetAllMocks();
    process.env = {
      ...OLD_ENV,
      COMMUNITY_DRAGON_API_URL: "https://api.cdragon.test",
      CLOUDFRONT_URL: "https://cloud-front.test",
      MA_URL: "http://ma.test",
    };
  });

  describe("getAllChampions", () => {
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
          squarePortrait: "https://api.cdragon.test/v1/champion-icons/103.png",
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
          squarePortrait: "https://api.cdragon.test/v1/champion-icons/84.png",
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

  describe("getChampionById", () => {
    it("should return a formatted champion with spells and skins", async () => {
      mockedAxios.get
        .mockResolvedValueOnce({ data: mockChampionAnnie }) //  CDragon
        .mockResolvedValueOnce({ data: mockMAChampionAnnie }); // MA

      const result = await getChampionById("1");

      const expectedSpell = {
        name: "Disintegrate",
        icon: "https://api.cdragon.test/assets/characters/annie/hud/icons2d/annie_q.png",
        video:
          "https://cloud-front.test/champion-abilities/0001/ability_0001_Q1.webm",
        description: "Hurls fireball",
      };

      const spells = {
        Q: { ...expectedSpell },
        W: { ...expectedSpell },
        E: { ...expectedSpell },
        R: { ...expectedSpell },
        P: { ...expectedSpell },
      };

      expect(result).toEqual<ChampionDetails>({
        id: "1",
        name: "Annie",
        alias: "Annie",
        description: "the Dark Child",
        bio: "Fire child...",
        releaseDate: "2009-02-21",
        squarePortrait: "https://api.cdragon.test/v1/champion-icons/1.png",
        world: "Runeterra",
        tacticalInfo: mockChampionAnnie.tacticalInfo,
        playstyleInfo: mockChampionAnnie.playstyleInfo,
        roles: ["Mid"],
        skins: [
          {
            id: 1000,
            name: "Annie",
            isBase: true,
            image:
              "https://api.cdragon.test/assets/characters/annie/skins/base/images/annie_splash_uncentered_0.jpg",
            rarity: "kNoRarity",
            price: 260,
          },
        ],
        spells,
      });
    });
  });
});
