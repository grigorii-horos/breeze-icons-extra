/* eslint-disable no-await-in-loop, no-restricted-syntax */
import mkdirp from 'mkdirp';
import { existsSync } from 'node:fs';
import {
  readFile,
  symlink,
  unlink,
  writeFile,
} from 'node:fs/promises';

const iconsDirs = [
  './breeze-icons/icons/places',
  './breeze-icons/icons-dark/places',
];

const iconsOutDirs = [
  './breeze-icons/icons/places',
  './breeze-icons/icons-dark/places',
];

const smallIconSizes = ['16', '22', '24'];
const largeIconSizes = ['32', '48', '64', '96'];

const iconSizes = [...smallIconSizes, ...largeIconSizes];

const baseColors = ['#3daee9', '#232629', '#31363b'];

const colors = {
  default: ['#3daee9', '#232629'],

  black: ['#3f3f3f', '#dcdcdc'],
  blue: ['#5294e2', '#1d344f'],
  bluegray: ['#607D8B', '#222C31'],
  brown: ['#AE8E6C', '#111111'],
  cyan: ['#00BCD4', '#00424A'],
  green: ['#3bad7e', '#2F3E1F'],
  grey: ['#8E8E8E', '#111111'],
  magenta: ['#CA71DF', '#47274E'],
  orange: ['#EB6637', '#522413'],
  pink: ['#F06292', '#201010'],
  teal: ['#16A085', '#04281E'],
  red: ['#eb0a42', '#111111'],
  violet: ['#7E57C2', '#150530'],
  white: ['#E4E4E4', '#3F3F3F'],
  yellow: ['#F9BD30', '#333000'],
};

const actions = [
  'activities',
  'book',
  'bookmark',
  'cloud',
  'comic',
  'development',
  'documents',
  'download',
  'favorites',
  'games',
  'gdrive',
  'html',
  'image-people',
  'important',
  'library',
  'locked',
  'mail',
  'network',
  'open',
  'pictures',
  'print',
  'publicshare',
  'root',
  'script',
  'sound',
  'tar',
  'temp',
  'templates',
  'text',
  'unlocked',
  'videos',
];

const links = {
  downloads: 'download',
  image: 'pictures',
  images: 'pictures',
  picture: 'pictures',
  photo: 'pictures',
  music: 'sound',
  public: 'publicshare',
  remote: 'html',
  txt: 'text',
  video: 'videos',
  recent: 'temp',
  home: 'user-home',
  network: 'network-workgroup',

};

const linksCopies = {
  'network-workgroup': 'network-workgroup',
  'user-home': 'user-home',
};

const templates = [
  ...new Set([
    ...actions,
    ...Object.keys(linksCopies),
    ...Object.values(links),
    '',
  ]),
];

const fn = async (iconsDir, iconsOutDir) => {
  for (const size of iconSizes) {
    if (!existsSync(`${iconsDir}/${size}`)) {
      continue;
    }

    try {
      await mkdirp(`${iconsOutDir}/${size}`);
    } catch {}

    for (const [path, target] of Object.entries(linksCopies)) {
      try {
        await unlink(`${iconsOutDir}/${size}/folder-${path}.svg`);
      } catch {
        // console.log(err)
      }

      try {
        await symlink(
          `${target}.svg`,
          `${iconsOutDir}/${size}/folder-${path}.svg`,
        );
      } catch {
        // console.log(err)
      }
    }
  }

  for (const color of Object.keys(colors)) {
    for (const size of smallIconSizes) {
      for (const template of templates) {
        try {
          if (color === 'default') {
            let svg = await readFile(
              `${iconsDir}/${size}/folder${template ? `-${template}` : ''}.svg`,
              'UTF-8',
            );

            svg = svg.replaceAll(
              '"fill:#da4453"',
              '"fill:currentColor" class="ColorScheme-Text"',
            );

            await writeFile(
              `${iconsOutDir}/${size}/folder${
                template ? `-${template}` : ''
              }.svg`,
              svg,
            );

            continue;
          }

          let svg = await readFile(
            `${iconsDir}/${size}/folder${template ? `-${template}` : ''}.svg`,
            'UTF-8',
          );

          const newColor = colors[color][0];
          svg = svg.replaceAll('#232629', newColor);
          svg = svg.replaceAll('#eff0f1', newColor);

          svg = svg.replaceAll('ColorScheme-Text', 'ctn');
          svg = svg.replaceAll('id="current-color-scheme"', '');

          await writeFile(
            `${iconsOutDir}/${size}/folder-${color}${
              template ? `-${template}` : ''
            }.svg`,
            svg,
          );
        } catch {
          // console.log(error)
        }
      }
    }

    for (const size of largeIconSizes) {
      if (!existsSync(`${iconsDir}/${size}`)) {
        continue;
      }

      for (const template of templates) {
        try {
          if (color === 'default') {
            let svg = await readFile(
              `${iconsDir}/${size}/folder${template ? `-${template}` : ''}.svg`,
              'UTF-8',
            );

            svg = svg.replaceAll(
              '"fill:#eb0a42"',
              '"fill:currentColor" class="ColorScheme-Highlight"',
            );

            await writeFile(
              `${iconsOutDir}/${size}/folder${
                template ? `-${template}` : ''
              }.svg`,
              svg,
            );

            continue;
          }

          let svg = await readFile(
            `${iconsDir}/${size}/folder${template ? `-${template}` : ''}.svg`,
            'UTF-8',
          );

          svg = svg.replaceAll(baseColors[0], colors[color][0]);
          svg = svg.replaceAll(baseColors[1], colors[color][1]);
          svg = svg.replaceAll(baseColors[2], colors[color][1]);

          svg = svg.replaceAll('ColorScheme-Text', 'ctn');
          svg = svg.replaceAll('ColorScheme-Highlight', 'chn');
          svg = svg.replaceAll('id="current-color-scheme"', '');

          await writeFile(
            `${iconsOutDir}/${size}/folder-${color}${
              template ? `-${template}` : ''
            }.svg`,
            svg,
          );
        } catch {
          // console.log(err)
        }
      }
    }

    for (const size of iconSizes) {
      for (const [path, target] of Object.entries(links)) {
        if (color === 'default') {
          continue;
        }

        try {
          await unlink(`${iconsOutDir}/${size}/folder-${color}-${path}.svg`);
        } catch {
          // console.log(err)
        }

        try {
          await symlink(
            `folder-${color}-${target}.svg`,
            `${iconsOutDir}/${size}/folder-${color}-${path}.svg`,
          );
        } catch {
          // console.log(err)
        }
      }
    }
  }
};

fn(iconsDirs[0], iconsOutDirs[0]);
fn(iconsDirs[1], iconsOutDirs[1]);

const generateDesktopFiles = async () => {
  const colorNames = Object.keys(colors).filter((color) => color !== 'default');
  const actionsNames = actions;

  let desktopFileColors = `[Desktop Entry]
Type=Service
Encoding=UTF-8
Version=2.0.3
ServiceTypes=KonqPopupMenu/Plugin,inode/directory
Actions=${colorNames.map((color) => `${color};`).join('')}noColor;
X-KDE-Priority=TopLevel
X-KDE-StartupNotify=false
Icon=folder-red
X-KDE-Submenu=Change color
`;

  desktopFileColors += `
[Desktop Action noColor]
Name=No Color
Icon=folder
Exec=change-folder-icon color "" %U
`;

  desktopFileColors += colorNames.map((color) => `
[Desktop Action ${color}]
Name=${color}
Icon=folder-${color}
Exec=change-folder-icon color ${color} %U
`).join('');

  //

  let desktopFileActions = `[Desktop Entry]
Type=Service
Encoding=UTF-8
Version=2.0.3
ServiceTypes=KonqPopupMenu/Plugin,inode/directory
Actions=${actionsNames.map((action) => `${action};`).join('')}noColor;
X-KDE-Priority=TopLevel
X-KDE-StartupNotify=false
Icon=folder-games
X-KDE-Submenu=Change label
`;

  desktopFileActions += `
[Desktop Action noLabel]
Name=No Label
Icon=folder
Exec=change-folder-icon label "" %U
`;

  desktopFileActions += actionsNames.map((action) => `
[Desktop Action ${action}]
Name=${action}
Icon=folder-${action}
Exec=change-folder-icon color ${action} %U
`).join('');

  //

  await writeFile('change-color.desktop', desktopFileColors);
  await writeFile('change-label.desktop', desktopFileActions);
};

generateDesktopFiles();
