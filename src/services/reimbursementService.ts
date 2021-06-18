/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable new-cap */
/* eslint-disable @typescript-eslint/no-unused-vars */
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
    return this.dao.getAll();
  }

  updateReimbursement(reimbursement: Reimbursement, newStatus: rStat, amount: number): Promise<boolean> {
    if(this.dao.getReimbursementById(reimbursement.id)) {
      reimbursement.rStat = newStatus;
      if(amount !== 0) {
        reimbursement.amount = amount;
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
    this.dao.deleteReimbursement(id);
  }
}

const reimbursementService = new ReimbursementService();
export default reimbursementService;
