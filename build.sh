#!/usr/bin/env sh

if cd .icons; then
    git checkout .
    git pull
    cd ..
else
    git clone --depth 1 https://github.com/KDE/breeze-icons .icons
fi

# echo 1111
# pwd
# echo 1111

rm -rf ./breeze-icons

cp -Rpf --reflink=auto ./.icons/ ./breeze-icons


echo 2222
pwd
echo 2222

cd ./breeze-icons/icons
python ../generate-24px-versions.py ./
cd ..

cd ./icons-dark
python ../generate-24px-versions.py ./
cd ..

cd ..

echo 3333
pwd
echo 3333


# npm ci
node index.js

# cd ./breeze-icons

# find -name '*.svg' -size +4k -type f | parallel -j "$(nproc)" ../node_modules/.bin/svgo --config ../config.cjs --input '{}' --output '{}' --quiet

# cmake -B build -S breeze-icons -DBINARY_ICONS_RESOURCE=ON -DBUILD_TESTING=OFF
# cmake --build build
DESTDIR="output" cmake --install build
