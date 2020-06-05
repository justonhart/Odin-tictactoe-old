//Player 1 is X, player 2 is O

//game logic will go here
const game = (()=> {
    let _gameState = [null, null, null, 
                      null, null, null, 
                      null, null, null];
    
    //return true if the update was accepted
    const updateGameState = (space, playerMark) => {
        if(!_gameState[space]){
            _gameState[space] = playerMark;
            return true;
        }
        return false;
    };

    /**
     * Return values:
     * -1 = tie
     * 0 = ready for input
     * 1 = player one wins
     * 2 = player two wins
     */
    const checkGameState = () => {

        let win = _checkForWins();
        //if a player wins
        if(win){
            return win;
        }
        //if there are no empty spaces available
        else if(_gameState.filter( val => val != null).length === 9){
            return {winner: -1};
        }

        else
            return {winner: 0};
    };

    /**
     * Return values:
     * 0 = no win state reached
     * 1 = player one wins
     * 2 = player two wins
     */
    const _checkForWins = () => {
        const winStates = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [2,4,6]
        ];

        for(let i = 0; i < 8; i++){
            let values = winStates[i].map(e => _gameState[e]);
            if(values[0] !== null && values[0] === values[1] && values[0] === values[2]){
                if(values[0] === "X"){
                    return {winner: 1, state: winStates[i]};
                }
                    
                else if(values[0] === "O"){
                    return {winner: 2, state: winStates[i]};
                }
            }
        };

        return 0;

    }

    const resetGame = () =>{
        _gameState = [null, null, null, null, null, null, null, null, null];
    }

    return {updateGameState, checkGameState, resetGame};
})();

//html-affecting code will go here
const displayController = (() => {
    let _gameBoard = document.querySelectorAll('.gameSpace');
    let _players = { playerOne: null, playerTwo: null};
    let _currentTurn;
    let _gameActive;

    const startGame = () => {
        _setPlayers();
        _switchView();
        _gameBoard.forEach( space => {
            space.addEventListener('click', _gameSpaceListener)
        });
        _gameActive = true;
    };

    const _switchView = () => {
        document.getElementById('nameEntry').classList.add('doNotDisplay');
        document.getElementById('gameContainer').classList.remove('doNotDisplay');
    }

    const _setPlayers = () => {
        _players.playerOne = Player(document.getElementById('nameOne').value, "X");
        _players.playerTwo = Player(document.getElementById('nameTwo').value, "O");
        _currentTurn = "playerOne";
    }

    const _updateBoard = (space) => {
        _gameBoard[space].innerText = _players[_currentTurn].getMark();
        let status = game.checkGameState();
        switch(status.winner){
            case -1: 
                //display tie screen
                document.getElementById('header').innerText = "Tie game!";
                _finalizeBoard(status.state);
                break;
            case 1:
                //display player one win and increase score
                document.getElementById('header').innerText = `${_players.playerOne.getName()} wins!`;
                _finalizeBoard(status.state);
                _players.playerOne.incrementScore();
                break;
            case 2:
                //display player two win and increase score
                document.getElementById('header').innerText = `${_players.playerTwo.getName()} wins!`;
                _finalizeBoard(status.state);
                _players.playerTwo.incrementScore();
                break;
            case 0:
                //switch turns
                _currentTurn = (_currentTurn === "playerOne" ? "playerTwo" : "playerOne");
                break;
        }
    }

    const _finalizeBoard = (winningThree) => {
        
        if(winningThree){
            for(let i = 0; i < 3; i++){
                _gameBoard[winningThree[i]].style.backgroundColor = "green";
            }
        }

        else{
            for(let i = 0; i < 9; i++){
                _gameBoard[i].style.backgroundColor = "lightgrey";
            } 
        }
        
        
        _gameActive = false;
        document.getElementById("resetButton").removeAttribute('hidden');
    }

    const resetGame = () => {
        document.getElementById('header').innerText = `Tic-Tac-Toe!`;
        _gameBoard.forEach(space => {
            space.style.backgroundColor = 'white';
            space.innerText = "";
        });
        _gameActive = true;
        game.resetGame();
        document.getElementById("resetButton").setAttribute('hidden', true);
    }

    const _gameSpaceListener = () => {
        if(_gameActive && game.updateGameState(event.target.id, _players[_currentTurn].getMark())){
            _updateBoard(event.target.id);
        }
    }

    return {startGame, resetGame};
})();

//factory for player objects
const Player = (name, mark) => {
    let _score = 0;
    const getScore = () => _score;
    const incrementScore = () => ++_score;
    const getName = () => name;
    const getMark = () => mark;
    return {getScore, incrementScore, getName, getMark};
};
