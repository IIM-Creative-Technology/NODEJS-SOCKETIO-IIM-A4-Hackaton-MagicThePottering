import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Card {
  @PrimaryGeneratedColumn('uuid')
  id!: string;
}
