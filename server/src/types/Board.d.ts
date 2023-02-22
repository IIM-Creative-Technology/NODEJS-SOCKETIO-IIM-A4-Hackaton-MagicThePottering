import Card from "../entities/Card";

export default interface Board {
    hand: Array<Card> | null,
    deck: Array<Card> | null,
    graveyard: Array<Card> | null,
    battlefield: Array<Card> | null,
    mana: number | null
}