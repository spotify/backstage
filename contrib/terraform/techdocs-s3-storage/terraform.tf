#==========================
# Variables
#==========================

variable "backstage_bucket" {
  default = "backstage_bucket_for_my_corp"
}

variable "backstage_iam" {
  default = "backstage"
}

variable "shared_managed_tag" {
  default = "terraform_for_my_corp"
}

#==========================
# Bucket
#==========================

resource "aws_s3_bucket" "backstage" {
  bucket = var.backstage_bucket
  acl    = "private"
  provider = aws

  lifecycle {
    prevent_destroy = true
  }

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "AES256"
      }
    }
  }

  tags = {
    Name                   = var.backstage_bucket
    "Managed By Terraform" = var.shared_managed_tag
  }
}

resource "aws_s3_bucket_public_access_block" "backstage" {
  bucket = aws_s3_bucket.backstage.id

  block_public_acls   = true
  block_public_policy = true
  ignore_public_acls = true
  restrict_public_buckets = true
}


#==========================
# IAM
#==========================

resource "aws_iam_user" "backstage" {
  name = var.backstage_iam
}

resource "aws_iam_user_policy" "backstage" {
  name = var.backstage_iam
  user = aws_iam_user.backstage.name
  policy = data.aws_iam_policy_document.backstage_policy.json
}

data "aws_iam_policy_document" "backstage_policy" {
  statement {
    actions = [
      "s3:PutObject",
      "s3:GetObject",
      "s3:ListBucket"
    ]
    effect = "Allow"
    resources = [
      "${aws_s3_bucket.backstage.arn}",
      "${aws_s3_bucket.backstage.arn}/*",
    ]
  }
}
