import {
  AfterRemove,
  AfterUpdate,
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeRemove,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  private _idBeforeRemove: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert() {
    console.log(`1inserted use with id : ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`updated use with id : ${this.id}`);
  }

  @BeforeRemove()
  cacheIdBeforeRemove() {
    this._idBeforeRemove = this.id;
  }

  @AfterRemove()
  logRemove() {
    console.log(`removed use with id : ${this._idBeforeRemove}`);
  }
}
