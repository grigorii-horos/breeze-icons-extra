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

sed -i -e 's/5\.82/5\.81/g' ./breeze-icons/CMakeLists.txt
sed -i -e 's/5\.84/5\.82/g' ./breeze-icons/CMakeLists.txt
sed -i -e 's/5\.85/5\.82/g' ./breeze-icons/CMakeLists.txt
sed -i -e 's/5\.86/5\.84/g' ./breeze-icons/CMakeLists.txt
sed -i -e 's/5\.87/5\.84/g' ./breeze-icons/CMakeLists.txt
sed -i -e 's/5\.88/5\.84/g' ./breeze-icons/CMakeLists.txt
sed -i -e 's/5\.89/5\.84/g' ./breeze-icons/CMakeLists.txt

cd ./breeze-icons/icons
python ../generate-24px-versions.py ./

cd ../icons-dark
python ../generate-24px-versions.py ./

cd ..

npm ci
node index.js

# find -name '*.svg' -type f | parallel -j "$(nproc)" ../node_modules/.bin/svgo --config ../config.cjs --input '{}' --output '{}'

find -name '*.svg' -type f | parallel -j "$(nproc)" gzip -9 -f -S z "{}"


find -name '*.svg' -type l | while read line; do
    ln -sf $(readlink $line)z "${line}z"
    rm $line
done


sed -i -e 's/\.svg/\.svgz/g' ./icons/index.theme
sed -i -e 's/\.svg/\.svgz/g' ./icons-dark/index.theme

sed -i -e 's/\.svg/\.svgz/g' ./CMakeLists.txt
