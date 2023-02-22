import Boards from './Board'

export default class Game {
    constructor(boards: Array<Boards>) {
        this.boards = boards
    }
    boards: Array<Boards>
}

