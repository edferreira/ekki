import {UserRepository, TransactionRepository} from '../repositories';
import {Transaction} from '../models';
import {HttpErrors} from '@loopback/rest';

export default class TransactionService {
  static async doTransaction(
    transaction: Transaction,
    transactionRepository: TransactionRepository,
    userRepository: UserRepository,
  ) {
    let fromUser = await userRepository.findById(transaction.from);
    if (fromUser.canDoTransaction(transaction.amount, transaction.useLimit)) {
      await userRepository.updateById(fromUser.id, {
        amount: fromUser.amount - transaction.amount,
      });

      let toUser = await userRepository.findById(transaction.to);
      await userRepository.updateById(toUser.id, {
        amount: toUser.amount + transaction.amount,
      });

      return await transactionRepository.create(transaction);
    } else {
      // check if user would be able to do transfer using limit
      if (
        !transaction.useLimit &&
        fromUser.canDoTransaction(transaction.amount, true)
      ) {
        throw new HttpErrors.BadRequest('Need to use limit');
      } else {
        throw new HttpErrors.BadRequest('Limit is not enough');
      }
    }
  }
}
