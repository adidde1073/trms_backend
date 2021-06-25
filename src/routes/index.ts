import express, { Router } from 'express';
// import path from 'path';
import userRouter from './user.router';
import reimbursementRouter from './reimbursement.router';
// import User from '../models/user';
import UserService from '../services/userService';
import log from '../log';

const baseRouter = Router();

baseRouter.post('/login', async (req: express.Request<unknown, unknown, { username: string, password: string }, unknown, {}>, res) => {
  const { username, password } = req.body;

  try {
    const current = await UserService.login(username, password);
    req.session.isLoggedIn = true;

    req.session.user = current;

    res.json(req.session.user);
    res.status(202).send();
  } catch(error) {
    res.status(401).send();
    log.error(error);
  }
});

export async function logout(req: express.Request, res: express.Response): Promise<void> {
  if(req.session.user) {
    const { username } = req.session.user;

    req.session.destroy(() => {
      console.log(`${username} logged out`);
    });
  }
  // If they aren't logged in, we don't need to do anything

  res.status(202).send();
}

baseRouter.post('/logout', logout);

baseRouter.use('/api/v1/users', userRouter);
baseRouter.use('/api/v1/reimbursements', reimbursementRouter);

export default baseRouter;
