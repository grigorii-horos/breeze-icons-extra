#!/usr/bin/env sh

if cd .icons; then
    git checkout .
    git pull
    cd ..
else
    git clone --depth 1 https://github.com/KDE/breeze-icons .icons
fi

rm -rf ./breeze-icons

cp -Rpf --reflink=auto ./.icons/ ./breeze-icons


cd ./breeze-icons/icons
python ../generate-24px-versions.py ./

cd ../icons-dark
python ../generate-24px-versions.py ./

cd ../..

#npm ci
node index.js

cd ./breeze-icons

#find -name '*.svg' -size +4k -type f | parallel -j "$(nproc)" ../node_modules/.bin/svgo --config ../config.cjs --input '{}' --output '{}' --quiet
