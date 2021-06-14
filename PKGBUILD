# Maintainer: Gustavo Alvarez <sl1pkn07@gmail.com>
# Contributor: FadeMind <fademind@gmail.com>

pkgname=('breeze-icons-extra' 'breeze-icons-extra-light' 'breeze-icons-extra-dark')
pkgver=5.84
pkgrel=5
pkgdesc="Breeze icon themes for KDE Plasma. Extra version"
arch=('any')
url='https://github.com/grigorii-horos/breeze-icons-extra'
license=('LGPL')
groups=('kf5')
makedepends=(
              'extra-cmake-modules'
              'git'
              'qt5-base'
              'nodejs'
              'npm'
              'parallel'
            )

source=()
sha256sums=()

prepare() {
  mkdir -p build
}

build() {
  cd ../
  bash ./build.sh
  cd ./src/build
  cmake ../../breeze-icons \
    -DCMAKE_BUILD_TYPE=None \
    -DCMAKE_INSTALL_PREFIX=/usr \
    -DBUILD_TESTING=OFF \
    -DBINARY_ICONS_RESOURCE=ON \
    -DWITH_ICON_GENERATION=OFF

  make

  make DESTDIR="../install-dir" install
}

package_breeze-icons-extra() {
  provides=('breeze-icons' 'breeze-icons-git')
  conflicts=('breeze-icons' 'breeze-icons-git')
  optdepends=(
    'breeze-icons-extra-light: Install one of this packages'
    'breeze-icons-extra-dark: Install one of this packages'
  )
}

package_breeze-icons-extra-light() {
  provides=()
  depends=('breeze-icons-extra')
  mkdir -p "${pkgdir}"/usr/share/icons/breeze
  cp -Rp ./install-dir/usr/share/icons/breeze/. "${pkgdir}"/usr/share/icons/breeze/
}

package_breeze-icons-extra-dark() {
  provides=()
  depends=('breeze-icons-extra')
  mkdir -p "${pkgdir}"/usr/share/icons/breeze-dark
  cp -Rp ./install-dir/usr/share/icons/breeze-dark/. "${pkgdir}"/usr/share/icons/breeze-dark/
}
