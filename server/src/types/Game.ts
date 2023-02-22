import Board from './Board'

export default class Game {
    constructor(id: string, boards: Array<Board>) {
        this.id = id
        this.boards = boards
    }
    id: string
    boards: Array<Board>
}

