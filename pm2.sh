#!/bin/bash
sleep 10
source /etc/profile.d/webapp.sh
export DB_ADDRESS_NEW=${DB_ADDRESS}
export AWS_BUCKET_NAME_NEW=${AWS_BUCKET_NAME}
export AWS_BUCKET_REGION_NEW=${AWS_BUCKET_REGION}
export DB_NAME_NEW=${DB_NAME}
export DB_PASSWORD_NEW=${DB_PASSWORD}
export DB_USER_NAME_NEW=${DB_USER_NAME}

sudo npm start /home/ec2-user/webservice/server.js