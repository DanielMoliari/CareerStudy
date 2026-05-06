import type { SkillContentMap } from '@/types'
import aws from './aws/aws'
import ec2 from './ec2/ec2'
import s3 from './s3/s3'
import lambda from './lambda/lambda'
import rds from './rds'
import iam from './iam'
import vpc from './vpc'
import terraform from './terraform/terraform'
import pulumi from './pulumi'

const cloud: SkillContentMap = {
  'aws': aws,
  'ec2': ec2,
  's3': s3,
  'lambda': lambda,
  'rds': rds,
  'iam': iam,
  'vpc': vpc,
  'terraform': terraform,
  'pulumi': pulumi,
}

export default cloud
