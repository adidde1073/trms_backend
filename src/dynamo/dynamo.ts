import AWS from 'aws-sdk';

const dynamo = new AWS.DynamoDB.DocumentClient({
  region: 'us-west-2',
  endpoint: 'https://dynamodb.us-west-2.amazonaws.com',
  apiVersion: 'latest',
});

export default dynamo;
