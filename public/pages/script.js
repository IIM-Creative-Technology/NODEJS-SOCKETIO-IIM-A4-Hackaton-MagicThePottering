const cardList = [
    [1, "common"],
    [2, "common"],
    [3, "common"],
    [4, "common"],
    [5, "common"],
    [6, "common"],
    [7, "common"],
    [8, "common"],
    [9, "uncommon"],
    [10, "uncommon"],
    [11, "uncommon"],
    [12, "uncommon"],
    [13, "uncommon"],
    [14, "uncommon"],
    [15, "uncommon"],
    [16, "rare"],
    [17, "rare"],
    [18, "rare"],
    [19, "rare"],
    [20, "rare"],
    [21, "epic"],
    [22, "epic"],
    [23, "epic"],
    [24, "legendary"],
    [25, "legendary"]
];

const cardImportance = [
    "common",
    "uncommon",
    "rare",
    "epic",
    "legendary"
];
const priority = element => cardImportance.indexOf(element[1]);

const cardsInBooster = 10;
let menuBoosterIsHide = false;
let windowBoosterIsHide = true;
let windowDeckBuildingIsHide = true;
let cardIdCounter = 0;
let oldRarity;

document.getElementById("closeMenu").addEventListener("click", closeMenu);
document.getElementById("closeWindow").addEventListener("click", helpWindow);
document.getElementById("openHelp").addEventListener("click", helpWindow);
document.getElementById("deckBuildingButton").addEventListener("click", deckBuildingWindow);
document.getElementById("sortCardsButton").addEventListener("click", sortCards);
document.getElementById("windowBackground").addEventListener("click", exitWindowMode);

function showCard(element){
    const children = element.parentNode.children;

    document.getElementById("cardDetails").classList.remove(`${oldRarity}2`);
    const name = children[2].innerHTML
    const rarity = children[0].className.split(" ")[1].split("Card")[0];
    console.log(rarity)
    const properties = [name, rarity];
    oldRarity = properties[1];

    windowBoosterIsHide = false;
    document.getElementById("windowBackground").style.display = "flex";
    document.getElementById("cardDetails").style.display = "flex";
    document.getElementById("cardDetails").innerHTML = properties[0];
    document.getElementById("cardDetails").classList.add(`${properties[1]}2`);
    document.getElementById("cardDetails").style.backgroundColor = "white";
}

function exitWindowMode(){
    document.getElementById("windowBackground").style.display = "none";
    document.getElementById("window").style.display = "none";
    document.getElementById("errorBox").style.display = "none";
    document.getElementById("cardDetails").style.display = "none";
    windowBoosterIsHide = true;
}

function sortCards() {
    let cardsSorted = [];

    for (const child of document.getElementById("cardsSpace").children) {
        const cardRarity = child.className.split(" ")[1];
        const cardId = child.id.split("-")[1];
        const cardHtml = child.innerHTML;
        cardsSorted.push([cardId, cardRarity, cardHtml]);
    }
    cardsSorted.sort((a, b) => priority(a) - priority(b));

    document.getElementById("cardsSpace").innerHTML = "";

    cardsSorted.forEach(element => 
        document.getElementById("cardsSpace").insertAdjacentHTML("beforeend", `
            <div class="card ${element[1]}" id="card-${element[0]}" onclick="addCardToDeck(${element[0]}, ${element[2]})">${element[2]}</div>
        `)
    );

    document.getElementById("cardSortType").innerHTML = "Rareté";
}

function deckBuildingWindow(){
    if (windowDeckBuildingIsHide === false) {
        document.getElementById("deckBuildingDiv").style.display = "none";
        document.getElementById("cardsSpace").style.width = "100%";
    } else {
        document.getElementById("deckBuildingDiv").style.display = "flex";
        document.getElementById("cardsSpace").style.width = "80%";
        document.getElementById("cardsSpace").style.left = 0;
    }  
    windowDeckBuildingIsHide = !windowDeckBuildingIsHide;
}

function helpWindow(){
    if (windowBoosterIsHide === false) {
        document.getElementById("windowBackground").style.display = "none";
        document.getElementById("window").style.display = "none";

    } else {
        document.getElementById("windowBackground").style.display = "flex";
        document.getElementById("window").style.display = "block";
    }  
    windowBoosterIsHide = !windowBoosterIsHide;
}

function closeMenu() {
    if (menuBoosterIsHide === false) {
        document.getElementById("boosterSpace").style.display = "none";
        //document.getElementById("cardsSpace").style.height = "100%";
    } else {
        document.getElementById("boosterSpace").style.display = "flex";
        //document.getElementById("cardsSpace").style.height = "70%";
    }  
    menuBoosterIsHide = !menuBoosterIsHide;
}

document.addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        if (menuBoosterIsHide === false) {
            document.getElementById("boosterSpace").style.display = "none";
            //document.getElementById("cardsSpace").style.height = "100%";
        } else {
            document.getElementById("boosterSpace").style.display = "flex";
            //document.getElementById("cardsSpace").style.height = "70%";
        }
        menuBoosterIsHide = !menuBoosterIsHide;
    }
});

function generateBooster() {
    document.getElementById("boosterSpace").insertAdjacentHTML("beforeend", `
        <img src="./assets/deck-pottering.svg" class="booster" id="booster-1" onclick="openBooster(1)" />
        <img src="./assets/deck-pottering.svg" class="booster" id="booster-2" onclick="openBooster(2)" />
        <img src="./assets/deck-pottering.svg" class="booster" id="booster-3" onclick="openBooster(3)" />
        <img src="./assets/deck-pottering.svg" class="booster" id="booster-4" onclick="openBooster(4)" />
        <img src="./assets/deck-pottering.svg" class="booster" id="booster-5" onclick="openBooster(5)" />
    `);
}

/*
function openBooster(button) {
    let cardsobtained = [];

    button.remove();
    for (let i = 0; i < cardsInBooster; i++){
        randomCard = Math.floor(Math.random() * cardList.length + 1);
        cardsobtained.push(cardList[(randomCard - 1)]);
    }

    showCards(cardsobtained)
}
*/

function showCards(cardsobtained){
    compteur = 1;

    cardsobtained.forEach(element => 
        setTimeout(function(){
            document.getElementById("cardsSpace").insertAdjacentHTML("beforeend", `
                <div class="card ${element[1]}" id="card-${cardIdCounter}" onclick="addCardToDeck(${cardIdCounter}, ${element[0]})">${element[0]}</div>
            `)
            cardIdCounter++;
        },150 * compteur++)
    );
}





// SOCKET

socket.on("serverGetBooster", () => {
    generateBooster();
})

function openBooster(id) {
    socket.emit('clientRequestBoosterOpening', id);
}

socket.on('serverBoosterNoKey', () => {
    windowBoosterIsHide = false;
    document.getElementById("windowBackground").style.display = "flex";
    document.getElementById("errorBox").style.display = "flex";
    document.getElementById("errorBoxText").innerHTML = "Vous n'avez plus de clé !";
    //alert("Vous n'avez plus de clé !");
})

socket.on("serverGetAuthorizationBoosterOpening", (data) => {
    let cardsobtained = [];

    document.getElementById(`booster-${data.id}`).remove();
    for (let i = 0; i < cardsInBooster; i++){
        randomCard = Math.floor(Math.random() * cardList.length + 1);
        cardsobtained.push(cardList[(randomCard - 1)]);
    }
    
    document.getElementById("keyValue").innerHTML = `${data.boosterKeys}`;
    /*socket.emit('clientChangeKeyValue');*/
    showCards(cardsobtained)
})

function addCardToDeck(cardId, cardNumber) {
    socket.emit('clientAddCardToDeck', ({cardId, cardNumber}))
    //document.getElementById("deckBuildingDiv").insertAdjacentHTML("beforeend", `<div>Test</div>`);
}

socket.on("serverUpdateDeck", (data) => {
    //myDecklist = data.clientDeck;
    const myDeckList = data.clientDeck;
    document.getElementById(`card-${data.cardId}`).remove();
    deckListUpdate(myDeckList);
})

function removeCardFromDeck(cardNumber){
    socket.emit('clientRemoveCardFromDeck', (cardNumber));
}

socket.on("serverUpdateDeckAfterCardDelete", (data) => {
    const cardNumber = data.cardNumber;
    const myDeckList = data.clientDeck;
    cardIndex = cardList[cardNumber - 1];

    document.getElementById("cardsSpace").insertAdjacentHTML("beforeend", `
        <div class="card ${cardIndex[1]}" id="card-${cardIdCounter}" onclick="addCardToDeck(${cardIdCounter}, ${cardIndex[0]})">${cardIndex[0]}</div>
    `);
    cardIdCounter++;
    deckListUpdate(myDeckList);
})

function deckListUpdate(myDeckList) {
    document.getElementById("deckBuildingDiv").innerHTML = "";
    myDeckList.forEach(element => {
        const cardRarity = cardList[element - 1][1];
        const cardNumber = cardList[element - 1][0];

        document.getElementById("deckBuildingDiv").insertAdjacentHTML("beforeend", `
            <div class="deckListCard">
                <div class="cardRarity ${cardRarity}Card"></div>
                <div class="cardCost"></div>
                <div class="cardName" onclick="showCard(this)">${cardNumber}</div>
                <button class="cardRemove" onclick="removeCardFromDeck(${cardNumber})">╳</button>
            </div>
        `);
    })
}

/*
socket.on("serverKeyNewValue", (keyValue) => {
    document.getElementById("keyValue").innerHTML = `${keyValue}`;
})
*/