const symbols = ['passport.svg', 'search.svg', 'big-ben.svg', 'parachutist.svg', 'smartphone-1.svg', 'cloud-computing.svg', 'smartphone.svg', 'search-1.svg', 'tag.svg', 'gopro.svg', 'camcorder.svg', 'helm.svg', 'coconut.svg', 'devices.svg', 'search-2.svg', 'networking.svg', 'link.svg', 'plane-ticket-1.svg', 'key.svg', 'sailboat.svg', 'barbecue.svg', 'castle.svg', 'server.svg', 'cocktail.svg', 'hotel.svg', 'train.svg', 'ice-cream-1.svg', 'thermometer.svg', 'newspaper.svg', 'bikini.svg', 'browser-1.svg', 'cursor.svg', 'first-aid-kit.svg', 'tent.svg', 'headphones.svg', 'email.svg', 'wifi.svg', 'sunbed.svg', 'doorknob.svg', 'info.svg', 'directions.svg', 'speedometer.svg', 'browser-2.svg', 'glasses.svg', 'eiffel-tower.svg', 'kite.svg', 'caravan.svg', 'chat.svg', 'picture.svg', 'cloud-computing-1.svg', 'collaboration.svg', 'photo-camera.svg', 'bus.svg', 'sun.svg', 'soap.svg', 'browser.svg', 'lifebuoy.svg', 'hot-air-balloon.svg', 'idea.svg', 'compass.svg', 'bicycle.svg', 'credit-card.svg', 'computer.svg', 'clock.svg', 'sun-cream.svg', 'funicular.svg', 'currency.svg', 'calendar.svg', 'route.svg', 'laptop.svg', 'mountains.svg', 'profits.svg', 'baggage.svg', 'rocket.svg', 'arch.svg', 'ice-cream.svg', 'snorkel.svg', 'airplane.svg', 'shopping-basket.svg', 'plane-ticket.svg', 'notebook.svg', 'palm-tree.svg', 'flip-flop.svg'];
const [easyBtn, mediumBtn, hardBtn] = document.querySelectorAll('.btn');

let mode;
let dim = [4, 6, 8];
let classes = ['card-easy', 'card-medium', 'card-hard'];

let matrix = new Map();
let valueMatrix = [];
let removed = [];
let firstMove = -1;
let secondMove = -1;
let moveCounter = 1;
let prevStatus = -1;

easyBtn.addEventListener('click', (e) => {
    console.log('easy mode');
    startGame(0);
});

mediumBtn.addEventListener('click', (e) => {
    console.log('medium mode');
    startGame(1);

});

hardBtn.addEventListener('click', (e) => {
    console.log('hard mode');
    startGame(2);
});

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function remove(id){
    document.getElementById('card' + id).style.background = 'white';
}

function reveal(id){
    document.getElementById('sym' + id).classList.remove('hidden-card');
}

function hide(id){
    document.getElementById('card' + id).style.opacity = '1';
    document.getElementById('sym' + id).classList.add('hidden-card');
}

function correct(id){
    document.getElementById('card' + id).style.opacity = '0';
}

function refresh(values){
    values.forEach((value, i) => {
      if (value){
          reveal(i);
      }else{
          hide(i);
      }
    });
}

function startGame(m){
    mode = m;

    // Hide start form
    document.getElementById('start-form').classList.add('hidden');
    
    let dimension = dim[mode];

    // Show game table
    // - Create a css grid 
    const gameContainer = document.getElementById('game-container');
    gameContainer.classList.add('grid-layout');
    gameContainer.style = `grid-template-columns: repeat(${dimension}, .1fr);`;
    
    // Get the number of cells
    dimension = dimension * dimension;

    // Set the valueMatrix to 
    valueMatrix = Array.from({length: dimension}, () => false);

    let cards = Array.from({length: dimension}, (_, i) => i);
    shuffleArray(cards);
    
    for (let i = 0; i < dimension; i++){

        const newCard = document.createElement('div');
        const image = document.createElement('img');

        image.id = 'sym' + i;
        image.classList.add('hidden-card');

        newCard.id = 'card' + i;
        newCard.classList.add('card');
        newCard.classList.add(classes[mode]);
        newCard.appendChild(image);
        

        newCard.addEventListener('click', (e) => {
            // console.log(removed);
            if(removed.includes(i)){
                return;
            }
            if (moveCounter === 1 && secondMove !== i && firstMove !== i){
                // Hide prev cells
                
                if ( firstMove >= 0 && secondMove >= 0 ){
                    valueMatrix[firstMove] = false;
                    valueMatrix[secondMove] = false;
                    if (prevStatus){
                        remove(firstMove);
                        remove(secondMove);
                    }
                }

                valueMatrix[i] = true;
                firstMove = i;
                secondMove = -1;
                moveCounter = 2;

            }else if (moveCounter === 2 && firstMove !== i){
                if(removed.includes(i)){
                    return;
                }
                if(removed.length === dimension - 2){
                    // console.log('Vittoria');
                    overlay();
                    valueMatrix = Array.from({length: dimension}, (_, i) => true);
                    refresh(valueMatrix);
                    return;
                }
                valueMatrix[i] = true;
                secondMove = i;
                moveCounter = 1;
                if (matrix.get(firstMove) === secondMove || matrix.get(secondMove) === firstMove){
                    // console.log('corretto');
                    removed.push(firstMove);
                    removed.push(secondMove);
                    correct(firstMove);
                    correct(secondMove);
                    prevStatus = 1;
                }
                else{
                    // console.log('sbagliato');
                    prevStatus = 0;
                }
            }

            refresh(valueMatrix);

        });

        gameContainer.appendChild(newCard);
    }

    while(cards.length > 0){

        const card1 = cards.shift(); // card[counter]
        const card2 = cards.shift(); // card[counter + 1]

        matrix.set(card1, card2)
            .set(card2, card1);

        const symbol = symbols.shift();

        document.getElementById('sym' + card1).src = `./images/${symbol}`;
        document.getElementById('sym' + card2).src = `./images/${symbol}`;
        
    }

    // console.log(matrix);

}

shuffleArray(symbols);

function overlay(){
    document.getElementById("myNav").style.width = "100%";
    document.getElementById("myNav").style.opacity = '1';
    document.getElementById("cont").style.opacity = '1';
}
function closeOverlay() {
    document.getElementById("myNav").style.width = "0%";
    document.getElementById("cont").style.opacity = "0";
    location.reload();
}