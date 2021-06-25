/* eslint-disable max-len */
import { Router } from 'express';
import Reimbursement, { rStat } from '../models/reimbursement';
import reimbursementService from '../services/reimbursementService';
import log from '../log';
import userService from '../services/userService';
import User from '../models/user';

const reimbursementRouter = Router();

reimbursementRouter.get('/', async (req, res) => {
  try {
    console.log('Getting reimbursements');
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

    if(!req.session.isLoggedIn || !req.session.user) {
      throw new Error('You must be logged in to access this functionality');
    }
    console.log('Current user: ', req.session.user.username);
    res.json(
      await reimbursementService.getUserReimbursements(req.session.user.username),
    );
    res.status(200).send();
  } catch(error) {
    log.error(error);
    res.status(500).send();
  }
});

reimbursementRouter.post('/', async (req, res) => {
  if(req.session.isLoggedIn && req.session.user && req.session.user.username) {
    try {
      const employee: User = req.session.user;
      const {
        location, description, cost, reimbursementCategory, grade,
      } = req.body;
      let amount = 0;
      let newBalance = 0;
      const d = new Date();
      switch (reimbursementCategory) { // assign value to amount based on category; this was tedious.
      case 'University Course':
        amount = cost * 0.8;
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
      const reimbursement = new Reimbursement(employee.username, `${d.getMonth()}/${d.getDay()}/${d.getFullYear()}`, location, description, cost, amount, reimbursementCategory, 'initiated', grade, '');
      reimbursementService.addReimbursement(reimbursement);
      res.status(201).send();
    } catch(error) {
      res.status(400).send();
      error.log(error);
    }
  }
});

reimbursementRouter.put('/', async (req, res) => {
  // TODO: Implement the Update reimbursement endpoint
  console.log('updating');
  const { id, amount } = req.body;
  const { user } = req.session;
  const reimbursement = await reimbursementService.getReimbursement(id);

  try {
    if(reimbursement !== null && user) {
    /*  const oldAmount = reimbursement.amount; */
      let newStatus: rStat = 'initiated';
      req.session.isLoggedIn = true;

      switch (user.role) {
      case 'DirSupervisor':
        newStatus = 'approved by DirSupervisor';
        break;
      case 'DepHead':
        newStatus = 'approved by DepHead';
        break;
      case 'BenCo':
        newStatus = 'Approved!';
        break;
      default:
        break;
      }
      /* const employee = userService.getUser(reimbursement.username);
      let balance = userService.getUserBalance(employee);
      balance = employee.balance - amount + oldAmount;
      userService.updateUser(employee, balance); */
      reimbursementService.updateReimbursement(reimbursement, newStatus, amount);
    }

    res.status(200).send();
  } catch(error) {
    res.status(401).send();
    error.log(error);
  }
});

reimbursementRouter.patch('/', async (req, res) => {
  // TODO: Implement the Update reimbursement endpoint
  console.log('rejecting');
  const { id } = req.body;
  const { user } = req.session;
  const reimbursement = await reimbursementService.getReimbursement(id);

  try {
    if(reimbursement !== null && user) {
      const newStatus: rStat = 'rejected';
      req.session.isLoggedIn = true;

      reimbursementService.updateReimbursement(reimbursement, newStatus);
    }

    res.status(200).send();
  } catch(error) {
    res.status(401).send();
    error.log(error);
  }
});

reimbursementRouter.delete('/:id', async (req, res) => {
  // Delete reimbursement by ID endpoint
  // eslint-disable-next-line prefer-destructuring
  const id = req.params.id.substring(1);
  console.log(typeof (id));
  console.log('This is id in router', id);

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
