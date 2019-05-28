import {DefaultCrudRepository, HasManyRepositoryFactory, repository} from '@loopback/repository';
import {User, Transaction} from '../models';
import {DbDataSource} from '../datasources';
import {inject, Getter} from '@loopback/core';
import { TransactionRepository } from './transaction.repository';


export class UserRepository extends DefaultCrudRepository<
  User,
  typeof User.prototype.id
> {
  public readonly transactionsDone: HasManyRepositoryFactory<Transaction, typeof Transaction.prototype.id>;
  public readonly transactionsReceived: HasManyRepositoryFactory<Transaction, typeof Transaction.prototype.id>;
  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('TransactionRepository') getTransactionRepository: Getter<TransactionRepository>
  ) {
    super(User, dataSource);
    this.transactionsDone = this.createHasManyRepositoryFactoryFor('transactionsDone', getTransactionRepository)
    this.transactionsReceived = this.createHasManyRepositoryFactoryFor('transactionsReceived', getTransactionRepository)
  }
}
