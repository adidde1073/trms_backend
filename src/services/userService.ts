/* eslint-disable consistent-return */
import User from '../models/user';
import userDAO, { UserDAO } from '../repositories/userRepository';

class UserService {
  private dao: UserDAO;

  constructor() {
    this.dao = userDAO;
  }

  async login(username: string, password: string): Promise<User> {
    const found = await this.dao.getByUsername(username);

    if(found) {
      if(found.password !== password) {
        throw new Error('Password is incorrect');
      }
      return found;
    }
    throw new Error('Usernmae does not exist');
  }

  // logout(): void {
  //   this.currentUser = undefined;
  // }
}

export default new UserService();
