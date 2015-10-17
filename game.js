"use strict";

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

class Card {
    constructor() {
    }
}

class Game {
    constructor() {
        this.cards = {};
    }
    
    randomCard() {
        return cardTypes[Math.floor(Math.random() * cardTypes.length)];
    }
    
    set(x, y, card) {
        this.cards[[x, y]] = card;
    }
    
    get(x, y) {
        return this.cards[[x, y]];
    }
    
    canBePlaced(x, y, card) {
        let game = this;
        let neighbours = [[0, -1], [1, 0], [0, 1], [-1, 0]];
        return this.get(x, y) == null  && !neighbours.every(function(n) {
            return game.get(x + n[0], y + n[1]) == null;
        }
        );
    }
}
