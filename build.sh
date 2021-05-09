#!/usr/bin/env sh

if cd breeze-icons; then
    git checkout .
    git pull
    cd ..
else
    git clone --depth 1 https://github.com/KDE/breeze-icons
fi

rm -rf ./tmp

sed -i -e 's/5\.82/5\.81/g' ./breeze-icons/CMakeLists.txt

npm ci
node index.js

cp -Rp ./tmp/icons ./tmp/icons-dark ./breeze-icons



cd ./breeze-icons


find -name '*.svg' -type f | while read line; do
    svgcleaner --remove-gradient-attributes=true \
        --join-style-attributes=all --apply-transform-to-paths=true  \
        --coordinates-precision=5 --properties-precision=5 \
        --transforms-precision=7 --paths-coordinates-precision=7 \
        --multipass --quiet \
        "$line" "$line" 2>/dev/null
done

find -name '*.svg' -type f | while read line; do
    echo $line
    gzip -f -S z "$line"
done

find -name '*.svg' -type l | while read line; do
    echo $line
    ln -sf $(readlink $line)z "${line}z"
    rm $line
done

cd ..

sed -i -e 's/\.svg/\.svgz/g' ./breeze-icons/icons/index.theme
sed -i -e 's/\.svg/\.svgz/g' ./breeze-icons/icons-dark/index.theme
