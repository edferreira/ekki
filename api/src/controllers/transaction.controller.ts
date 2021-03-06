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
import TransactionService from '../services/transaction.service';

export class TransactionController {
  constructor(
    @repository(TransactionRepository)
    public transactionRepository: TransactionRepository,
    @repository(UserRepository)
    public userRepository: UserRepository,
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
    const twoMinutesbefore = new Date();
    twoMinutesbefore.setMinutes(twoMinutesbefore.getMinutes() - 2);

    if (!Transaction.valid(transaction))
      throw new HttpErrors.BadRequest('Invalid transaction');

    // const filter: Filter<Transaction> = new FilterBuilder()
    const filter = new Object({
      where: {
        from: {eq: transaction.from},
        to: {eq: transaction.to},
        amount: {eq: transaction.amount},
        when: {gte: twoMinutesbefore},
      },
      order: ['when DESC'],
    });

    const similarTransaction = await this.transactionRepository.findOne(filter);

    if (similarTransaction) {
      similarTransaction.canceled = true;
      await this.transactionRepository.update(similarTransaction);
      return await this.transactionRepository.create(transaction);
    } else {
      const new_transaction = TransactionService.doTransaction(
        transaction,
        this.transactionRepository,
        this.userRepository,
      );
      return new_transaction;
    }
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
    @param.query.object('filter', getFilterSchemaFor(Transaction))
    filter?: Filter,
  ): Promise<Transaction[]> {
    return await this.transactionRepository.find(new Object(filter));
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
    return await this.transactionRepository.updateAll(
      transaction,
      new Object(where),
    );
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
