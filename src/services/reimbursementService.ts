/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
import log from '../log';
import Reimbursement, { rStat } from '../models/reimbursement';
import reimbursementDAO, { ReimbursementDAO } from '../repositories/reimbursementRepository';

class ReimbursementService {
  private dao: ReimbursementDAO;

  constructor() {
    this.dao = reimbursementDAO;
  }

  getUserReimbursements(username: string): Promise<Reimbursement[]> {
    return this.dao.getReimbursementsByUsername(username);
  }

  getAll(): Promise<Reimbursement[]> {
    try {
      return this.dao.getAll();
    } catch(error) {
      log.error(error);
      throw new Error('Could not get reimgursements');
    }
  }

  updateReimbursement(reimbursement: Reimbursement, newStatus: rStat, amount?: number, message?: string): Promise<boolean> {
    if(this.dao.getReimbursementById(reimbursement.id)) {
      reimbursement.rStat = newStatus;
      if(amount && amount !== 1001) {
        reimbursement.amount = amount;
      }
      if(message) {
        reimbursement.message = message;
      }

      const success = this.dao.updateReimbursement(reimbursement);

      return success;
    }
    throw new Error('Could not find reimbursement');
  }

  getReimbursement(id: string): Promise<Reimbursement> {
    return this.dao.getReimbursementById(id);
  }

  addReimbursement(reimbursement: Reimbursement) {
    this.dao.putReimbursement(reimbursement);
  }

  public deleteReimbursement(id: string) {
    this.dao.getReimbursementById(id);
    this.dao.deleteReimbursement(id);
  }
}

const reimbursementService = new ReimbursementService();
export default reimbursementService;
