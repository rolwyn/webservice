#!/bin/sh
# sleep 10
source /etc/profile.d/webenv.sh
cd ~/webservice
sudo npm run start /home/ec2-user/webservice/server.js
# export DB_ADDRESS_NEW=${DB_ADDRESS}
# export AWS_BUCKET_NAME_NEW=${AWS_BUCKET_NAME}
# export AWS_BUCKET_REGION_NEW=${AWS_BUCKET_REGION}
# export DB_NAME_NEW=${DB_NAME}
# export DB_PASSWORD_NEW=${DB_PASSWORD}
# export DB_USER_NAME_NEW=${DB_USER_NAME}