export interface MAChampion {
  id: number;
  key: string;
  name: string;
  title: string;
  fullName: string;
  icon: string;
  resource: string;
  attackType: "RANGED" | "MELEE" | string;
  adaptiveType: "MAGIC_DAMAGE" | "PHYSICAL_DAMAGE" | "TRUE_DAMAGE" | string;
  stats?: Record<keyof MAStatBlock, MAStat>;
  positions: string[];
  roles: string[];
  attributeRatings: MAAttributeRatings;
  abilities: MAChampionAbilities;
  releaseDate: string;
  releasePatch: string;
  patchLastChanged: string;
  price: {
    blueEssence: number;
    rp: number;
    saleRp: number;
  };
  lore: string;
  faction: string;
  skins: MASkin[];
}

export interface MAStat {
  flat: number;
  percent: number;
  perLevel: number;
  percentPerLevel: number;
}

export interface MAStatBlock {
  health: MAStat;
  healthRegen: MAStat;
  mana: MAStat;
  manaRegen: MAStat;
  armor: MAStat;
  magicResistance: MAStat;
  attackDamage: MAStat;
  movespeed: MAStat;
  acquisitionRadius: MAStat;
  selectionRadius: MAStat;
  pathingRadius: MAStat;
  gameplayRadius: MAStat;
  criticalStrikeDamage: MAStat;
  criticalStrikeDamageModifier: MAStat;
  attackSpeed: MAStat;
  attackSpeedRatio: MAStat;
  attackCastTime: MAStat;
  attackTotalTime: MAStat;
  attackDelayOffset: MAStat;
  attackRange: MAStat;
  aramDamageTaken: MAStat;
  aramDamageDealt: MAStat;
  aramHealing: MAStat;
  aramShielding: MAStat;
  aramTenacity: MAStat;
  aramAbilityHaste: MAStat;
  aramAttackSpeed: MAStat;
  aramEnergyRegen: MAStat;
  urfDamageTaken: MAStat;
  urfDamageDealt: MAStat;
  urfHealing: MAStat;
  urfShielding: MAStat;
}

export interface MAAttributeRatings {
  damage: number;
  toughness: number;
  control: number;
  mobility: number;
  utility: number;
  abilityReliance: number;
  difficulty: number;
}

export interface MAChampionAbilities {
  P: MAAbility[];
  Q: MAAbility[];
  W: MAAbility[];
  E: MAAbility[];
  R: MAAbility[];
}

export interface MAAbility {
  name?: string;
  description?: string;
  iconPath?: string;
}

export interface MASkin {
  id: number;
  name: string;
  isBase: boolean;
  availability: string;
  formatName: string;
  lootEligible: boolean;
  cost: number;
  sale: number;
  distribution: string | null;
  rarity: string;
  chromas: any[]; // not managed
  lore: string;
  release: string;
  set: any[]; // not managed
  splashPath: string;
  uncenteredSplashPath: string;
  tilePath: string;
  loadScreenPath: string;
  loadScreenVintagePath: string | null;
  newEffects: boolean;
  newAnimations: boolean;
  newRecall: boolean;
  newVoice: boolean;
  newQuotes: boolean;
  voiceActor: string[];
  splashArtist: string[];
}
