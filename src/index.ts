import { GameRepository } from './repositories/game-repository';
import { GameService } from './services/game-service';
import * as readline from 'readline';

const repository = new GameRepository();
const gameService = new GameService(repository);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const menu = `
1. Start a new game
2. Update score
3. Finish game
4. Get summary of games in progress
5. Exit`;

const displayGameActions = () => {
    console.log(menu);

    rl.question('Choose an option: ', (option) => {
        switch (option) {
            case '1':
                rl.question('Enter home team name: ', (homeTeam) => {
                    rl.question('Enter away team name: ', (awayTeam) => {
                        const game = gameService.addGame(homeTeam, awayTeam);
                        getLiveGamesScoreboard();
                    });
                });
                break;
            case '2':
                if (gameService.getAllLiveGames().length > 0) {
                    const promptForGameId = () => {
                        rl.question('Enter game ID: ', (gameId) => {
                            if (gameService.getGameById(gameId) === null) {
                                console.log('\nGame with this ID does not exist. Please enter a valid game ID.');
                                promptForGameId();
                            } else {
                                promptForScores(gameId);
                            }
                        });
                    }
                    const promptForScores = (gameId: string) => {
                        rl.question('Enter home team score: ', (homeTeamScore) => {
                            rl.question('Enter away team score: ', (awayTeamScore) => {
                                gameService.updateScore(
                                    gameId,
                                    homeTeamScore && !isNaN(Number(homeTeamScore)) ? parseInt(homeTeamScore) : 0,
                                    awayTeamScore && !isNaN(Number(awayTeamScore)) ? parseInt(awayTeamScore) : 0
                                );
                                getLiveGamesScoreboard();
                            });
                        });
                    };
                    promptForGameId();
                } else {
                    displayNoGamesInProgressInfo();
                }
                break;
            case '3':
                if (gameService.getAllLiveGames().length > 0) {
                    const promptForGameId = () => {
                        rl.question('Enter game ID: ', (gameId) => {
                            if (gameService.getGameById(gameId) === null) {
                                console.log('\nGame with this ID does not exist. Please enter a valid game ID.');
                                promptForGameId();
                            } else {
                                gameService.finishGame(gameId);
                                getLiveGamesScoreboard();
                            }
                        });
                    }
                    promptForGameId();
                } else {
                    displayNoGamesInProgressInfo();
                }
                break;
            case '4':
                getLiveGamesScoreboard();
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('\nYou must select valid option!');
                displayGameActions();
                break;
        }
    });
};

const getLiveGamesScoreboard = () => {
    const liveGames = gameService.getAllLiveGames();
    if (liveGames.length > 0) {
        console.log('\nLive scoreboard:')
        console.log('________________________________________________________\n')
        liveGames.forEach((game) => {
            console.log(`Game ${game.id}   |   ${game.homeTeamName} (${game.homeTeamScore} - ${game.awayTeamScore}) ${game.awayTeamName}\n`);
        });
        console.log('________________________________________________________')
        displayGameActions();
    } else {
        displayNoGamesInProgressInfo();
    }
}

const displayNoGamesInProgressInfo = () => {
    console.log('________________________________________________________')
    console.log('\n Currently there are no games in progress');
    console.log('________________________________________________________')
    displayGameActions();
}

displayGameActions();