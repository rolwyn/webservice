#!/bin/bash
sleep 10
source /etc/profile.d/webapp.sh
export DB_ADDRESS=${RDSDBInstance.Endpoint.Address}
export AWS_BUCKET_NAME=${S3BuckeEncrypted}
export AWS_BUCKET_REGION=${AWS::Region}
export DB_NAME=${DBName}
export DB_PASSWORD=${MasterDBPassword}
export DB_USER_NAME=${MasterDBUsername}

sudo npm start /home/ec2-user/webservice/server.js