export const toCDragonUrl = (path: string): string => {
  return `${process.env.COMMUNITY_DRAGON_API_URL}/${path.replace("/lol-game-data/assets/", "").toLowerCase()}`;
};
