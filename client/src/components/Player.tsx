import {FC} from "react";
import Deck from "./Deck";
import CardElement from "./CardElement";

interface Props {
    hand: typeof CardElement[]
    library: typeof CardElement[]
}

const Player: FC<Props> = () => {
    return (
        <div>
            <h2>Player</h2>
            <Deck />

        </div>
    );

}
export default Player;