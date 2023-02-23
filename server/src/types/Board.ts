import InGameCard from "./InGameCard";

export default class Board {
    constructor(id: string){
        this.id = id
    }

    id: string
    hand: Array<InGameCard> = []
    deck: Array<InGameCard> = []
    graveyard: Array<InGameCard> = []
    battlefield: Array<InGameCard> = []
    attackingCards: Array<InGameCard> = []
    defendingCards: Array<InGameCard> = []
    mana: number = 0
    health: number = 0

    updateGraveyard(deadCards: Array<{id: string, current_health: number}>) {
        const cardIdList = deadCards.map(card => card.id);
        const newGraveyard = this.battlefield.filter(({id}) => cardIdList.includes(id));
        this.graveyard = newGraveyard;
        return newGraveyard;

    }
    updateBattlefield(survivingCards: Array<{id: string, current_health: number}>) {
        const cardIdList = survivingCards.map(card => card.id);
        const newBattlefield = this.battlefield.filter(({id}) => cardIdList.includes(id));
        this.battlefield = newBattlefield;
        return newBattlefield;
    }
    resetAttackingCards() {
        this.attackingCards = [];
        return this.attackingCards;
    }
    resetDefendingCards() {
        this.defendingCards = [];
        return this.defendingCards;
    }
}