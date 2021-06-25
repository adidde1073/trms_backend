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
      TableName: 'trms-user',
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

  async getByUsername(username: string): Promise<User> {
    const params: DocumentClient.ScanInput = {
      TableName: 'trms-users',
      FilterExpression: '#u = :u',
      ExpressionAttributeValues: {
        ':u': username,
      },
      ExpressionAttributeNames: {
        '#u': 'username',
      },
    };

    const data = await this.client.scan(params).promise();
    if(!data.Items) {
      console.log('Cannot find user');
      throw new Error('it is high time we go to bed.');
    }
    return data.Items[0] as User;
  }

  async putUser(user: User): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'trms-users',
      Item: user,
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

  async updateUser(user: User): Promise<boolean> {
    const params: DocumentClient.PutItemInput = {
      TableName: 'trms-users',
      Item: user,
      ReturnConsumedCapacity: 'TOTAL',
      ConditionExpression: 'id = :id',
      ExpressionAttributeValues: {
        ':id': user.id,
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

  async deleteUser(id: string): Promise<boolean> {
    const params: DocumentClient.GetItemInput = {
      TableName: 'trms-users',
      Key: {
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
