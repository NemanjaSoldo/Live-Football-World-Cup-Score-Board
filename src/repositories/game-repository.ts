import { Game } from "../models/game";

export interface GameInterface {
    addGame(game: Game): void;
    updateGameScore(game: Game): void;
    finishGame(gameId: string): void;
    getGameById(gameId: string): Game | null;
    getAllLiveGames(): Game[];
}

export class GameRepository implements GameInterface {
    private games: Map<string, Game> = new Map();

    addGame(game: Game): void {
        this.games.set(game.id, game);
    }

    updateGameScore(game: Game): void {
        if (!this.games.has(game.id)) {
            throw new Error('Game not found');
        }
        this.games.set(game.id, game);
    }

    finishGame(gameId: string): void {
        this.games.delete(gameId);
    }

    getGameById(gameId: string): Game | null {
        return this.games.get(gameId) ?? null;
    }

    getAllLiveGames(): Game[] {
        return Array.from(this.games.values());
    }
}