import { Router } from "express";
import { health } from "./controllers/health.controller";
import {
  getChampionByIdController,
  getChampionsController,
} from "./controllers/champions.controller";
import {
  getSummonerChampionMasteriesController,
  searchSummonerController,
} from "./controllers/summoner.controller";

const router = Router();

// Routes
router.get("/health", health);

// CHAMPIONS

// Champions list
router.get("/champions", getChampionsController);

// Champion
router.get("/champions/:id", getChampionByIdController);

// =======================================

// SUMMONER
// Summoners list (with queryParam)
router.get("/summoner", searchSummonerController);

// Summoner champions mastery
router.get(
  "/summoner/:summonerId/masteries",
  getSummonerChampionMasteriesController
);

// Last matches of a summoner
// router.get('/summoners/:summonerId/matches')

// Summoner's match
// router.get('/summoners/:summonerId/matches/:matchId')

// =======================================

// ITEMS
// router.get('/items', getItems)

export default router;
