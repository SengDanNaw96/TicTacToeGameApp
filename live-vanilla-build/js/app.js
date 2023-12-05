
const App = {
    // All of our selected HTML elements
    //DONE
    $: {
        menu: document.querySelector('[data-id="menu"]'),
        menuItems: document.querySelector('[data-id="menu-items"]'),
        resetBtn: document.querySelector('[data-id="reset-btn"]'),
        newRoundBtn: document.querySelector('[data-id="new-round-btn"]'),
        squares: document.querySelectorAll('[data-id="square"]'),
        modal: document.querySelector('[data-id="modal"]'),
        modalText: document.querySelector('[data-id="modal-text"]'),
        modalBtn: document.querySelector('[data-id="modal-btn"]'),
        turn: document.querySelector('[data-id="turn"]'),
    },

    state: {
        moves: [],
    },

    getGameStatus(moves){
        const p1Moves = moves.filter(move => move.playerId === "Player1").map(move => +move.squareId);
        const p2Moves = moves.filter(move => move.playerId === "Player2").map(move => +move.squareId);
        // console.log(moves);

        const winningPatterns = [
            [1, 2, 3],
            [1, 5, 9],
            [1, 4, 7],
            [2, 5, 8],
            [3, 5, 7],
            [3, 6, 9],
            [4, 5, 6],
            [7, 8, 9],
          ];

          let winner = null;
          

          winningPatterns.forEach(pattern =>{

            const p1Wins = pattern.every(val => p1Moves.includes(val));
            const p2Wins = pattern.every(val => p2Moves.includes(val));

             if(p1Wins) winner = "Player1";
             if(p2Wins) winner = "Player2";
          });

          

          return {
            status: moves.length === 9 || winner !== null ? 'complete' : 'in-progress',
            winner: winner, // 1 | 2 | null
          }
    },
    
    init(){
        App.registerEventListeners();
    },
    

    //Container for user Events
    registerEventListeners(){
        //DONE
        App.$.menu.addEventListener('click',()=>{
            App.$.menuItems.classList.toggle('hidden');
        });

        //TODO
        App.$.resetBtn.addEventListener('click', event=>{
            console.log('Reset the game');
        });

        //TODO
        App.$.newRoundBtn.addEventListener('click', event=>{
            console.log('Add a new round');
        });

        App.$.modalBtn.addEventListener('click', event =>{
            App.state.moves = [];
            App.$.squares.forEach(square => square.replaceChildren());
            App.$.modal.classList.add('hidden');
            /* let turnIcon = document.createElement('i');
            let turnLabel = document.createElement('p');
            turnLabel.innerText = "Player1, you're up!";
            turnIcon.classList.add('fa-solid', 'fa-x');
            App.$.turn.classList.add('yellow');
            App.$.turn.replaceChildren(turnIcon, turnLabel); */
        })

        //TODO
        App.$.squares.forEach(square=>{
            square.addEventListener('click', event=>{

                //Check if there is already a play, if so, return early
                const hasMove = (squareId) => {
                    const existingMove = App.state.moves.find((move) => move.squareId === squareId);
                    return existingMove !== undefined;
                }

                if(square.hasChildNodes()){
                    return
                }

                //Determine which player icon to add to the square
                const lastMove = App.state.moves.at(-1);

                const getOppositePlayer = (playerId) => playerId === "Player1" ? "Player2" : "Player1";

                const currentPlayer = App.state.moves.length === 0 ? "Player1" : getOppositePlayer(lastMove.playerId);
                const nextPlayer = getOppositePlayer(currentPlayer);

                const squareIcon = document.createElement('i');
                const turnIcon = document.createElement('i');
                const turnLabel = document.createElement('p');
                turnLabel.innerText = `${nextPlayer}, you're up!`;


                if(currentPlayer == "Player1"){
                    // Player1 turn
                    squareIcon.classList.add("fa-solid", "fa-x", "yellow");
                    turnIcon.classList.add("fa-solid", "fa-o", "turquoise");
                    turnLabel.className = "turquoise";
                    
                }else{
                    //Player2 turn
                    squareIcon.classList.add("fa-solid", "fa-o", "turquoise")
                    turnIcon.classList.add("fa-solid", "fa-x", "yellow")
                    turnLabel.className = "yellow";
                }

                App.$.turn.replaceChildren(turnIcon, turnLabel);

                App.state.moves.push({
                    squareId: +square.id,
                    playerId: currentPlayer,
                });


                square.replaceChildren(squareIcon);

                //Check if there is a winner or tie game;
                const game = App.getGameStatus(App.state.moves);
                if(game.status === 'complete'){
                    App.$.modal.classList.remove('hidden');

                    let message = "";
                    if(game.winner){
                        message = `${game.winner} wins!`;
                    }else{
                        message = "Tie game!"
                    }

                    App.$.modalText.textContent = message;
                }

                // console.log(game);
                
            });
        });
    },

};


window.addEventListener('load', App.init);