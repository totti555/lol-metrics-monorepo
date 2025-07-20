import { Request, Response } from "express";
import { getAllChampions, getChampionById } from "@/services/champions.service";

export const getChampionsController = async (req: Request, res: Response) => {
  const champions = await getAllChampions();
  res.status(200).json(champions);
};

export const getChampionByIdController = async (
  req: Request,
  res: Response
) => {
  const champions = await getChampionById(req.params.id);
  res.status(200).json(champions);
};
