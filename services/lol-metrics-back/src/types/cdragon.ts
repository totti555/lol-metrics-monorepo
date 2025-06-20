import { components } from "./openapi";

export type Role = components["schemas"]["Role"];

export interface CDragonChampionSummary {
  id: number;
  name: string;
  alias: string;
  description: string;
  roles: Role[];
  squarePortraitPath: string;
}

export type CDragonSkinsResponse = Record<string, CDragonSkin>;

export interface CDragonSkin {
  id: number;
  isBase: boolean;
  contentId: string;
  loadScreenPath: string;
}
