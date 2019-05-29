import {EkkiApplication} from '../..';
import {
  createRestAppClient,
  givenHttpServerConfig,
  Client,
} from '@loopback/testlab';
import {testdb} from '../fixtures/datasources/testdb.datasource';
import {UserRepository, TransactionRepository} from '../../src/repositories';

export async function setupApplication(): Promise<AppWithClient> {
  const app = new EkkiApplication({
    rest: givenHttpServerConfig(),
  });

  app.bind('datasources.config.db').to({
    name: 'test_db',
    host: 'localhost',
    connector: 'memory',
    file: './data/test_db',
  });

  await app.boot();
  await app.start();

  const client = createRestAppClient(app);

  return {app, client};
}

export async function givenEmptyDatabase() {
  let userRepository: UserRepository;
  let transactionRepository: TransactionRepository;

  userRepository = new UserRepository(
    testdb,
    async () => transactionRepository,
  );

  transactionRepository = new TransactionRepository(testdb);

  await userRepository.deleteAll();
  await transactionRepository.deleteAll();
}

export interface AppWithClient {
  app: EkkiApplication;
  client: Client;
}
