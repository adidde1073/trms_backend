import AWS from 'aws-sdk';
import dotenv from 'dotenv';

dotenv.config({});

AWS.config.update({ region: 'us-west-2' });

const ddb = new AWS.DynamoDB({ apiVersion: 'latest' });

const TableName = 'trms';

(async () => {
  try {
    const response = await ddb.deleteTable({ TableName }).promise();

    console.log(response);
  } catch(error) {
    console.log('Failed to delete table: ', error);
  }
})();
