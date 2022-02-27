packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

variable "source_ami" {
  default = ""
}

variable "ami_region" {
  default = ""
}

variable "ami_name" {
  default = ""
}

source "amazon-ebs" "ec2-user" {
  region      =  "${var.ami_region}"
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "ec2-user"
  ami_name      = "${var.ami_name}"
  ami_description = "AMI - Spring 2022"
  ami_users=[185620807237]
  // launch_block_device_mappings {
  //   device_name = "/dev/sda1"
  //   volume_size = 40
  //   volume_type = "gp2"
  //   delete_on_termination = true
  // }
}

build {
  sources = ["source.amazon-ebs.ec2-user"]

  provisioner "shell" {
    scripts = [
      "./buildscript.sh",
    ]
  }

}

