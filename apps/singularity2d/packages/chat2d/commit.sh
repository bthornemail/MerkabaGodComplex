#!/bin/bash

# Prompt the user for a commit message
echo "Enter a commit message:"
read commit_message

# Add all changes to the Git staging area
git add .

# Commit the changes with the user-provided commit message
git commit -m "$commit_message"

# Push the committed changes to the remote repository
git push