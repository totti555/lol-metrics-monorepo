import { Request, Response } from "express";
import { getAllChampions } from "@/services/champions.service";

export const getChampions = (req: Request, res: Response) => {
  const champions = getAllChampions();
  res.status(200).json(champions);
};
