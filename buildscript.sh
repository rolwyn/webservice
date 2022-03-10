#!/bin/sh

echo "Assignment 4"

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
cd ~/webservice
sudo npm install pm2@latest -g
sudo chmod -R 777 /home/ec2-user/.pm2
sudo pm2 start server.js
sudo pm2 startup systemd
sudo pm2 save