import { v4 as uuidv4 } from 'uuid';

export default class Reimbursement {
  constructor(
    public username: string,
    public date: number,
    public location: string,
    public description: string,
    public cost: number,
    public amount: number,
    public category: Category,
    public rStat: rStat,
    public id: string = uuidv4(),
  ) {}
}

export type Category = 'University Course' | 'Seminar' | 'Certification Preparation Class' | 'Certification' | 'Technical Training' | 'Other';
export type rStat = 'initiated' | 'approved by DirSupervisor' | 'approved by DepHead' | 'approved by BenCo';
