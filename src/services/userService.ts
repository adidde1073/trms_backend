/* eslint-disable no-param-reassign */
/* eslint-disable consistent-return */
import User from '../models/user';
import userDAO, { UserDAO } from '../repositories/userRepository';
import log from '../log';

class UserService {
  private dao: UserDAO;

  constructor() {
    this.dao = userDAO;
  }

  async login(username: string, password: string): Promise<User | undefined> {
    try {
      const found = await this.dao.getByUsername(username);

      if(found) {
        if(found.password !== password) {
          throw new Error('Password is incorrect');
        }
        return found;
      }
      throw new Error('Usernmae does not exist');
    } catch(error) {
      log.error(error);
    }
    return undefined;
  }

  getUser(username:string): Promise<User> {
    return this.dao.getByUsername(username);
  }

  updateUser(user: User, newBalance: number): Promise<boolean> {
    if(this.dao.getById(user.id)) {
      user.balance = newBalance;

      const success = this.dao.updateUser(user);

      return success;
    }
    throw new Error('Could not find user');
  }

  getUserBalance(user: User): number {
    if(this.dao.getById(user.id)) {
      console.log('Loading balance from DAO ', user.balance);
      return user.balance;
    }
    throw new Error('Could not find user');
  }
}

export default new UserService();
