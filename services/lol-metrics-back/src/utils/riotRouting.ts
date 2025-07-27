export enum RiotPlatformId {
  EUW1 = "euw1",
  EUN1 = "eun1",
  TR1 = "tr1",
  RU = "ru",
  NA1 = "na1",
  BR1 = "br1",
  LA1 = "la1",
  LA2 = "la2",
  KR = "kr",
  JP1 = "jp1",
  OC1 = "oc1",
  PH2 = "ph2",
  SG2 = "sg2",
  TH2 = "th2",
  TW2 = "tw2",
  VN2 = "vn2",
}

export enum RiotRoutingRegion {
  EUROPE = "europe",
  AMERICAS = "americas",
  ASIA = "asia",
  SEA = "sea",
}

export const RIOT_PLATFORM_TO_ROUTING: Record<
  RiotPlatformId,
  RiotRoutingRegion
> = {
  [RiotPlatformId.EUW1]: RiotRoutingRegion.EUROPE,
  [RiotPlatformId.EUN1]: RiotRoutingRegion.EUROPE,
  [RiotPlatformId.TR1]: RiotRoutingRegion.EUROPE,
  [RiotPlatformId.RU]: RiotRoutingRegion.EUROPE,

  [RiotPlatformId.NA1]: RiotRoutingRegion.AMERICAS,
  [RiotPlatformId.BR1]: RiotRoutingRegion.AMERICAS,
  [RiotPlatformId.LA1]: RiotRoutingRegion.AMERICAS,
  [RiotPlatformId.LA2]: RiotRoutingRegion.AMERICAS,

  [RiotPlatformId.KR]: RiotRoutingRegion.ASIA,
  [RiotPlatformId.JP1]: RiotRoutingRegion.ASIA,

  [RiotPlatformId.OC1]: RiotRoutingRegion.SEA,
  [RiotPlatformId.PH2]: RiotRoutingRegion.SEA,
  [RiotPlatformId.SG2]: RiotRoutingRegion.SEA,
  [RiotPlatformId.TH2]: RiotRoutingRegion.SEA,
  [RiotPlatformId.TW2]: RiotRoutingRegion.SEA,
  [RiotPlatformId.VN2]: RiotRoutingRegion.SEA,
};

export const RIOT_ACCOUNT_BASE_URLS: Record<RiotRoutingRegion, string> = {
  [RiotRoutingRegion.EUROPE]: "https://europe.api.riotgames.com",
  [RiotRoutingRegion.AMERICAS]: "https://americas.api.riotgames.com",
  [RiotRoutingRegion.ASIA]: "https://asia.api.riotgames.com",
  [RiotRoutingRegion.SEA]: "https://sea.api.riotgames.com",
};

export const RIOT_PLATFORM_BASE_URLS: Record<RiotPlatformId, string> = {
  [RiotPlatformId.EUW1]: "https://euw1.api.riotgames.com",
  [RiotPlatformId.EUN1]: "https://eun1.api.riotgames.com",
  [RiotPlatformId.TR1]: "https://tr1.api.riotgames.com",
  [RiotPlatformId.RU]: "https://ru.api.riotgames.com",
  [RiotPlatformId.NA1]: "https://na1.api.riotgames.com",
  [RiotPlatformId.BR1]: "https://br1.api.riotgames.com",
  [RiotPlatformId.LA1]: "https://la1.api.riotgames.com",
  [RiotPlatformId.LA2]: "https://la2.api.riotgames.com",
  [RiotPlatformId.KR]: "https://kr.api.riotgames.com",
  [RiotPlatformId.JP1]: "https://jp1.api.riotgames.com",
  [RiotPlatformId.OC1]: "https://oc1.api.riotgames.com",
  [RiotPlatformId.PH2]: "https://ph2.api.riotgames.com",
  [RiotPlatformId.SG2]: "https://sg2.api.riotgames.com",
  [RiotPlatformId.TH2]: "https://th2.api.riotgames.com",
  [RiotPlatformId.TW2]: "https://tw2.api.riotgames.com",
  [RiotPlatformId.VN2]: "https://vn2.api.riotgames.com",
};

export function getAccountApiUrl(platformId: RiotPlatformId): string {
  const routingRegion = RIOT_PLATFORM_TO_ROUTING[platformId];
  return RIOT_ACCOUNT_BASE_URLS[routingRegion];
}

export function getPlatformApiUrl(platformId: RiotPlatformId): string {
  return RIOT_PLATFORM_BASE_URLS[platformId];
}

// TODO : Check a better way to normalize roles
export function normalizeRole(role: string): string {
  switch (role) {
    case "MIDDLE":
      return "Mid";
    case "TOP":
      return "Top";
    case "SUPPORT":
      return "Support";
    case "BOTTOM":
      return "Bottom";
    case "JUNGLE":
      return "Jungle";
    default:
      return role;
  }
}
