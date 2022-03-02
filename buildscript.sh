#!/bin/sh

# DEBIAN_FRONTEND="noninteractive"

echo "Assignment 4"

sudo yum -y update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

# Install node version
nvm install node
# nvm use 16
node --version


# sudo yum install postgresql12 postgresql12-server

# sudo amazon-linux-extras | grep postgre

# # get the required version
# sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
# [pgdg12]
# name=PostgreSQL 12 for RHEL/CentOS 7 - x86_64
# baseurl=https://download.postgresql.org/pub/repos/yum/12/redhat/rhel-7-x86_64
# enabled=1
# gpgcheck=0
# EOF

# # install version 12
# sudo yum install -y postgresql12 postgresql12-server

# # init db
# sudo /usr/pgsql-12/bin/postgresql-12-setup initdb

# # enables and start service with --now
# sudo systemctl enable --now postgresql-12

# systemctl status postgresql-12

# cd ~/webservice

# sudo -u postgres psql testdb
# psql -c "ALTER USER postgres PASSWORD 'rolwyn12345';"

# sudo chmod 777 /home/ec2-user
# sudo -u postgres psql
# sudo -u postgres bash -c "psql -c \"ALTER USER postgres with PASSWORD 'rolwyn12345';\""
# sudo -u postgres bash -c "psql -c \"CREATE DATABASE testdb;\""
# sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'rolwyn12345';"
# sudo -u postgres psql -c "CREATE DATABASE testdb;"

# sudo sed -i -e '1ilisten_addresses = '*'\' /var/lib/pgsql/12/data/postgresql.conf
# sudo sed -i -e '1ihost  all  all 0.0.0.0/0 md5\' /var/lib/pgsql/12/data/postgresql.conf

# sudo systemctl restart postgresql-12
# systemctl status postgresql-12

# sudo su - postgres
# sudo -u postgres psql
# sudo -u postgres psql
# sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'rolwyn12345';"
# sudo -u postgres psql -c "CREATE DATABASE testdb;"
# sudo -u postgres psql -c "DROP TABLE IF EXISTS users;"

# npm


sudo amazon-linux-extras install epel

sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
[pgdg13]
name=PostgreSQL 13 for RHEL/CentOS 7 - x86_64
baseurl=http://download.postgresql.org/pub/repos/yum/13/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0
EOF

sudo yum install postgresql13 postgresql13-server -y

sudo /usr/pgsql-13/bin/postgresql-13-setup initdb

sudo systemctl enable --now postgresql-13

systemctl status postgresql-13

# chmod -R 755 ./webservice
sudo chmod -R 755 /home/ec2-user

sudo -u postgres bash -c "psql -c \"ALTER USER postgres with PASSWORD 'rolwyn12345';\""

sudo yum install -y gcc gcc-c++ make openssl-devel git

sudo yum install -y nodejs
# cd ~
# sudo rm -f webservice/package-lock.json
npm install pm2@latest -g
pm2 update
sudo chmod -R 755 ./webservice
# cd ./webservice
sudo pm2 start ./webservice/server.js --cron
sudo pm2 startup
sudo pm2 save

# pm2 startup systemd
# pm2 save
# pm2 list

