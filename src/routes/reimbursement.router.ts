/* eslint-disable max-len */
import { Router } from 'express';
import Reimbursement from '../models/reimbursement';
import reimbursementService from '../services/reimbursementService';

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
  try {
    const {
      username, date, time, location, description, cost, eventType, amount, category, rstat,
    } = req.body;
    const reimbursement = new Reimbursement(username, date, time, location, description, cost, eventType, amount, category, rstat);
    reimbursementService.addReimbursement(reimbursement);
    res.status(201).send();
  } catch(error) {
    res.status(401).send();
    error.log(error);
  }
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
