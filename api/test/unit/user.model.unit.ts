import {User} from '../../src/models';
import {expect} from '@loopback/testlab';

describe('UserModel', () => {
  describe('User canDoTransaction()', () => {
    it('requested amount too high for user', async () => {
      const user = new User({limit: 500, amount: 1000});
      expect(user.canDoTransaction(1501, true)).to.be.false();
    });
    it('requested amount ok with limit', async () => {
      const user = new User({limit: 500, amount: 1000});
      expect(user.canDoTransaction(1499, true)).to.be.true();
    });
    it('requested amount ok', async () => {
      const user = new User({limit: 500, amount: 1000});
      expect(user.canDoTransaction(1000, true)).to.be.true();
    });
    it('requested amount ok in debt', async () => {
      const user = new User({limit: 500, amount: -200});
      expect(user.canDoTransaction(300, true)).to.be.true();
    });
    it('requested amount too hight without using limit', async () => {
      const user = new User({limit: 500, amount: 1000});
      expect(user.canDoTransaction(1001, false)).to.be.false();
    });
  });
});
