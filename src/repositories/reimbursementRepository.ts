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
    const params: DocumentClient.QueryInput = {
      TableName: 'trms',
      KeyConditionExpression: 'category = :c',
      ExpressionAttributeValues: {
        ':c': 'Reimbursement',
      },

      ExpressionAttributeNames: {
        '#u': 'username',
        '#d': 'date',
        '#t': 'time',
        '#l': 'location',
        '#dsc': 'description',
        '#c': 'cost',
        '#et': 'eventType',
        '#a': 'amount',
        '#cat': 'category',
        '#r': 'rStat',
      },
      ProjectionExpression: '#u, #d, #t, #l, #dsc, #c, #et, #a, #cat, #r',
    };

    const data = await this.client.scan(params).promise();

    if(data.Items) {
      return data.Items as Reimbursement[];
    }

    console.log('No reimbursements at this time.');
    return [];
  }

  async getReimbursementsByUsername(username: string): Promise<Reimbursement[]> {
    const params: DocumentClient.QueryInput = {
      TableName: 'trms',
      IndexName: 'user-username',
      KeyConditionExpression: 'category = :c AND username = :u',
      ExpressionAttributeValues: {
        ':c': 'User',
        ':u': username,
      },
      ProjectionExpression: '#u, #d, #t, #l, #dsc, #c, #et, #a, #cat, #r',
      ExpressionAttributeNames: {
        '#u': 'username',
        '#d': 'date',
        '#t': 'time',
        '#l': 'location',
        '#dsc': 'description',
        '#c': 'cost',
        '#et': 'eventType',
        '#a': 'amount',
        '#cat': 'category',
        '#r': 'rStat',
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
    const params: DocumentClient.GetItemInput = {
      TableName: 'trms',
      Key: {
        category: 'Reimbursement',
        id,
      },
      ExpressionAttributeNames: {
        '#u': 'username',
        '#d': 'date',
        '#t': 'time',
        '#l': 'location',
        '#dsc': 'description',
        '#c': 'cost',
        '#et': 'eventType',
        '#a': 'amount',
        '#cat': 'category',
        '#r': 'rStat',
      },
      ProjectionExpression: '#u, #d, #t, #l, #dsc, #c, #et, #a, #cat, #r',
    };

    const data = await this.client.get(params).promise();

    if(data) {
      return data.Item as Reimbursement;
    }
    throw new Error('Could not find reimbursement.');
  }

  async putReimbursement(reimbursement: Reimbursement): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'trms',
      Item: {
        ...reimbursement,
        category: 'Reimbursement',
      },
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
      TableName: 'trms',
      Item: {
        ...reimbursement,
        category: 'Reimbursement',
      },
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

  async deleteReimbursement(id: string): Promise<boolean> {
    const params: DocumentClient.DeleteItemInput = {
      TableName: 'trms',
      Key: {
        category: 'Reimbursement',
        id,
      },
    };

    try {
      await this.client.delete(params).promise();

      return true;
    } catch(error) {
      console.log('Failed to delete Restaurant: ', error);
      return false;
    }
  }
}

const reimbursementDAO = new ReimbursementDAO();

export default reimbursementDAO;
