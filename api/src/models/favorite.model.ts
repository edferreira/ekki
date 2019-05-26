import {Model, model, property} from '@loopback/repository';

@model()
export class Favorite extends Model {
  @property({
    type: 'string',
  })
  name?: string;

  @property({
    type: 'string',
  })
  accountNumber?: string;

  @property({
    type: 'string',
  })
  cellphone?: string;

  @property({
    type: 'string',
  })
  cpf?: string;

  constructor(data?: Partial<Favorite>) {
    super(data);
  }
}
