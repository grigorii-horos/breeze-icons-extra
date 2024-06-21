# Maintainer: Gustavo Alvarez <sl1pkn07@gmail.com>
# Contributor: FadeMind <fademind@gmail.com>

pkgname=('breeze-icons-extra' 'breeze-icons-extra-light' 'breeze-icons-extra-dark')
pkgver=6.3.0.r2200.bd73e568
pkgrel=1
pkgdesc="Breeze icon themes for KDE Plasma. Extra version"
arch=('any')
url='https://github.com/grigorii-horos/breeze-icons-extra'
license=('LGPL')
groups=('kf5')
makedepends=(
  'git'
  'nodejs'
  'npm'
  'parallel'
  'extra-cmake-modules'
)

source=()
sha256sums=()

prepare() {

  cd ../

  mkdir -p build
  # bash ./build.sh
}

pkgver(){
  cd ../.icons
  _ver="$(cat CMakeLists.txt | grep -m1 '(ECM' | grep -o "[[:digit:]]*" | paste -sd'.')"
  echo "${_ver}.r$(git rev-list --count HEAD).$(git rev-parse --short HEAD)"
}

build() {
  true
}

package_breeze-icons-extra() {
  provides=('breeze-icons' 'breeze-icons-git')
  conflicts=('breeze-icons' 'breeze-icons-git')
  optdepends=(
    'breeze-icons-extra-light: Install one of this packages'
    'breeze-icons-extra-dark: Install one of this packages'
  )

  cd ..

  mkdir -p "${pkgdir}/usr/bin/" "${pkgdir}/usr/share/kio/servicemenus/"
  install -D --mode=644 ./change-label.desktop "${pkgdir}/usr/share/kio/servicemenus/"
  install -D --mode=644 ./change-color.desktop "${pkgdir}/usr/share/kio/servicemenus/"
  install -D --mode=555 ./change-folder-icon "${pkgdir}/usr/bin/"


  cp -Rp "./output/usr/include/." "${pkgdir}/usr/include/"
  cp -Rp "./output/usr/lib/." "${pkgdir}/usr/lib/"

}

package_breeze-icons-extra-light() {
  provides=('breeze-icons-extra-light')
  depends=('breeze-icons-extra')

  cd ..

  echo oooooooo
  pwd
  echo oooooooo

  mkdir -p "${pkgdir}/usr/share/icons/breeze"
  cp -Rp "./output/usr/share/icons/breeze/." "${pkgdir}/usr/share/icons/breeze/"
}

package_breeze-icons-extra-dark() {
  provides=('breeze-icons-extra-dark')
  depends=('breeze-icons-extra')

  cd ..

  echo oooooooo
  pwd
  echo oooooooo

  mkdir -p "${pkgdir}/usr/share/icons/breeze-dark"
  cp -Rp "./output/usr/share/icons/breeze/." "${pkgdir}/usr/share/icons/breeze-dark/"
  cp -Rp "./output/usr/share/icons/breeze-dark/." "${pkgdir}/usr/share/icons/breeze-dark/"
}
