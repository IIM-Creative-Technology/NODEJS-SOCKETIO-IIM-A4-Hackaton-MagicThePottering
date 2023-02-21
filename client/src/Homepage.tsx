import {FC} from "react";
import Header from "./components/Header";
import Game from "./components/Game";


const Homepage: FC = () => {
    return (
        <div>
            <Header/>
            <Game/>
        </div>
    );

}
export default Homepage;