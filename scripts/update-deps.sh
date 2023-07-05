#!/bin/bash

# fail as soon as any command errors
set -e

token=$1
update_command=$2
on_changes_command=$3
repo=$GITHUB_REPOSITORY #owner and repository: ie: user/repo
branch_name=$GITHUB_REF_NAME
update_message="chore: update deps"

username=$GITHUB_ACTOR
email="noreply@github.com"

if [ -z "$token" ]; then
    echo "token is not defined"
    exit 1
fi

if [ -z "$update_command" ]; then
    echo "update-command cannot be empty"
    exit 1
fi

# fetch first to be able to detect if branch already exists 
git fetch

echo "Running update command $update_command"
eval $update_command

if [ -n "git diff" ]
then
    echo "Updates detected"

    # configure git authorship
    git config --global user.email $email
    git config --global user.name $username

    # format: https://[username]:[token]@github.com/[organization]/[repo].git
    git remote add authenticated "https://$username:$token@github.com/$repo.git"

    # execute command to run when changes are deteced, if provided
    if [ -n "$on_changes_command" ]; then
        echo "Run post-update command"
        echo $on_changes_command
        eval $on_changes_command
    fi

    # explicitly add all files including untracked
    git add -A

    # commit the changes to updated files
    git commit -a -m $update_message --signoff
    
    # push the changes
    git push authenticated
else
    echo "No dependencies updates were detected"
    exit 0
fi
