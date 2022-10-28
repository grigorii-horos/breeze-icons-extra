# Maintainer: Gustavo Alvarez <sl1pkn07@gmail.com>
# Contributor: FadeMind <fademind@gmail.com>

pkgname=('breeze-icons-extra' 'breeze-icons-extra-light' 'breeze-icons-extra-dark')
pkgver=5.99.0.r2.694470b
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
)

source=()
sha256sums=()

prepare() {
  mkdir -p build
  cd ../
  bash ./build.sh
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

  mkdir -p "${pkgdir}/usr/bin/" "${pkgdir}/usr/share/kio/servicemenus/"
  install -D --mode=644 ../change-label.desktop "${pkgdir}/usr/share/kio/servicemenus/"
  install -D --mode=644 ../change-color.desktop "${pkgdir}/usr/share/kio/servicemenus/"
  install -D --mode=555 ../change-folder-icon "${pkgdir}/usr/bin/"
}

package_breeze-icons-extra-light() {
  provides=('breeze-icons-extra-light')
  depends=('breeze-icons-extra')

  mkdir -p "${pkgdir}/usr/share/icons/breeze"
  cp -Rp "../breeze-icons/icons/." "${pkgdir}/usr/share/icons/breeze/"
  rm "${pkgdir}/usr/share/icons/breeze/"{AUTHORS,CMakeLists.txt}
}

package_breeze-icons-extra-dark() {
  provides=('breeze-icons-extra-dark')
  depends=('breeze-icons-extra')

  mkdir -p "${pkgdir}/usr/share/icons/breeze-dark"
  cp -Rp "../breeze-icons/icons/." "${pkgdir}/usr/share/icons/breeze-dark/"
  cp -Rp "../breeze-icons/icons-dark/." "${pkgdir}/usr/share/icons/breeze-dark/"
  rm "${pkgdir}/usr/share/icons/breeze-dark/"{AUTHORS,CMakeLists.txt}
}
