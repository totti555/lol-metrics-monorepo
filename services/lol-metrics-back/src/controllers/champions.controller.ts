import { Request, Response } from "express";
import { getAllChampions } from "@/services/champions.service";

export const getChampions = async (req: Request, res: Response) => {
  const champions = await getAllChampions();
  res.status(200).json(champions);
};
