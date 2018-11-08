# Serverless Fuck You 4KB

Allow you to inject every environements variables as you want.

# Note : 

I will make an example and fix my grammar soon

# Installation

On your Serverless Framework project

`npm install --save serverless-fuck-you-4kb`

# Setup

## Step 1 : Creating your own config folder

Create a folder like `./config` at the root of your SLS project.

Then, create a javascript file, something like `env.js`.

Now we have a folder and a js file at : `./config/env.js`

## Step 2 : Create an `.env` file

At the root of your project, create an `.env` file. 

You'll write all of your variables here!

## Step 3 : Migrate or create your environement variables

Note that you can't have other variable references inside, like `${self:....blablabla}`. 

But, you can compute them later with `serverless-fuck-you-4kb`. 

For example, you have a `s3_bucket_name` variable inside of your `provider.environement` part of your `serverless.yml` that is "computed" like this `s3_bucket_name: bucket-${self:provider.environment.application}`.

Another variable is computed with a string to create your variable. Just keep the `bucket` part and write into your `.env` file : `s3_bucket_name=bucket`.

## Step 4 : Writing your own importer

Back to `./config/env.js`, write this code : 

```javascript
module.exports = require("serverless-fuck-you-4kb")({
    // This is the map function with a key-value support
	map: (key, value) => {
        // key == s3_bucket_name from the .env file
        // value  == bucket from the .env file
        // process.env.application come from serverless.yml file at provider.environement
		return value + "-" + process.env.application;
	}
});
```

Your `.env` file look like this :

```javascript
s3_bucket_name=bucket
```

Your `serverless.yml` look like this :

```yaml

service: serverless-application

provider:
  name: aws
  runtime: nodejs6.10
  stage: ${opt:stage, 'prod'}
  region: us-east-1
  memorySize: 1536
  timeout: 300
  environment:
    region: ${self:provider.region}
    stage: ${self:provider.stage}
    application: ${self:service}-${self:provider.region}-${self:provider.stage}
    
# ... other properties like functions and resoures... 
```

## Step 5 : Inject environement variables inside of your functions

Inside of your function file, at the top of it, add : 

```javascript
const config = require("../config/env");
config.inject(); // this will inject your mapping 

console.log(process.env.s3_bucket_name); // bucket-serverless-application-us-east-1-dev
```

## Step 6 : Overcome

You're done.

# How can you get those variables to yml ?

Like this : 

```yaml
BucketName: ${file(./config/env.js):s3_bucket_name}
```

You're welcome.













