# Maintainer: Gustavo Alvarez <sl1pkn07@gmail.com>
# Contributor: FadeMind <fademind@gmail.com>

pkgname=breeze-icons-extra
pkgver=5.82
pkgrel=2
pkgdesc="Breeze icon themes for KDE Plasma. Extra version"
arch=('any')
url='https://github.com/grigorii-horos/breeze-icons-extra'
license=('LGPL')
groups=('kf5')
makedepends=('extra-cmake-modules'
             'git'
             'qt5-base'
             'nodejs'
             'npm'
             )
provides=('breeze-icons' 'breeze-icons-git')
conflicts=('breeze-icons' 'breeze-icons-git')
source=('git+https://github.com/grigorii-horos/breeze-icons-extra.git')
sha256sums=('SKIP')

prepare() {
  mkdir -p build
  cd ./breeze-icons-extra
  ./build.sh
}

build() {
  cd build
  cmake ../breeze-icons-extra/breeze-icons \
    -DCMAKE_BUILD_TYPE=None \
    -DCMAKE_INSTALL_PREFIX=/usr \
    -DBUILD_TESTING=OFF \
    -DBINARY_ICONS_RESOURCE=ON

  make
}

package() {
  make -C build DESTDIR="${pkgdir}" install
}
