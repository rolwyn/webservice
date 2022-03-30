echo "Start application"
pwd
ls -al
echo "Start webservice and reload"
sudo systemctl start webservice
sudo pm2 reload all --update-env