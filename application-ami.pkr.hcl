packer {
  required_plugins {
    amazon = {
      version = ">= 0.0.1"
      source  = "github.com/hashicorp/amazon"
    }
  }
}

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

source "amazon-ebs" "ec2-user" {
  // access_key    = "${env.AWS_ACCESS_KEY_ID}"
  // secret_key    = "${env.AWS_SECRET_ACCESS_KEY}"
  region        = "${var.ami_region}"
  instance_type = "t2.micro"
  source_ami    = "${var.source_ami}"
  ssh_username  = "${var.ssh_username}"
  ami_name      = "${var.ami_name}"
  ami_description = "AMI - Spring 2022"
  ami_users=[605680160689]
  // launch_block_device_mappings {
  //   device_name = "/dev/sda1"
  //   volume_size = 8
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

