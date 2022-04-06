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
sudo mkdir -p ~/logs
sudo pm2 reload all --update-env
# start cloudwatch agent
sudo pm2 startOrReload ecosystem.config.js
sudo /opt/aws/amazon-cloudwatch-agent/bin/amazon-cloudwatch-agent-ctl -a fetch-config -m ec2 -c file:/home/ec2-user/webservice/amazon-cloudwatch-config.json -s