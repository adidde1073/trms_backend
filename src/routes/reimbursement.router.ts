/* eslint-disable max-len */
import { Router } from 'express';
import Reimbursement from '../models/reimbursement';
import reimbursementService from '../services/reimbursementService';
import log from '../log';
import userService from '../services/userService';
import User from '../models/user';

const reimbursementRouter = Router();

reimbursementRouter.get('/', async (req, res) => {
  try {
    res.json(
      await reimbursementService.getAll(),
    );
  } catch(error) {
    log.error(error);
    res.status(500).send();
  }
});

reimbursementRouter.get('/:username', async (req, res) => {
  // TODO: Implement the GET reimbursements by ID endpoint
  try {
    console.log('Gettting reimbursement by username');

    const { username } = req.params;

    if(!req.session.isLoggedIn || !req.session.user) {
      throw new Error('You must be logged in to access this functionality');
    }
    res.json(
      await reimbursementService.getUserReimbursements(username),
    );
    res.status(200).send();
  } catch(error) {
    log.error(error);
    res.status(500).send();
  }
});

reimbursementRouter.post('/', async (req, res) => { // modify to change amount - cost*coverage
  // TODO: Implement the Create reimbursement endpoint
  if(req.session.isLoggedIn && req.session.user) {
    try {
      const employee: User = req.session.user;
      const {
        location, description, cost, reimbursementCategory,
      } = req.body;
      let amount = 0;
      let newBalance = 0;
      switch (reimbursementCategory) { // assign value to amount based on category; this was tedious.
      case 'University Course':
        amount = userService.getUserBalance(employee) * 0.8;
        newBalance = userService.getUserBalance(employee) - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Seminar':
        amount = cost * 0.6;
        newBalance = userService.getUserBalance(employee) - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Certification Preparation Class':
        amount = cost * 0.75;
        newBalance = userService.getUserBalance(employee) - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Certification':
        amount = cost;
        newBalance = userService.getUserBalance(employee) - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Technical Training':
        amount = cost * 0.9;
        newBalance = userService.getUserBalance(employee) - amount;
        userService.updateUser(employee, newBalance);
        break;
      case 'Other':
        amount = cost * 0.3;
        newBalance = userService.getUserBalance(employee) - amount;
        userService.updateUser(employee, newBalance);
        break;
      default:
        console.log('Not a valid category');
        break;
      }
      console.log('Amount: ', amount);
      const reimbursement = new Reimbursement(employee.username, Date.now().toString(), location, description, cost, amount, reimbursementCategory, 'initiated');
      reimbursementService.addReimbursement(reimbursement);
      res.status(201).send();
    } catch(error) {
      res.status(400).send();
      error.log(error);
    }
  }
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
