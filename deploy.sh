#!/bin/bash

repoPath=$(realpath $(dirname $0))
echo "using repo path $repoPath"

find $repoPath/docs -type f | grep -vi cname | xargs -I % git rm %

cd $repoPath/frontend 
yarn build 
cd -

cp -vr $repoPath/frontend/build/* $repoPath/docs/

git add $repoPath/docs/*
