echo "Start application"
pwd
ls -al
systemctl start webservice
sudo pm2 reload all --update-env