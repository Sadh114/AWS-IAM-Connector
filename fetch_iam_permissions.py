import boto3

iam = boto3.client(
    'iam',
    aws_access_key_id='**',
    aws_secret_access_key='**',
    region_name='ap-south-1'  
)


users = iam.list_users()
for user in users['Users']:
    print("User:", user['UserName'])




for user in users['Users']:
    username = user['UserName']
    print(f"\nPermissions for {username}:")
    policies = iam.list_attached_user_policies(UserName=username)
    for policy in policies['AttachedPolicies']:
        print("  Managed Policy:", policy['PolicyName'])


    inline = iam.list_user_policies(UserName=username)
    for in_name in inline['PolicyNames']:
        print("  Inline Policy:", in_name)


    groups = iam.list_groups_for_user(UserName=username)
    for group in groups['Groups']:
        print("  Group:", group['GroupName'])
        gp_policies = iam.list_attached_group_policies(GroupName=group['GroupName'])
        for gp_policy in gp_policies['AttachedPolicies']:
            print("    Group Managed Policy:", gp_policy['PolicyName'])

            from tabulate import tabulate

#-----------------------------------------------------------------------------
from tabulate import tabulate

table_data = []
for user in users['Users']:
    username = user['UserName']
    policies = iam.list_attached_user_policies(UserName=username)
    for policy in policies['AttachedPolicies']:
        table_data.append([username, policy['PolicyName']])

print(tabulate(table_data, headers=['User', 'Attached Policy']))

#---This produces a CSV report

import csv

with open('iam_permissions.csv', 'w', newline='') as csvfile:
    writer = csv.writer(csvfile)
    writer.writerow(['User', 'PolicyType', 'PolicyName'])

    for user in users['Users']:
        username = user['UserName']
        attached = iam.list_attached_user_policies(UserName=username)
        for policy in attached['AttachedPolicies']:
            writer.writerow([username, 'Managed', policy['PolicyName']])

        inline = iam.list_user_policies(UserName=username)
        for policy in inline['PolicyNames']:
            writer.writerow([username, 'Inline', policy])


#-----try-except block to handle issues
try:
    users = iam.list_users()
except iam.exceptions.NoSuchEntityException:
    print("Error: No users found")
except Exception as e:
    print(f"Unexpected error: {e}")


#-------- Create a CLI Interface
def menu():
    print("1. List Users")
    print("2. Show User Permissions")
    choice = input("Choose an option: ")
    if choice == '1':
        list_users()
    elif choice == '2':
        username = input("Enter username: ")
        show_permissions(username)


# 