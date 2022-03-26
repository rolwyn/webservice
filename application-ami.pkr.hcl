packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

// define variables
variable "source_ami" {
  type    = string
  default = ""
}

variable "ami_region" {
  type    = string
  default = ""
}

variable "ami_name" {
  type    = string
  default = ""
}

variable "ssh_username" {
  type    = string
  default = "ec2-user"
}

variable "AWS_ACCESS_KEY_ID" {
  type    = string
  default = ""
}

variable "AWS_SECRET_ACCESS_KEY" {
  type    = string
  default = ""
}

// source - amazon-ebs, shared with demo account
source "amazon-ebs" "ec2-user" {
  access_key    = "${var.AWS_ACCESS_KEY_ID}"
  secret_key    = "${var.AWS_SECRET_ACCESS_KEY}"
  region        = "${var.ami_region}"
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  ami_name      = "${var.ami_name}"
  ami_description = "AMI - Spring 2022"
  ami_users=[605680160689]
}

// build with all the provisioners
build {
  sources = ["source.amazon-ebs.ec2-user"]
  // wait till complete boot
  // provisioner "shell" {
  //   inline = ["sleep 10"]
  // }
  provisioner "file" {
    source = "webservice.zip"
    destination = "~/"
  }
  provisioner "shell" {
    inline = [
      "cd ~",
      "sudo mkdir -v -m755 webservice",
      "sudo unzip webservice.zip -d webservice"
    ]
  }
  provisioner "shell" {
    environment_vars = ["CURRENTREGION=${var.ami_region}"]
    scripts = [
      "./buildscript.sh",
    ]
  }
}
