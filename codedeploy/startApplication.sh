echo "After install"
pwd
ls -al
"echo In /home/ec2-user"
cd /home/ec2-user
echo "In webservice"
cd webservice
echo "npm install dependencies"
sudo npm install --production
echo "Start application"
pwd
ls -al
echo "Start webservice and reload"
# sudo systemctl start webservice
sudo pm2 reload all --update-env