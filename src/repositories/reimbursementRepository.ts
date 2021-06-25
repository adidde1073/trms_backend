/* eslint-disable prefer-destructuring */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import Reimbursement from '../models/reimbursement';
import dynamo from '../dynamo/dynamo';

export class ReimbursementDAO {
  private client: DocumentClient;

  constructor() {
    this.client = dynamo;
  }

  async getAll(): Promise<Reimbursement[]> {
    console.log('Getting reimbursements');
    const params: DocumentClient.ScanInput = {
      TableName: 'trms-reims',
      ProjectionExpression: '#i, #u, #d, #l, #dsc, #c, #a, #rcat, #r, #g, #m',
      ExpressionAttributeNames: {
        '#i': 'id',
        '#u': 'username',
        '#d': 'date',
        '#l': 'location',
        '#dsc': 'description',
        '#c': 'cost',
        '#a': 'amount',
        '#rcat': 'reimbursementCategory',
        '#r': 'rStat',
        '#g': 'grade',
        '#m': 'message',
      },
    };

    const data = await this.client.scan(params).promise();

    if(data.Items) {
      return data.Items as Reimbursement[];
    }

    console.log('No reimbursements at this time.');
    return [];
  }

  async getReimbursementsByUsername(username: string): Promise<Reimbursement[]> {
    const params: DocumentClient.ScanInput = {
      TableName: 'trms-reims',
      FilterExpression: '#u = :u',
      ExpressionAttributeValues: {
        ':u': username,
      },
      ExpressionAttributeNames: {
        '#u': 'username',
      },
    };

    const data = await this.client.scan(params).promise();

    if(data.Items) {
      return data.Items as Reimbursement[];
    }
    console.log('User has no reimbursements');
    return [];
  }

  async getReimbursementById(id: string): Promise<Reimbursement> {
    const params: DocumentClient.ScanInput = {
      TableName: 'trms-reims',
      FilterExpression: '#id = :id',
      ExpressionAttributeValues: {
        ':id': id,
      },
      ExpressionAttributeNames: {
        '#id': 'id',
      },
    };

    const data = await this.client.scan(params).promise();
    console.log(data);
    if(!data.Items || data.Count === 0) {
      // No User found with this username
      console.log('Could not find reimbursement.');
      throw new Error('could not find reimbursement');
    }

    return data.Items[0] as Reimbursement;
  }

  async putReimbursement(reimbursement: Reimbursement): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'trms-reims',
      Item: reimbursement,
      ReturnConsumedCapacity: 'TOTAL',
      ConditionExpression: 'id <> :id',
      ExpressionAttributeValues: {
        ':id': reimbursement.id,
      },
    };

    try {
      const result = await this.client.put(params).promise();

      log.debug(result);
      return true;
    } catch(error) {
      return false;
    }
  }

  async updateReimbursement(reimbursement: Reimbursement): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'trms-reims',
      Item: reimbursement,
      ReturnConsumedCapacity: 'TOTAL',
      ConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': reimbursement.id,
      },
    };
    try {
      const result = await this.client.put(params).promise();

      log.debug(result);
      return true;
    } catch(error) {
      log.error(error);
      return false;
    }
  }

  async deleteReimbursement(inputId: string): Promise<boolean> {
    // console.log('this is id in DAO', inputId);
    const params: DocumentClient.DeleteItemInput = {
      TableName: 'trms-reims',
      Key: {
        id: inputId,
      },
    };

    try {
      console.log('attempting to delete reimbursement');
      const deleted = await this.client.delete(params).promise();
      console.log(deleted);
      console.log('deleted!');
      return true;
    } catch(error) {
      console.log('Failed to delete Reimbursement: ', error);
      return false;
    }
  }
}

const reimbursementDAO = new ReimbursementDAO();

export default reimbursementDAO;
