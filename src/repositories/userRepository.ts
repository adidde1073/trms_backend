/* eslint-disable prefer-destructuring */
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import log from '../log';
import User from '../models/user';
import dynamo from '../dynamo/dynamo';

export class UserDAO {
  private client: DocumentClient;

  constructor() {
    this.client = dynamo;
  }

  async getAll(): Promise<User[]> {
    const params: DocumentClient.QueryInput = {
      TableName: 'Grubdash',
      KeyConditionExpression: 'category = :c',
      ExpressionAttributeValues: {
        ':c': 'User',
      },
      ExpressionAttributeNames: {
        '#r': 'role',
      },
      ProjectionExpression: 'id, username, password, address, phoneNumber, #r',
    };

    const data = await this.client.query(params).promise();

    return data.Items as User[];
  }

  async getById(id: string): Promise<User | null> {
    const params: DocumentClient.GetItemInput = {
      TableName: 'Grubdash',
      Key: {
        category: 'User',
        id,
      },
      ExpressionAttributeNames: {
        '#r': 'role',
      },
      ProjectionExpression: 'id, username, password, address, phoneNumber, #r',
    };

    const data = await this.client.get(params).promise();

    if(!data.Item) {
      // No User found with this id
      return null;
    }

    return data.Item as User;
  }

  async getByUsername(username: string): Promise<User | null> {
    const params: DocumentClient.QueryInput = {
      TableName: 'trms',
      IndexName: 'user-username',
      KeyConditionExpression: 'category = :c AND username = :u',
      ExpressionAttributeValues: {
        ':c': 'User',
        ':u': username,
      },
      ExpressionAttributeNames: {
        '#r': 'role',
      },
      ProjectionExpression: 'id, username, password, address, phoneNumber, #r',
    };

    const data = await this.client.query(params).promise();

    if(!data.Items || data.Count === 0) {
      // No User found with this username
      console.log('Could not find user with that username.');
      return null;
    }

    return data.Items[0] as User;
  }

  async putUser(user: User): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'trms',
      Item: {
        ...user,
        category: 'User',
      },
      ReturnConsumedCapacity: 'TOTAL',
      ConditionExpression: 'id <> :id',
      ExpressionAttributeValues: {
        ':id': user.id,
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

  async deleteUser(id: string): Promise<boolean> {
    const params: DocumentClient.GetItemInput = {
      TableName: 'trms',
      Key: {
        category: 'User',
        id,
      },
    };

    try {
      const result = await this.client.delete(params).promise();

      log.debug(result);
      return true;
    } catch(error) {
      return false;
    }
  }
}

const userDAO = new UserDAO();

export default userDAO;
