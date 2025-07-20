import { CdragonChampion, CdragonSpell } from "@/types/cdragon";
import { MAChampion } from "@/types/merakiAnalytics";

const cloneSpell = (
  spell: CdragonSpell,
  key: CdragonSpell["spellKey"]
): CdragonSpell => ({
  ...spell,
  spellKey: key,
});

const baseSpell: CdragonSpell = {
  spellKey: "q",
  name: "Disintegrate",
  abilityIconPath:
    "/lol-game-data/assets/ASSETS/Characters/Annie/HUD/Icons2D/Annie_Q.png",
  abilityVideoPath: "champion-abilities/0001/ability_0001_Q1.webm",
  description: "Hurls fireball",
  cost: "60 Mana",
  cooldown: "4s",
  dynamicDescription: "Deals magic damage.",
  abilityVideoImagePath: "lol-game-data/assets/v1/champion-icons/1.webm",
  maxLevel: 18,
  range: [600],
  costCoefficients: [1],
  cooldownCoefficients: [1],
  coefficients: {
    coefficient1: 1,
    coefficient2: 0,
  },
  ammo: {
    ammoRechargeTime: [1],
    maxAmmo: [1],
  },
};

export const mockChampionAnnie: CdragonChampion = {
  id: 1,
  name: "Annie",
  alias: "Annie",
  title: "the Dark Child",
  shortBio: "Fire child...",
  squarePortraitPath: "/lol-game-data/assets/v1/champion-icons/1.png",
  roles: ["Mid"],
  tacticalInfo: {
    damageType: "kMagic",
    attackType: "ranged",
    style: 10,
    difficulty: 1,
  },
  playstyleInfo: {
    damage: 3,
    durability: 1,
    crowdControl: 3,
    mobility: 1,
    utility: 2,
  },
  spells: [
    cloneSpell(baseSpell, "q"),
    cloneSpell(baseSpell, "w"),
    cloneSpell(baseSpell, "e"),
    cloneSpell(baseSpell, "r"),
    cloneSpell(baseSpell, "p"),
  ],
  skins: [
    {
      id: 1000,
      name: "Annie",
      isBase: true,
      uncenteredSplashPath:
        "/lol-game-data/assets/ASSETS/Characters/Annie/Skins/Base/Images/annie_splash_uncentered_0.jpg",
      rarity: "kNoRarity",
      price: 2,
    },
  ],
};

export const mockMAChampionAnnie: MAChampion = {
  id: 1,
  key: "Annie",
  name: "Annie",
  title: "the Dark Child",
  fullName: "Annie Hastur",
  icon: "http://ddragon.leagueoflegends.com/cdn/15.9.1/img/champion/Annie.png",
  resource: "MANA",
  attackType: "RANGED",
  adaptiveType: "MAGIC_DAMAGE",
  positions: ["MIDDLE"],
  roles: ["BURST", "MAGE", "SUPPORT"],
  attributeRatings: {
    damage: 3,
    toughness: 1,
    control: 3,
    mobility: 1,
    utility: 2,
    abilityReliance: 100,
    difficulty: 1,
  },
  abilities: {
    P: [{ name: "Pyromania", description: "Every 4 spells, stun." }],
    Q: [{ name: "Disintegrate", description: "Hurls fireball." }],
    W: [{ name: "Incinerate", description: "Cone of fire." }],
    E: [{ name: "Molten Shield", description: "Shield and reflect damage." }],
    R: [{ name: "Summon Tibbers", description: "Summons Tibbers." }],
  },
  releaseDate: "2009-02-21",
  releasePatch: "Alpha Week 2",
  patchLastChanged: "25.08",
  price: {
    blueEssence: 450,
    rp: 260,
    saleRp: 0,
  },
  lore: "Annie is a dangerous child mage with pyromantic powers...",
  faction: "unaffiliated",
  skins: [
    {
      id: 1000,
      name: "Original",
      isBase: true,
      availability: "Available",
      formatName: "Original",
      lootEligible: true,
      cost: 260,
      sale: 0,
      distribution: null,
      rarity: "NoRarity",
      chromas: [],
      lore: "Base skin.",
      release: "2009-02-21",
      set: [],
      splashPath: "",
      uncenteredSplashPath: "",
      tilePath: "",
      loadScreenPath: "",
      loadScreenVintagePath: null,
      newEffects: false,
      newAnimations: false,
      newRecall: false,
      newVoice: false,
      newQuotes: false,
      voiceActor: [""],
      splashArtist: ["ArtistName"],
    },
  ],
};
