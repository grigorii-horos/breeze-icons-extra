#!/usr/bin/env sh

if cd breeze-icons; then
    git checkout .
    git pull
    cd ..
else
    git clone --depth 1 https://github.com/KDE/breeze-icons
fi

sed -i -e 's/5\.82/5\.81/g' ./breeze-icons/CMakeLists.txt

npm ci
node index.js

cp -Rp ./tmp/icons ./tmp/icons-dark ./breeze-icons
