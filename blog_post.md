## From Zero to AWS DocumentDB

In this note we'll go from zero to a DocumentDB Database with a public endpoint with which you will be able to write data (via API Gateway & a Lambda function)

We'll skip [Cloudformation](https://aws.amazon.com/cloudformation)/[Serverless](https://github.com/serverless/serverless) templates for now and get everything up and running "by hand" in about 10 minutes. (To later enshrine the tips in this note into source control, see [here](https://docs.aws.amazon.com/documentdb/latest/developerguide/quick-start-with-cloud-formation.html) for a starter CloudFormation template & also the [Components tool from Serverless](https://github.com/serverless/components))

The videos below are available as a playlist here: https://www.youtube.com/playlist?list=PLNBEvJ82PZGxW9vzva5H7OsepryYlUT6D

# Two handy things to do before proceeding

1) Get an API testing tool like [Postman](https://www.getpostman.com/) or [friends](https://www.producthunt.com/alternatives/postman)

2) Clone this git repository:

```
$ git clone https://github.com/valgaze/documentdb-fun 
```


[![vid](https://img.youtube.com/vi/vhSCvNt_2MA/0.jpg)](https://www.youtube.com/watch?v=vhSCvNt_2MA)


# "Amazon DocumentDB (with MongoDB compatibility)"

Released by AWS in January 2019, DocumentDB is a NoSQL document database overloaded with handy features running on Amazon's infra. It's straighforward to use and can function well for a variety of scenarios but can really shine as a "scalable" replacement for some poor overworked and manually-managed EC2 instance running MongoDB.

DocumentDB allows you to NOT worry very much about:

* Storage requirements below 64TB (automatically grows up to 64 in increments of 10GB on SSDs shared between all read instances)

* Provisioning/managing "clusters" (you can very quickly spin up/down a maximum of 15 'helper' instances)

* Patches and backups (backups can be configured up to last 5-minutes and data is replicatesd data 6 times across 3 Availability Zones)

* Encryption (Uses TSL)


It is important to make clear that DocumentDB is definitely not "cloud MongoDB"-- if you're looking for that, see [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

The docs state that DocumentDB *"[...] implements the Apache 2.0 open source MongoDB 3.6 API by emulating the responses that a MongoDB client expects from a MongoDB server, allowing you to use your existing MongoDB drivers and tools with Amazon DocumentDB."* In other words, after swapping in some login credentials, applications with MongoDB drivers targeting up to 3.6 should work with DocumentDB. If you're curious, there's some [reasonably-informed speculation](https://news.ycombinator.com/item?id=18870397) it [may be Postgres](https://www.enterprisedb.com/blog/documentdb-really-postgresql) under the hood.


As long as the AWS account you use has permissions to create IAM roles and access to the resources we'll be using (ie DocumentBD, Lambda, & API Gateway) you should be in good shape. Let's get to it!

# Step I: Set up Lambda role

This is a simple but essential task. DocumentDB has no publicly-exposed endpoints-- it lives in its own "VPC" (Virtual Private Cloud-- essentially its own networking segment/namespace) and accordingly a Lamba function must be able to access that same VPC in order to transact with the database cluster. But in order to make changes to its VPC, a Lambda function needs an IAM role which grants it permission (specifically **AWSLambdaVPCAccessExecutionRole**) to do so, which we'll create below: 


[![vid](https://img.youtube.com/vi/wpZPfX4HvjM/0.jpg)](https://www.youtube.com/watch?v=wpZPfX4HvjM)



**Tips:**

* AWSLambdaVPCAccessExecutionRole: *Permission to manage elastic network interfaces to connect your function to a VPC.*

# STEP II: Create a Lambda Function + API Gateway

Here we'll create a Lamba function called "mylambda" and configure/deploy an API Gateway endpoint and POST data to it which will invoke the Lambda function

[![vid](https://img.youtube.com/vi/vhSCvNt_2MA/0.jpg)](https://www.youtube.com/watch?v=vhSCvNt_2MA)


**Tips:**

**Lambda Function:**

- Create your lamba function using the IAM role *"lambda-vpc"* creatred previously (we'll need to switch the Lambda to the same VPC as our DocumentDB cluster)

**API Gateway:**

* Once you deploy your API, make sure you're posting to the correct with the correct resource-- if you see { message: "Missing Authentication Token" } as a response make sure you're in fact POST'ing to the correct URL


# STEP III: Create a DocumentDB cluster

Here we'll stand up the DocumentDB cluster and note its connection string:

[![vid](https://img.youtube.com/vi/xM01Fze0Mx8/0.jpg)](https://www.youtube.com/watch?v=xM01Fze0Mx8)


**Tips:**

**DocumentDB:**

- Note your database's username and password and the connection string, we'll need them in a moment

- You can stick with default configuration for now (you can up to 15 read replicas if you anticipate a crush of activity)

# STEP IV: Update Lambda function with new code + connection string

Option A (fastest): Just upload the file function.zip and change CONNECTION_STRING in config.js


[![vid](https://img.youtube.com/vi/_e_R2CqR3l8/0.jpg)](https://www.youtube.com/watch?v=_e_R2CqR3l8)


Option B (if [npm](https://www.npmjs.com) is available on your system): Modify  CONNECTION_STRING in config.js and create a new function.zip with

```
$ npm run zip_me
```

And then upload the function.zip file to replace your existing Lambda code

# STEP V: Config lambda

The last step we have is to configure Lambda's VPC, Subnet, Security Groups & Timeout-- since we created the *lamba-vpc* role, Lambda can make these modifications (without it, saving will [fail](https://stackoverflow.com/questions/55760149/aws-lambda-function-not-saving-on-vpc-selection/55780781#55780781))


[![vid](https://img.youtube.com/vi/R5wwa6zFhn4/0.jpg)](https://www.youtube.com/watch?v=R5wwa6zFhn4)


**Tips:**

* **VPC:** Find your DocumentDB cluster and scroll down until you find VPC Name (ID), that should be the VPC for Lambda

* **Subnets:** Same subnets as DocumentDB's VPC


## (Important) Shut it own

DocumentDB ain't free-- see video below for how to properly ensure the resources are cleaned up.

[![vid](https://img.youtube.com/vi/dve7wcB0eXM/0.jpg)](https://www.youtube.com/watch?v=dve7wcB0eXM)


If you're still standing you should now have a DocumentDB deployment with a working public endpoint that you can extend/simplify to your heart's content-- that should do it!

See here for repo: https://github.com/valgaze/documentdb-fun

See here for a playlist of the embedded videos: https://www.youtube.com/playlist?list=PLNBEvJ82PZGxW9vzva5H7OsepryYlUT6D


# Further Reading:

* https://docs.aws.amazon.com/documentdb/latest/developerguide/what-is.html#overview

* https://blog.webiny.com/connecting-to-aws-documentdb-from-a-lambda-function-2b666c9e4402

* https://medium.com/@michaelrbock/nosql-showdown-mongodb-atlas-vs-aws-documentdb-5dfb00317ca2

* https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs

* https://docs.aws.amazon.com/lambda/latest/dg/vpc-rds.html

# Further Reading -- Lambda + VPC

* https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html

* https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html

* https://docs.aws.amazon.com/lambda/latest/dg/vpc.html

* https://docs.aws.amazon.com/lambda/latest/dg/vpc-rds.html

* https://medium.com/@justanotherspyy/how-to-connect-your-lambda-function-securely-to-your-private-rds-instances-in-your-vpc-29789220a33

# Further Reading -- Lambda Optimizations:

* https://docs.aws.amazon.com/lambda/latest/dg/running-lambda-code.html

* https://www.mongodb.com/blog/post/optimizing-aws-lambda-performance-with-mongodb-atlas-and-nodejs

* https://docs.atlas.mongodb.com/best-practices-connecting-to-aws-lambda/

* https://blog.cloudboost.io/i-wish-i-knew-how-to-use-mongodb-connection-in-aws-lambda-f91cd2694ae5

# Further Reading -- Lamba Proxy Integration

* https://stackoverflow.com/questions/56188864/aws-lambda-clarification-on-retrieving-data-from-event-object/56191784#56191784

* https://stackoverflow.com/a/52240132/3191929