const {CONNECTION_STRING, SSL_CERTIFICATE, DB_NAME, COLLECTION_NAME} = require('./config');
const MongoClient = require('mongodb').MongoClient;

let client = null; // This will persist DB connectionn if Lambda container still "warm" on invocation, see: https://docs.aws.amazon.com/lambda/latest/dg/running-lambda-code.html

exports.handler = async (event, context) => {
    let data = {};

    // Lambda Proxy Integration
    if (event && event.body) {
        try {
            data = JSON.parse(event.body);
        } catch(e) { 
            
        }
    }

    try {
        // Initialize Mongo Client if necessary            
        if ( (client && !client.isConnected()) || (client === null) ) {
            client = await MongoClient.connect(
                CONNECTION_STRING, 
            {
                useNewUrlParser: true,
                ssl: true, sslCA: SSL_CERTIFICATE 
            });
        }

        // Config Mongo Client
        const db = client.db(DB_NAME); // which DB
        const collection = db.collection(COLLECTION_NAME); // Which "collection"/table     
            
        // Write to DB
        const dbWrite = await collection.insert(data);

        // Return structure
        // 1) Must have statusCode
        // 2) Body must be JSON.stringified
        const response = {
            statusCode: 200,
            body: JSON.stringify({message: 'Write successful', data, dbWrite})
        };
        
        return response;

    } catch(e) {
        // Report errors related with connection, auth, DB write, etc
        return {
          statusCode: 409,
          body: JSON.stringify({message: 'There was some type of catastrophic error', error:e})
      }
   }
};