import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class Card {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column()
    name!: string;

    @Column()
    description!: string;

    @Column({nullable: true})
    //image_url nullable
    image_url?: string;

    @Column()
    base_mana_cost!: number;

    @Column()
    type!: string;

    @Column()
    base_strength!: number;

    @Column()
    base_health!: number;
}
