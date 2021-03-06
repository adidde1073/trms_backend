import dotenv from 'dotenv';
import User from '../models/user';
import userDAO from '../repositories/userRepository';

dotenv.config({});

async function populateTable() {
  await userDAO.putUser(
    new User(
      'adidde',
      'pass',
      '1 Finite Loop',
      '8087772424',
      'BenCo',
      0,
    ),
  );

  await userDAO.putUser(
    new User(
      'charles',
      'pass',
      '1 Finite Loop',
      '8007771234',
      'DepHead',
      0,
    ),
  );
  await userDAO.putUser(
    new User(
      'sam',
      'pass',
      '1 Finite Loop',
      '8007776789',
      'DirSupervisor',
      0,
    ),
  );
  await userDAO.putUser(
    new User(
      'ted',
      'pass',
      '1 Finite Loop',
      '8007776789',
      'Employee',
      1000,
    ),
  );
}

(async () => {
  try {
    await populateTable();
  } catch(error) {
    console.log('Failed to populate table: ', error);
  }
})();
