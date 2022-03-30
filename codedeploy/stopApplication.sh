echo "Doing stuff before install"
pwd
ls -la
echo "cd to ec2-user"
cd /home/ec2-user
pwd
echo "Stop webservice"
sudo systemctl stop webservice
echo "Removing webservice folder"
sudo rm -rf webservice
echo "Create a new folder"
mkdir webservice