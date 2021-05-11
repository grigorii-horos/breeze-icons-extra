#!/usr/bin/env sh

if cd .icons; then
    git checkout .
    git pull
    cd ..
else
    git clone --depth 1 https://github.com/KDE/breeze-icons .icons
fi

rm -rf ./tmp ./breeze-icons

cp -Rp --reflink=auto ./.icons ./breeze-icons

sed -i -e 's/5\.82/5\.81/g' ./breeze-icons/CMakeLists.txt
sed -i -e 's/5\.83/5\.82/g' ./breeze-icons/CMakeLists.txt

npm ci
node index.js

cp -Rp ./tmp/icons ./tmp/icons-dark ./breeze-icons

cd ./breeze-icons/icons

python ../generate-24px-versions.py ./
cd ../icons-dark
python ../generate-24px-versions.py ./

cd ..

find -name '*.svg' -type f | parallel -j "$(nproc)" ../node_modules/.bin/svgo --config ../config.cjs --input '{}' --output '{}'


find -name '*.svg' -type f | while read line; do
    echo $line
    gzip -9 -f -S z "$line"
done

find -name '*.svg' -type l | while read line; do
    echo $line
    ln -sf $(readlink $line)z "${line}z"
    rm $line
done

cd ..

sed -i -e 's/\.svg/\.svgz/g' ./breeze-icons/icons/index.theme
sed -i -e 's/\.svg/\.svgz/g' ./breeze-icons/icons-dark/index.theme
