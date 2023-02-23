import Board from './Board'
import { Steps } from "./Steps.enum";

export default class Game {
    constructor(step: Steps | null, boards: Array<Board>) {
        this.step = step
        this.boards = boards
    }
    step: Steps | null
    boards: Array<Board>
}

