# Deploying Backstage with AWS Fargate and Aurora

There are any number of ways to deploy backstage containers on AWS. One of the
simplest from a management and ops perspective is to leverage AWS Fargate and
Aurora PostgreSQL, where both the container orchestration and database clusters
are AWS managed services.

However, to use them properly there are a large number of supporting resources
(VPCs, Security Groups, Load Balancers, Certificate, etc) required. One approach
is to use [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) to
simplify and automate the creation of the entire infrastructure stack along with
automating the build and deploy of the container.

Check out the [Backstage On AWS](https://github.com/rbogle/backstage-on-aws)
repository, for a ready to use CDK application for deploying your custom
Backstage app onto AWS ECS Fargate and Aurora.
