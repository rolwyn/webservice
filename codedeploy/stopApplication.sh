echo "Doing stuff before install"
pwd
ls -la
echo "cd to ec2-user"
cd /home/ec2-user
pwd
echo "Stop webservice"
systemctl stop webservice
echo "Removing webservice folder"
rm -rf webservice
pwd
ls -al
echo "Create a new folder"
mkdir webservice