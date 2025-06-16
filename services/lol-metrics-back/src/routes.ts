import { Router } from "express";
import { health } from "./controllers/health.controller";
// IMPORT ROUTER

const router = Router();

// Routes
router.get("/health", health);

// CHAMPIONS

// Champions list
// router.get('/champions', getChampions);

// Champion
// router.get('/champions/:id', getChampionById);

// =======================================

// SUMMONER
// Summoners list (with queryParam)
// router.get('/summoners', searchSummoners);

// Summoner (queryParam moreDetails -->  rank + mastery)
// router.get('/summoners/:summonerName', searchSummonerByName )

// Last matches of a summoner
// router.get('/summoners/:summonerId/matches')

// Summoner's match
// router.get('/summoners/:summonerId/matches/:matchId')

// =======================================

// ITEMS
// router.get('/items', getItems)

export default router;
