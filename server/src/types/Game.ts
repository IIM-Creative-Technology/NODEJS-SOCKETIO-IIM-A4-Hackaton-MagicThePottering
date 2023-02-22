import Boards from './Board'

export default class Game {
    constructor(id: string, boards: Map<string, Boards>) {
        this.id = id
        this.boards = boards
    }
    id: string
    boards: Map<string, Boards>
}

