import {Entity, model, property, hasMany} from '@loopback/repository';
import { Favorite } from './favorite.model';
import { Transaction } from '.';

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
  })
  accountNumber: string;

  @property({
    type: 'array',
    itemType: 'object',
  })
  favorites?: Favorite[];

  @hasMany(() => Transaction, {keyTo: 'from'})
  transactionsDone?: Transaction[];

  @hasMany(() => Transaction, {keyTo: 'to'})
  transactionsReceived?: Transaction[];

  constructor(data?: Partial<User>) {
    super(data);
  }
}
