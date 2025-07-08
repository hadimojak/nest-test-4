import {
  AfterRemove,
  AfterUpdate,
  AfterInsert,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeRemove,
} from 'typeorm';

const privateData = new WeakMap<any, { localId: number }>();

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column()
  password: string;

  @AfterInsert()
  logInsert?() {
    console.log(`1inserted use with id : ${this.id}`);
  }

  @AfterUpdate()
  logUpdate?() {
    console.log(`updated use with id : ${this.id}`);
  }

  @BeforeRemove()
  cacheIdBeforeRemove?() {
    privateData.set(this, { localId: this.id });
  }

  @AfterRemove()
  logRemove?() {
    console.log(`removed use with id : ${privateData.get(this)?.localId}`);
  }
}
