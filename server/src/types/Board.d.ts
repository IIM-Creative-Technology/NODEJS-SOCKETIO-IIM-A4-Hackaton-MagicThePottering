import InGameCard from "./InGameCard";

export default interface Board {
    id: string,
    api_id: number,
    hand: Array<Card> | null,
    deck: Array<Card> | null,
    graveyard: Array<Card> | null,
    battlefield: Array<Card> | null,
    mana: number | null
    health: number | null
}