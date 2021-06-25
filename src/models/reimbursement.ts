import { v4 as uuidv4 } from 'uuid';

export default class Reimbursement {
  constructor(
    public username: string,
    public date: string,
    public location: string,
    public description: string,
    public cost: number,
    public amount: number,
    public reimbursementCategory: Category,
    public rStat: rStat,
    public grade: string,
    public message: string,
    public id: string = uuidv4(),
  ) {}
}

export type Category = 'University Course' | 'Seminar' | 'Certification Preparation Class' | 'Certification' | 'Technical Training' | 'Other';
export type rStat = 'initiated' | 'approved by DirSupervisor' | 'approved by DepHead' | 'Approved!' | 'rejected';
