import {GameInterface} from '../repositories/game-repository';
import {Game} from '../models/game';

export class GameService {
    private repository: GameInterface;

    constructor(gameInterface: GameInterface) {
        this.repository = gameInterface;
    }

    addGame(homeTeamName: string, awayTeamName: string): Game {
        const idToAssign = this.repository.getAllLiveGames().length + 1;

        const game: Game = {
            id: idToAssign.toString(),
            homeTeamName,
            awayTeamName,
            homeTeamScore: 0,
            awayTeamScore: 0,
        };
        this.repository.addGame(game);
        return game;
    }

    updateScore(gameId: string, homeTeamScore: number, awayTeamScore: number): void {
        const game = this.repository.getGameById(gameId);
        if (!game) {
            throw new Error(`Game with ID ${gameId} does not exist`);
        }
        game.homeTeamScore = homeTeamScore;
        game.awayTeamScore = awayTeamScore;
        this.repository.updateGameScore(game);
    }

    finishGame(gameId: string): void {
        this.repository.finishGame(gameId);
        console.log(`\nGame ${gameId} has finished!`);
    }

    getGameById(gameId: string): Game | null {
        return this.repository.getGameById(gameId);
    }

    getAllLiveGames(): Game[] {
        const games = this.repository.getAllLiveGames();
        return games.sort((a, b) => {
            const totalScoreHomeTeam = a.homeTeamScore + a.awayTeamScore;
            const totalScoreAwayTeam = b.homeTeamScore + b.awayTeamScore;
            if (totalScoreHomeTeam !== totalScoreAwayTeam) {
                return totalScoreAwayTeam - totalScoreHomeTeam;
            } else {
                return b.id.localeCompare(a.id);
            }
        });
    }
}