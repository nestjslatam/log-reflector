import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class LogReflectorTypeOrm {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public context: string;

  @Column()
  public message: string;

  @Column()
  public level: string;

  @CreateDateColumn()
  creationDate: Date;
}
