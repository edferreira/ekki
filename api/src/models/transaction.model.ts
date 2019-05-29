import {Entity, model, property } from '@loopback/repository';
import { User } from '.';

@model()
export class Transaction extends Entity {
  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: 'true'
  })
  from: typeof User.prototype.id;

  @property({
    type: 'string',
    required: 'true'
  })
  to: typeof User.prototype.id;

  @property({
    type: 'boolean',
    default: false,
  })
  useLimit: boolean;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'date',
    default: () => new Date()
  })
  when?: string;

  @property({
    type: 'boolean',
    default: false,
  })
  canceled: boolean;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }

  static valid(transaction: Transaction){
    if (transaction.amount <= 0) return false
    return true;
  }
}
