# Assignment 10

```Name: Rolwyn Quadras, NUID - 001554737, Email - quadras.r@northeastern.edu```

# Steps for running application locally.

1. Clone the Organization Repo using ```git clone``` command followed by the SSH link
   using the terminal

    Example: ```git@github.com:spring2022-csye6225/webservice.git```

2. In the terminal run the ```npm install``` command
3. After all the dependencies are installed, do ```npm run dev``` to run the
   application in a development environment. Use ```npm run start``` in production
4. Use curl or send request using REST Client extension of VS code to run APIs
5. The server.js file is the entry file of the application

# Steps for testing application locally

1. Run ```npm install``` to install all dependencies
2. In terminal use the ```npm run test``` command to run tests using Jest
3. All test files are located inside test folder

# Steps for running CI Script

1. The CI script is located in ```.github/workflows/ci.yml``` file
2. Pushing the code to forked remote branch will trigger a workflow. Use the 
   ```Actions``` tab to check running workflow
3. A pull request to Upstream branch will also trigger a workflow


# Packer

Packer init command to install plugins

```packer init application-ami.pkr.hcl```

Packer validate command
```packer validate -var-file="variables.pkrvars.hcl" application-ami.pkr.hcl```

Packer build command 

```packer build -var-file="variables.pkrvars.hcl" application-ami.pkr.hcl```

Delete AMI and Snapshot
1. aws ec2 deregister-image --image-id ```<YOUR-IMAGE-ID>```
2. aws ec2 delete-snapshot --snapshot-id ```<YOUR-SNAPSHOT-ID>```

## RDS is secured with SSL