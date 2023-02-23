import InGameCard from "./InGameCard";

export default interface Board {
    id: string,
    api_id: number,
    hand: Array<InGameCard> | null,
    deck: Array<InGameCard> | null,
    graveyard: Array<InGameCard> | null,
    battlefield: Array<InGameCard> | null,
    mana: number | null
    health: number | null
}