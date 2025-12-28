import {
  ForbiddenError,
  NotFoundError,
  RateLimitError,
  UnauthorizedError,
} from "@/errors/errors";
import {
  getSummonerChampionMasteries,
  riotIdToSummoner,
} from "@/services/summoners.service";
import { RiotPlatformId } from "@/utils/riotRouting";
import { Request, Response } from "express";

export const searchSummonerController = async (req: Request, res: Response) => {
  try {
    const name = req.query.name as string;
    const tagLine = req.query.tagLine as string;
    const platformId = req.query.platformId as RiotPlatformId;

    if (!name || !tagLine || !platformId) {
      res
        .status(400)
        .json({ message: "Missing name, tagLine or platformId query params" });
      return;
    }

    const summoner = await riotIdToSummoner(name, tagLine, platformId);
    res.status(200).json(summoner);
  } catch (error: unknown) {
    handleRiotErrors(error, res);
  }
};

export const getSummonerChampionMasteriesController = async (
  req: Request,
  res: Response
) => {
  try {
    const puuid = req.params.summonerId as string;
    const platformId = req.query.platformId as RiotPlatformId;

    if (!puuid) {
      res.status(400).json({ message: "Missing summonerId param" });
      return;
    }

    if (!platformId) {
      res.status(400).json({ message: "Missing platformId query param" });
      return;
    }

    const summoner = await getSummonerChampionMasteries(puuid, platformId);
    res.status(200).json(summoner);
  } catch (error: unknown) {
    handleRiotErrors(error, res);
  }
};

const handleRiotErrors = (error: unknown, res: Response) => {
  if (error instanceof UnauthorizedError) {
    res.status(401).json({ message: error.message });
  } else if (error instanceof ForbiddenError) {
    res.status(403).json({ message: error.message });
  } else if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });
  } else if (error instanceof RateLimitError) {
    res.status(429).json({ message: error.message });
  } else {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
