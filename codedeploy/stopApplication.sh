echo "Doing stuff before install"
pwd
ls -la
echo "Doing stuff before install"
# sudo pm2 stop all
cd /home/ec2-user
pwd
systemctl stop webservice
echo "Removing webservice folder"
rm -rf webservice
pwd
ls -al
mkdir webservice