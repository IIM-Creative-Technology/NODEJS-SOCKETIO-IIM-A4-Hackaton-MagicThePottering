
export default class InGameCard {
    constructor(id: string, name: string, description: string, image_url: string | undefined,
                base_mana_cost: number, type: string, base_strength: number, base_health: number) {
        this.id = id
        this.name = name
        this.description = description
        this.image_url = image_url
        this.base_mana_cost = base_mana_cost
        this.type = type
        this.base_strength = base_strength
        this.base_health = base_health
    }
    id: string;

    name: string;

    description: string;

    image_url: string | undefined;

    base_mana_cost: number;

    type: string;

    base_strength: number;

    base_health: number;
}
