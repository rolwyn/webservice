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

# init db
sudo /usr/pgsql-12/bin/postgresql-12-setup initdb

# enable and start service with --now
sudo systemctl enable --now postgresql-12

systemctl status postgresql-12

# cd ~/webservice

# sudo -u postgres psql testdb
# psql -c "ALTER USER postgres PASSWORD 'rolwyn12345';"

# echo "ALTER USER postgres PASSWORD 'rolwyn12345'" > rst_pass.sql

# sudo su -
# sudo chmod 755 /home/ec2-user
# sudo psql --command='create ROLE "ec2-user"'
# sudo su - postgres
# psql -c "ALTER USER postgres PASSWORD 'rolwyn12345';"
# # sudo -u postgres psql -d testdb
# # sudo -u postgres createdb testdb
# sudo -u postgres psql -d testdb
# psql -c "select * from testdb;"

# sudo su - postgres
sudo su -
sudo chmod 755 /home/ec2-user
sudo -u postgres psql
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'rolwyn12345';"
sudo -u postgres psql -c "CREATE DATABASE testdb;"
# sudo -u postgres psql -c "DROP TABLE IF EXISTS users;"
sudo -u postgres psql -c "CREATE TABLE users (\
	id SERIAL PRIMARY KEY,\
	url VARCHAR(255) NOT NULL,\
	name VARCHAR(255) NOT NULL,\
	description VARCHAR (255),\
        last_update DATE\
);"
sudo -u postgres psql -c "INSERT INTO users (url, name) VALUES('https://www.postgresqltutorial.com','PostgreSQL Tutorial');"
# echo sudo -u postgres psql -d testdb
sudo -u postgres psql -d testdb -c 'SELECT * FROM users;'

