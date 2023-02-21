import {FC} from "react";
import Player from "./Player";

interface Props {

}

const Game: FC<Props> = () => {
    return (
        <div>
            <h2>Game</h2>
            <Player/>
        </div>
    );

}
export  default Game;