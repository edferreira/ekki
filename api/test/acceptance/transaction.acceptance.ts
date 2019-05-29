import {Client, expect} from '@loopback/testlab';
import {EkkiApplication} from '../..';
import {setupApplication, givenEmptyDatabase} from './test-helper';
import {Transaction} from '../../src/models';
import {UserRepository, TransactionRepository} from '../../src/repositories';
import {testdb} from '../fixtures/datasources/testdb.datasource';

describe('UserController', () => {
  let app: EkkiApplication;
  let client: Client;
  let transactionRepository: TransactionRepository;
  let userRepository: UserRepository;

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
    userRepository = new UserRepository(
      testdb,
      async () => transactionRepository,
    );
  });

  beforeEach('cleanDatabase', async () => {
    console.log('clean database');
    await givenEmptyDatabase();
  });

  after(async () => {
    await app.stop();
  });

  describe('POST /transactions', () => {
    beforeEach('setUp', async () => {
      const baseUser = {
        name: 'user 1',
        cpf: '0',
        cellphone: '0',
        amount: 1000,
        limit: 500,
      };
      await userRepository.create({
        id: '1',
        ...baseUser,
      });

      await userRepository.create({
        id: '2',
        ...baseUser,
      });
    });

    it('invalid amount', async () => {
      const transactionData = new Transaction({
        from: '1',
        to: '2',
        amount: -200,
      });
      const res = await client
        .post('/transactions')
        .set('Accept', 'application/json')
        .send(transactionData)
        .expect(400);

      expect(res.body).to.have.property('error');
      expect(res.body.error.message).eql('Invalid transaction');
    });

    // it('not enough limit when use limit not set', async () => {
    //   const transactionData = new Transaction({from: '1', to: '2', amount: 1600, useLimit: false})
    //   expect(await TransactionService.doTransaction(
    //     transactionData,
    //     transactionRepository,
    //     userRepository
    //   )).to.throw(new HttpErrors.BadGateway('Limit is not enough'))

    // console.log(res)
    // expect(res).to.have.property('error');
    // expect(res).eql('Limit is not enough');
    // })

    //   it('not enough limit when use limit set to true', async () => {
    //     const transactionData = new Transaction({from: '1', to: '2', amount: 1600, useLimit: true})
    //     const res = await client
    //       .post('/transactions')
    //       .set('Accept', 'application/json')
    //       .send(transactionData)
    //       .expect(400)

    //     expect(res.body).to.have.property('error');
    //     expect(res.body.error.message).eql('Limit is not enough');
    //   })

    //   it('limit has to be used', async () => {
    //     const transactionData = new Transaction({from: '1', to: '2', amount: 1200, useLimit: false})
    //     const res = await client
    //       .post('/transactions')
    //       .set('Accept', 'application/json')
    //       .send(transactionData)
    //       .expect(400)

    //     expect(res.body).to.have.property('error');
    //     expect(res.body.error.message).eql('Need to use limit');
    //   })

    //   it('success using only current amount', async () => {
    //     console.log(await userRepository.findById('1'))
    //     const transactionData = new Transaction({from: '1', to: '2', amount: 900, useLimit: false})
    //     await client
    //       .post('/transactions')
    //       .set('Accept', 'application/json')
    //       .send(transactionData)
    //       .expect(204)
    //   })

    //   it('success using current amount and limit', async () => {
    //     const transactionData = new Transaction({from: '1', to: '2', amount: 1200, useLimit: true})
    //     await client
    //       .post('/transactions')
    //       .set('Accept', 'application/json')
    //       .send(transactionData)
    //       .expect(204)
    //   })
  });
});
