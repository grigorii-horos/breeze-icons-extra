#!/usr/bin/env sh

git clone https://github.com/KDE/breeze-icons
sed -i -e 's/5\.82/5\.81/g' breeze-icons/CMakeLists.txt
npm i
node index.js

cp -Rp ./tmp/icons ./tmp/icons-dark ./breeze-icons
