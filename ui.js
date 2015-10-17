"use strict";

var ID = 0;

var cardTypes = [
{
    name: "House",
    description: "Small house",
    color: vec3.fromValues(255.0, 0.0, 0.0),
}, 
{
    name: "School",
    description: "Small school",
    color: vec3.fromValues(0.0, 255.0, 0.0),
}, 
{
    name: "Shop",
    description: "Small shop",
    color: vec3.fromValues(0.0, 0.0, 255.0),
}, 
{
    name: "Park",
    description: "Small park",
    color: vec3.fromValues(255.0, 0.0, 255.0),
}, 
];

var cardSize = vec2.fromValues(244, 340);

let trace = console.log.bind(console);


function createBlankCard() {
    var card = document.createElement("DIV");
    card.classList.add("card")
    card.style.width = cardSize[0] - 24;
    card.style.height = cardSize[1] - 24;
    card.id = "handCard" + (ID++);
    return card;
}

function createCard() {
    var type = cardTypes[Math.floor(Math.random() * cardTypes.length)];
    
    let card = createBlankCard();

    var header = document.createElement("DIV");
    header.classList.add("card-header");
    header.innerText = type.name;
    card.appendChild(header);
    
    var description = document.createElement("DIV");
    description.classList.add("card-description");
    description.innerText = type.description;
    card.appendChild(description);
    
    var footer = document.createElement("DIV");
    footer.classList.add("card-footer");
    footer.innerText = "+HH";
    card.appendChild(footer);
    
    var background = type.color;
    var lightBackground = vec3.create();
    var limit = 200.0;
    vec3.max(lightBackground, background, vec3.fromValues(limit, limit, limit));
    
    header.style.background = cssColor(background);
    description.style.background = cssColor(lightBackground);
    footer.style.background = cssColor(background);
    
    return card;
}

function setCardPosition(card, x, y) {
    card.style.position = "absolute";
    card.style.left = x * cardSize[0];
    card.style.top = y * cardSize[1];
    card.style.zIndex = x + y;
}

function addCard(board, card, x, y) {
    setCardPosition(card, x, y);
    board.appendChild(card);
}

function addHandCard(hand, card) {
    card.style.left = null;
    card.style.top = null;
    card.style.position = "relative";
    card.draggable = true;
    card.style.zIndex = null;
    card.ondragstart = function(e) {
        e.dataTransfer.setData("card", card.id);
        var empty = document.createElement('span');
        e.dataTransfer.setDragImage(empty, 0, 0);
    }
    hand.appendChild(card);
}

function cssColor(rgb) {
    return "rgb(" + Array.prototype.join.call(rgb, ",") + ")";
}

function createDropShadow() {
    var shadow = createBlankCard();
    shadow.style.position = "relative";
    shadow.style.pointerEvents = "none";
    shadow.style.display = "none";
    window.q = shadow;
    return shadow;
}

function main() {
    var game = new Game();
    trace(game.f());
    var board = document.getElementById("board");
    var hand = document.getElementById("hand");
    var screen = document.getElementById("screen");
    var transform = mat2d.create();
    
    var dropShadow = createDropShadow();
    board.appendChild(dropShadow);
    
    board.style.pointerEvents = "none";

    var updateTransform = function() {
        board.style.transformOrigin = "left top";
        board.style.transform = "matrix(" + Array.prototype.join.call(transform, ",") + ")";
    }
    
    function getBoardPosition(x, y) {
        let invertedTransform = mat2d.create();
        mat2d.invert(invertedTransform, transform);
        let position = vec2.fromValues(x, y);
        vec2.transformMat2d(position, position, invertedTransform);
        vec2.divide(position, position, cardSize);
        return position;
    }
    
    screen.ondrop = function(e) {
        let card = document.getElementById(e.dataTransfer.getData("card"));
        let position = getBoardPosition(e.x, e.y);
        dropShadow.style.display = "none";
        addCard(board, card, Math.floor(position[0]), Math.floor(position[1]));
    }
    
    screen.ondragover = function(e) {
        let position = getBoardPosition(e.x, e.y);
        let card = document.getElementById(e.dataTransfer.getData("card"));
        board.appendChild(card);
        setCardPosition(card, Math.floor(position[0]), Math.floor(position[1]));
        dropShadow.style.display = "block";
        e.preventDefault();
    }

    screen.ondragleave = function(e) {
        let card = document.getElementById(e.dataTransfer.getData("card"));
        addHandCard(hand, card);
        e.preventDefault();
    }

    screen.onmousedown = function(e) {
        screen.onmousemove = function(e) {
            if (e.buttons === 1) {
                var translation = mat2d.create();
                mat2d.fromTranslation(translation, vec2.fromValues(e.movementX, e.movementY));
                mat2d.multiply(transform, translation, transform);
                updateTransform();
            }
            e.preventDefault();
        }
        e.preventDefault();
    }
    screen.onmousewheel = function(e) {
        var scaleDelta = Math.pow(1.5, e.wheelDelta / 120);
        mat2d.scale(transform, transform, vec2.fromValues(scaleDelta, scaleDelta));
        updateTransform();
        e.preventDefault();
    }
    updateTransform();
    
    for (var y = 0; y < 2; y++) {
        for (var x = 0; x < 2; x++) {
            addCard(board, createCard(), x, y);
        }
    }
    
    for (var y = 0; y < 10; y++) {
        addHandCard(hand, createCard());
    }
}
