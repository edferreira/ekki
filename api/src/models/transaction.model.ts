import {Entity, model, property, belongsTo} from '@loopback/repository';
import { User } from '.';

@model()
export class Transaction extends Entity {
  @belongsTo(() => User)
  from: typeof User.prototype.id;

  @belongsTo(() => User)
  to: typeof User.prototype.id;

  @property({
    type: 'string',
    id: true,
  })
  id?: string;

  @property({
    type: 'number',
    required: true,
  })
  amount: number;

  @property({
    type: 'date',
    default: new Date()
  })
  when?: string;

  constructor(data?: Partial<Transaction>) {
    super(data);
  }
}
