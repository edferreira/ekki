import {Entity, model, property, belongsTo} from '@loopback/repository';
import { User } from '.';

@model()
export class Transaction extends Entity {
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
