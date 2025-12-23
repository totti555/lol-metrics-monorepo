import { Role } from "@/types";
export type SpellKey = "q" | "w" | "e" | "r" | "p";

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

export interface CdragonChampion {
  id: number;
  name: string;
  alias: string;
  title: string;
  shortBio: string;
  tacticalInfo: CdragonTacticalInfo;
  playstyleInfo: CdragonPlaystyleInfo;
  championTagInfo?: CdragonChampionTagInfo;
  squarePortraitPath: string;
  stingerSfxPath?: string;
  chooseVoPath?: string;
  banVoPath?: string;
  roles: Role[];
  recommendedItemDefaults?: any[]; // not managed
  skins: CdragonSkinSummary[];
  passive?: CdragonAbility;
  spells: CdragonSpell[];
}

export interface CdragonTacticalInfo {
  style?: number;
  difficulty?: number;
  attackType?: "melee" | "ranged";
  damageType?: "kMagic" | "kPhysical" | "kMixed";
}

export interface CdragonPlaystyleInfo {
  damage: number;
  durability: number;
  crowdControl: number;
  mobility: number;
  utility: number;
}

export interface CdragonChampionTagInfo {
  championTagPrimary: string;
  championTagSecondary: string;
}

export interface CdragonSkinSummary {
  id: number;
  name: string;
  isBase: boolean;
  uncenteredSplashPath: string;
  rarity: "kNoRarity" | "kEpic" | "kLegendary" | "kMythic" | string;
  price: number | "Special";
}

export interface CdragonAbility {
  name: string;
  abilityIconPath: string;
  abilityVideoPath: string;
  abilityVideoImagePath: string;
  description: string;
}

export interface CdragonSpell extends CdragonAbility {
  spellKey: SpellKey;
  cost: string;
  cooldown: string;
  dynamicDescription: string;
  range: number[];
  costCoefficients: number[];
  cooldownCoefficients: number[];
  coefficients: CdragonCoefficients;
  ammo: CdragonAmmo;
  maxLevel: number;
}

export interface CdragonCoefficients {
  coefficient1: number;
  coefficient2: number;
}

export interface CdragonAmmo {
  ammoRechargeTime: number[];
  maxAmmo: number[];
}
