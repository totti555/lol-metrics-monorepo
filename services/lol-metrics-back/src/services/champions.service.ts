import champions from "@/data/champions.json";
import { components } from "@/types/openapi";

type Champion = components["schemas"]["Champion"];

export const getAllChampions = (): Champion[] => {
  return champions;
};
