#!/bin/bash

echo "Assignment 5"

# Update packages
sudo yum -y update

# giving permission because of permission errors
sudo amazon-linux-extras install postgresql10
sudo chmod 755 /home/ec2-user

# change password for postgres user
# sudo -u postgres psql -c "ALTER USER postgres with PASSWORD 'rolwyn12345';"

# install nodejs
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

# install pm2 process management
sleep 5
cd ~/webservice
sudo npm install pm2@latest -g
# sudo chmod -R 777 /home/ec2-user/.pm2
sudo pm2 startup systemd --service-name webservice
sudo pm2 start server.js
sudo pm2 save

# codedeploy steps
sudo yum install ruby -y
sudo yum install wget -y

# clear any existing caching, clean ami
CODEDEPLOY_BIN="/opt/codedeploy-agent/bin/codedeploy-agent"
$CODEDEPLOY_BIN stop
sudo yum erase codedeploy-agent -y

# installation of codedeploy
cd /home/ec2-user
wget https://aws-codedeploy-$CURRENTREGION.s3.$CURRENTREGION.amazonaws.com/latest/install
chmod +x ./install
# install latest agent
sudo ./install auto
# sudo service codedeploy-agent start
sudo service codedeploy-agent status


