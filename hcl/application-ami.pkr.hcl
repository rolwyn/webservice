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

// source "amazon-ebs" "linux" {
//   source_ami = "${upper("source_ami")}"
// }

source "amazon-ebs" "appilcation" {
  source_ami = "${var.source_ami}"
}

build {
  sources = ["source.amazon-ebs.appilcation"]

  provisioner "shell" {
      inline = ["echo `${var.source_ami}`"]
  }

}

