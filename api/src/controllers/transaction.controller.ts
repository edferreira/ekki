import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getWhereSchemaFor,
  patch,
  del,
  requestBody,
  HttpErrors,
} from '@loopback/rest';
import {Transaction} from '../models';
import {TransactionRepository, UserRepository} from '../repositories';

export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository : TransactionRepository,
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @post('/transactions', {
    responses: {
      '200': {
        description: 'Transaction model instance',
        content: {'application/json': {schema: {'x-ts-type': Transaction}}},
      },
    },
  })
  async create(@requestBody() transaction: Transaction): Promise<Transaction> {
    // TODO: lock user writes in here
    let fromUser = await this.userRepository.findById(transaction.from)
    if(fromUser.canDoTransaction(transaction.amount)) {
      this.userRepository.updateById(
        fromUser.id, {amount: fromUser.amount - transaction.amount}
      )

      let toUser = await this.userRepository.findById(transaction.to)
      this.userRepository.updateById(
        toUser.id, {amount: toUser.amount + transaction.amount}
      )

      return await this.transactionRepository.create(transaction);
    }
    else
      throw new HttpErrors.BadRequest('user has not enought limit')
  }

  @get('/transactions/count', {
    responses: {
      '200': {
        description: 'Transaction model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where,
  ): Promise<Count> {
    return await this.transactionRepository.count(where);
  }

  @get('/transactions', {
    responses: {
      '200': {
        description: 'Array of Transaction model instances',
        content: {
          'application/json': {
            schema: {type: 'array', items: {'x-ts-type': Transaction}},
          },
        },
      },
    },
  })
  async find(
    @param.query.object('filter', getFilterSchemaFor(Transaction)) filter?: Filter,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find(filter);
  }

  @patch('/transactions', {
    responses: {
      '200': {
        description: 'Transaction PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody() transaction: Transaction,
    @param.query.object('where', getWhereSchemaFor(Transaction)) where?: Where,
  ): Promise<Count> {
    return await this.transactionRepository.updateAll(transaction, where);
  }

  @get('/transactions/{id}', {
    responses: {
      '200': {
        description: 'Transaction model instance',
        content: {'application/json': {schema: {'x-ts-type': Transaction}}},
      },
    },
  })
  async findById(@param.path.string('id') id: string): Promise<Transaction> {
    return await this.transactionRepository.findById(id);
  }

  @patch('/transactions/{id}', {
    responses: {
      '204': {
        description: 'Transaction PATCH success',
      },
    },
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody() transaction: Transaction,
  ): Promise<void> {
    await this.transactionRepository.updateById(id, transaction);
  }

  @del('/transactions/{id}', {
    responses: {
      '204': {
        description: 'Transaction DELETE success',
      },
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.transactionRepository.deleteById(id);
  }
}
