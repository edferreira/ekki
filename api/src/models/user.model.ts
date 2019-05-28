import {Entity, model, property, hasMany} from '@loopback/repository';
import { Favorite } from './favorite.model';
import { Transaction } from '.';
const uuidV4 = require('uuid/v4');

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: true,
  })
  cpf: string;

  @property({
    type: 'string',
    required: true,
  })
  cellphone: string;

  @property({
    type: 'string',
    default: uuidV4()
  })
  accountNumber: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  favorites?: Favorite[];

  @property({
    type: 'number',
    default: 1000,
  })
  amount: number;

  @property({
    type: 'number',
    default: 500,
  })
  limit: number;

  @hasMany(() => Transaction, {keyTo: 'from'})
  transactionsDone?: Transaction[];

  @hasMany(() => Transaction, {keyTo: 'to'})
  transactionsReceived?: Transaction[];

  constructor(data?: Partial<User>) {
    super(data);
  }

  canDoTransaction(amount: number) {
    return (this.amount + this.limit) >= amount 
  }
}
