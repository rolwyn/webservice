#!/bin/sh

echo "Assignment 4"

# Update packages
sudo yum -y update

# installing postgresql
# sudo amazon-linux-extras install epel

# sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
# [pgdg13]
# name=PostgreSQL 13 for RHEL/CentOS 7 - x86_64
# baseurl=http://download.postgresql.org/pub/repos/yum/13/redhat/rhel-7-x86_64
# enabled=1
# gpgcheck=0
# EOF

# sudo yum install postgresql13 postgresql13-server -y

# sudo /usr/pgsql-13/bin/postgresql-13-setup initdb

# sudo systemctl enable --now postgresql-13

# systemctl status postgresql-13

# giving permission because of permission errors
sudo amazon-linux-extras install postgresql10
sudo chmod 755 /home/ec2-user

# change password for postgres user
# sudo -u postgres psql -c "ALTER USER postgres with PASSWORD 'rolwyn12345';"

# install nodejs
curl --silent --location https://rpm.nodesource.com/setup_14.x | sudo bash -
sudo yum install -y nodejs

sudo npm -v

# install pm2 process management
cd ~/webservice
sudo npm install pm2@latest -g
pm2 start pm2run.sh
pm2 startup systemd
pm2 save