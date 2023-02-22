import Board from './Board'

export default class Game {
    constructor(boards: Array<Board>) {
        this.boards = boards
    }
    boards: Array<Board>
}

