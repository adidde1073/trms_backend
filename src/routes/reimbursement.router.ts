/* eslint-disable max-len */
import { Router } from 'express';
import Reimbursement from '../models/reimbursement';
import reimbursementService from '../services/reimbursementService';
import userService from '../services/userService';
import User from '../models/user';

const reimbursementRouter = Router();

reimbursementRouter.get('/', async (req, res) => {
  res.json(
    await reimbursementService.getAll(),
  );
});

reimbursementRouter.get('/:username', async (req, res) => {
  // TODO: Implement the GET reimbursements by ID endpoint
  console.log('Gettting reimbursement by username');

  const { username } = req.params;

  if(!req.session.isLoggedIn || !req.session.user) {
    throw new Error('You must be logged in to access this functionality');
  }
  res.json(
    await reimbursementService.getUserReimbursements(username),
  );
});

reimbursementRouter.post('/', async (req, res) => {
  // TODO: Implement the Create reimbursement endpoint
  if(req.session.isLoggedIn && req.session.user) {
    try {
      console.log('I made into the try catch');
      const employee: User = req.session.user;
      console.log(employee);
      const {
        location, description, cost, category,
      } = req.body;
      let amount = 0;
      let newBalance = 0;
      switch (category) { // assign value to amount based on category; this was tedious.
      case 'University Course':
        amount = employee.balance * 0.8;
        newBalance = employee.balance - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Seminar':
        amount = employee.balance * 0.6;
        newBalance = employee.balance - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Certification Preparation Class':
        amount = employee.balance * 0.75;
        employee.balance -= amount;
        break;
      case 'Certification':
        amount = employee.balance;
        newBalance = employee.balance - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Technical Training':
        amount = employee.balance * 0.9;
        newBalance = employee.balance - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Other':
        amount = employee.balance * 0.3;
        newBalance = employee.balance - amount;
        userService.updateUser(employee, newBalance);
        break;
      default:
        console.log('Not a valid category');
        break;
      }
      const reimbursement = new Reimbursement(employee.username, Date.now(), location, description, cost, amount, category, 'initiated');
      reimbursementService.addReimbursement(reimbursement);
      res.status(201).send();
    } catch(error) {
      res.status(401).send();
      error.log(error);
    }
  }
  console.log(req.session.isLoggedIn);
  console.log(req.session.user);
  console.log('You must be signed in and be an employee to submit a reimbursement form');
});

reimbursementRouter.put('/', async (req, res) => {
  // TODO: Implement the Update reimbursement endpoint
  const { id, rstat, amount } = req.body;

  try {
    const reimbursement = await reimbursementService.getReimbursement(id);
    req.session.isLoggedIn = true;

    // eslint-disable-next-line max-len
    reimbursementService.updateReimbursement(reimbursement, rstat, amount);

    res.status(200).send();
  } catch(error) {
    res.status(401).send();
    error.log(error);
  }
});

reimbursementRouter.delete('/:id', async (req, res) => {
  // Delete reimbursement by ID endpoint
  const { id } = req.body;

  try {
    req.session.isLoggedIn = true;

    // eslint-disable-next-line max-len
    reimbursementService.deleteReimbursement(id);

    res.status(200).send();
  } catch(error) {
    res.status(401).send();
    error.log(error);
  }
});

export default reimbursementRouter;
