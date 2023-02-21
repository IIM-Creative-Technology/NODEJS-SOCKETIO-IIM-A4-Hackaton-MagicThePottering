import {FC} from "react";
import CardElement from "./CardElement";


interface Props {
    currentCards: typeof CardElement[]
}

const Deck: FC<Props> = () => {
    return (
        <div>
            <h2>Deck</h2>
            <CardElement attack={1} defense={2} name={"CardElement 1"} costNumber={3} type={"Etre"} description={"Un petit insecte volant venimeux, utilisé pour la fabrication de potions magiques. Un petit insecte volant venimeux, utilisé pour la fabrication de potions magiques."}/>

        </div>
    );

}
export  default Deck;