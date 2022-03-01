#!/bin/sh

# DEBIAN_FRONTEND="noninteractive"

echo "Assignment 4"

sudo yum -y update

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash

. ~/.nvm/nvm.sh

# Install node version
nvm install 14

sudo yum install postgresql12 postgresql12-server

sudo amazon-linux-extras | grep postgre

# get the required version
sudo tee /etc/yum.repos.d/pgdg.repo<<EOF
[pgdg12]
name=PostgreSQL 12 for RHEL/CentOS 7 - x86_64
baseurl=https://download.postgresql.org/pub/repos/yum/12/redhat/rhel-7-x86_64
enabled=1
gpgcheck=0
EOF

# install version 12
sudo yum install -y postgresql12 postgresql12-server

sudo ps- ef | grep postgres

sudo rm -rf /var/lib/pgsql/12

# init db
sudo /usr/pgsql-12/bin/postgresql-12-setup initdb

# enable and start service with --now
sudo systemctl enable --now postgresql-12
# sudo systemctl start postgresql-12.service

sudo cd /home/ec2-user
# sudo -u postgres psql
sudo su - postgres

# sudo passwd postgres

# su - postgres

# createdb testdb

# psql -c "ALTER USER postgres WITH PASSWORD 'rolwyn12345';"

# sudo systemctl status postgresql-12

# sudo cd ~/webservice

# sudo -u postgres psql -d testdb
# # ALTER USER user_name WITH PASSWORD 'new_password';
# psql -c "ALTER USER postgres PASSWORD 'rolwyn12345';"

# sudo -u postgres -i
# sudo psql -c "ALTER USER postgres PASSWORD 'rolwyn12345';"

# sudo service postgresql restart
# sudo systemctl restart postgresql-12
# sudo service postgresql start

# sudo psql -c "CREATE DATABASE testdb;"
# sudo psql -c "CREATE DATABASE testdb';"
# sudo -u postgres psql -d testdb


# sudo -u postgres psql db_name




# sudo unzip webservice.zip
# sudo yum install -y unzip
# sudo which unzip
# sudo mkdir src
# pwd ./src
# sudo cp webservice.zip ./src/
# sudo cd ~/
# sudo unzip webservice.zip
# sudo cd webservice
# ls -a
