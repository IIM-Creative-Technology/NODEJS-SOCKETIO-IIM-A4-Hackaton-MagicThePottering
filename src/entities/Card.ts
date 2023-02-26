import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Card {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  name!: string;

  @Column()
  type!: string;

  @Column()
  baseAttack!: string;

  @Column('integer')
  baseHealth!: number;

  @Column('integer')
  cost!: number;

  @Column()
  description!: string;
}

export default Card;
