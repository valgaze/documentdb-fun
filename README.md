# AWS Lambda starter for DocumentDB

Starter Lambda function to connect to a DocumentDB cluster (note that for ease-of-use, node_modules/dependencies are checked-in with this repo) 

The Lambda function specified in ```index.js``` is a bare-minimum function for efficiently interacting with a DocumentDB cluster.

See **[here](https://www.youtube.com/playlist?list=PLNBEvJ82PZGxW9vzva5H7OsepryYlUT6D)** for some helper video content

See **[here](./blog_post.md)**  or **[https://dev.to/valgaze/from-zero-to-aws-documentdb-9on](https://dev.to/valgaze/from-zero-to-aws-documentdb-9on)** for a full write up


## Usage

1) Modify ```CONNECTION_STRING``` in ```config.js``` with your DocumentDB cluster's URL & username/password

2) Create a zip file of the contents of this folder (ie it should unzip to the contents not the folder itself) If [npm](https://www.npmjs.com/) is available on your machine you can run ```$ npm run zip_me``` which will create a file function.zip

3) In your Lambda function, under **Code entry type** select *Upload a .zip file*, click upload and then click SAVE in top right corner

(Alternatively, you can immediately upload the ```function.zip``` bundle in this repo and modify ```config.js``` from the in-browser Lambda editor)


## DocumentDB + Lambda + API Gateway Steps

- Create IAM role for Lamba to modify its VPC, *[AWSLambdaVPCAccessExecutionRole](https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html)*

- Setup a Lamba function

- Setup API Gateway Endpoint that triggers Lambda Function

- Setup DocumentDB

- Modify lambda permissions to match DocumentDB (set correct VPC, Subnets, Security Group) + config (increase timeout to 4 minutes)


## Teardown/Delete

DocumentDB is not free-- be sure to tear down if just experimenting!

- Go to DocumentDB > Select the cluster > Select "Modify"

- Uncheck *"Enable deletion protection"*

- Select Instances on the left panel and delete the instances one by one


## Further Reading

For explanation behind Lambda optimizations in ```index.js``` (ex. caching connection and ```callbackWaitsForEmptyEventLoop```) see the following:

- https://docs.aws.amazon.com/lambda/latest/dg/running-lambda-code.html

- https://blog.cloudboost.io/i-wish-i-knew-how-to-use-mongodb-connection-in-aws-lambda-f91cd2694ae5

- https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/

- https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs


```
context.callbackWaitsForEmptyEventLoop = false;
```

callbackWaitsForEmptyEventLoop is useful with older Node runtimes-- when disabled, this allows Lambda "return its result to the caller without requiring that the MongoDB database connection be closed" 
