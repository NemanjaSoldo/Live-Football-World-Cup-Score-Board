import { GameService } from '../src/services/game-service';
import { GameRepository } from '../src/repositories/game-repository';

describe('GameService', () => {
    let gameService: GameService;
    let gameRepository: GameRepository;

    beforeEach(() => {
        gameRepository = new GameRepository();
        gameService = new GameService(gameRepository);
    });

    it('should add a new game', () => {
        const game = gameService.addGame('Team A', 'Team B');

        expect(gameRepository.getAllLiveGames().length).toBe(1);
        expect(game.homeTeamName).toBe('Team A');
        expect(game.awayTeamName).toBe('Team B');
        expect(game.homeTeamScore).toBe(0);
        expect(game.awayTeamScore).toBe(0);
    });

    it('should update score for an existing game', () => {
        const game = gameService.addGame('Team A', 'Team B');
        gameService.updateScore(game.id, 3, 2);

        gameService.updateScore('1', 3, 2);

        const updatedGame = gameService.getGameById(game.id);
        expect(updatedGame?.homeTeamScore).toBe(3);
        expect(updatedGame?.awayTeamScore).toBe(2);
    });

    it('should finish a game', () => {
        const game = gameService.addGame('Team A', 'Team B');
        expect(gameRepository.getAllLiveGames().length).toBe(1);

        gameService.finishGame(game.id);
        expect(gameRepository.getAllLiveGames().length).toBe(0);
    });


    it('should return a game by its ID', () => {
        const game1 = gameService.addGame('Team A', 'Team B');
        const game2 = gameService.addGame('Team C', 'Team D');

        const testGame = {
            id: '2',
            homeTeamName: 'Team C',
            awayTeamName: 'Team D',
            homeTeamScore: 0,
            awayTeamScore: 0,
        }
        const game = gameService.getGameById('2');
        expect(game).toEqual(testGame);
    });

    it('should return null if provided game id does not exist', () => {
        const game= gameService.getGameById('3');

        expect(game).toBeNull();
    });

    it('should return a sorted live-game scoreboard', () => {
        const game1 = gameService.addGame('Team A', 'Team B');
        const game2 = gameService.addGame('Team C', 'Team D');
        const game3 = gameService.addGame('Team E', 'Team F');

        gameService.updateScore(game1.id, 2, 1);
        gameService.updateScore(game2.id, 1, 0);
        gameService.updateScore(game3.id, 1, 0);

        const liveGames = gameService.getAllLiveGames();

        expect(liveGames[0].homeTeamName).toBe('Team A');
        expect(liveGames[1].homeTeamName).toBe('Team E');
        expect(liveGames[2].homeTeamName).toBe('Team C');
    });
});
