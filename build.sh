#!/usr/bin/env sh

if cd breeze-icons; then
    git checkout .
    git pull
    cd ..
else
    git clone https://github.com/KDE/breeze-icons
fi

sed -i -e 's/5\.82/5\.81/g' ./breeze-icons/CMakeLists.txt

npm i
node index.js

cp -Rp ./tmp/icons ./tmp/icons-dark ./breeze-icons
