import {
  AccountDto,
  ChampionMasteryDto,
  MatchDto,
  ParticipantDto,
  SummonerDto,
} from "@/types/riot";

export const mockPuuid = "test-puuid-123";
export const mockAccountUrl = "https://account.api";
export const mockPlatformUrl = "https://platform.api";

export const mockRiotAccount: AccountDto = {
  puuid: mockPuuid,
  gameName: "TestPlayer",
  tagLine: "EUW",
};

export const mockSummonerData: SummonerDto = {
  puuid: mockPuuid,
  profileIconId: 1,
  revisionDate: 1234567890,
  summonerLevel: 150,
};

export const mockChampionMasteries: ChampionMasteryDto[] = [
  {
    puuid: mockPuuid,
    championId: 157,
    championLevel: 7,
    championPoints: 250000,
    lastPlayTime: 1234567890,
    championPointsSinceLastLevel: 21600,
    championPointsUntilNextLevel: 0,
    markRequiredForNextLevel: 0,
    tokensEarned: 3,
    championSeasonMilestone: 0,
    milestoneGrades: [],
    nextSeasonMilestone: {
      requireGradeCounts: {},
      rewardMarks: 0,
      bonus: false,
      totalGamesRequires: 0,
    },
  },
  {
    puuid: mockPuuid,
    championId: 92,
    championLevel: 5,
    championPoints: 45000,
    lastPlayTime: 1234567890,
    championPointsSinceLastLevel: 8000,
    championPointsUntilNextLevel: 12000,
    markRequiredForNextLevel: 0,
    tokensEarned: 0,
    championSeasonMilestone: 0,
    milestoneGrades: [],
    nextSeasonMilestone: {
      requireGradeCounts: {},
      rewardMarks: 0,
      bonus: false,
      totalGamesRequires: 0,
    },
  },
];

export const mockMatchDto: MatchDto = {
  metadata: {
    dataVersion: "2",
    matchId: "EUW1_1234567890",
    participants: [mockPuuid],
  },
  info: {
    endOfGameResult: "GameComplete",
    gameCreation: 1234567890,
    gameDuration: 1800,
    gameEndTimestamp: 1234569690,
    gameId: 1234567890,
    gameMode: "CLASSIC",
    gameName: "teambuilder-match-1234567890",
    gameStartTimestamp: 1234567890,
    gameType: "MATCHED_GAME",
    gameVersion: "13.1.1",
    mapId: 11,
    platformId: "EUW1",
    queueId: 420,
    teams: [],
    tournamentCode: "",
    participants: [
      {
        puuid: mockPuuid,
        summonerId: "summoner-id-123",
        summonerName: "TestPlayer",
        teamId: 100,
        championId: 1,
        championName: "Annie",
        kills: 5,
        deaths: 2,
        assists: 10,
        totalMinionsKilled: 150,
        neutralMinionsKilled: 20,
        win: true,
        teamPosition: "MIDDLE",
        item0: 3089,
        item1: 3020,
        item2: 3135,
        item3: 3165,
        item4: 3157,
        item5: 3116,
        item6: 3364,
      } as ParticipantDto,
      {
        puuid: "other-player-puuid",
        summonerId: "other-summoner-id",
        summonerName: "OtherPlayer",
        teamId: 100,
        championId: 64,
        championName: "Lee Sin",
        kills: 3,
        deaths: 1,
        assists: 8,
        totalMinionsKilled: 50,
        neutralMinionsKilled: 120,
        win: true,
        teamPosition: "JUNGLE",
        item0: 3074,
        item1: 3047,
        item2: 3153,
        item3: 3026,
        item4: 3742,
        item5: 3065,
        item6: 3364,
      } as ParticipantDto,
    ],
  },
};
