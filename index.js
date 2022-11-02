/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { existsSync } from 'node:fs';
import {
  readFile, symlink, unlink, writeFile,
} from 'node:fs/promises';

import mkdirp from 'mkdirp';
import { titleCase } from 'title-case';

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

const colors = {
  default: ['#3daee9', '#232629'],

  red: ['#ee2b2b', '#000000'], //+
  orange: ['#ff6d24', '#000000'], //+
  yellow: ['#ffbf00', '#000000'], //+
  green: ['#4CAF50', '#000000'], //+
  teal: ['#009688', '#000000'], //+
  cyan: ['#05a7c7', '#000000'], //+
  blue: ['#6060c7', '#000000'], //+
  violet: ['#823ab6', '#000000'], //+
  magenta: ['#e92063', '#000000'], //+

  brown: ['#83604e', '#ffffff'], //+
  seagreen: ['#4e8369', '#ffffff'], //+
  gigas: ['#694e83', '#ffffff'], //+

  darkgrey: ['#4c4c4c', '#ffffff'], //-
  grey: ['#b7b7b7', '#000000'], //+
};

const actions = {
  // deb: { replaceColors: "#f62459" },

  activities: {},
  favorites: {},
  'image-people': {},
  important: { replaceColors: ['#da4453', '#eb0a42'] },
  open: {},

  download: {},
  bookmark: {},
  book: {},
  comic: {},
  desktop: {},
  text: {},
  games: {},
  mail: {},
  notes: {},
  trash: { replaceColors: ['#3bad7e'] },
  tar: {},
  drawing: {},
  paint: {},
  pictures: {},
  sound: {},
  videos: {},
  podcast: { replaceColors: ['#f89406'] },
  calculate: {},
  documents: {},
  chart: {},
  design: {},
  library: {},
  presentation: {},
  print: {},
  table: {},

  cloud: {},
  gdrive: {},
  network: {},
  publicshare: {},

  mac: {},
  windows: {},
  android: { replaceColors: ['#9bd916'] },
  appimage: {},
  flatpak: {},
  snap: {},
  rpm: { replaceColors: ['#cf000f'] },
  blender: { replaceColors: ['#f89406'] },
  godot: {},

  build: {},
  script: {},
  html: {},
  git: {},
  docker: {},
  java: { replaceColors: ['#ff8b23'] },
  // crash: { replaceColors: ['#eb0a42'] },
  database: {},
  root: {},
  log: {},
  development: {},
  temp: {},
  templates: {},
  language: {},
  extension: {},

  sign: {},
  locked: {},
  unlocked: {},
};

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
    ...Object.keys(actions),
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

            if (actions[template].replaceColors.length > 0) {
              svg = svg.replaceAll(
                `fill:${actions[template].replaceColors[0]}`,
                'fill:currentColor" class="ColorScheme-Text',
              );
            }

            if (actions[template].replaceColors.length > 1) {
              svg = svg.replaceAll(
                `fill:${actions[template].replaceColors[1]}`,
                'fill:currentColor" class="ColorScheme-Text',
              );
            }

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

          let style = `
    <style type="text/css" >
`;

          style += `    .ColorText {
      color:${colors[color][0]};
    }
`;

          style += `    </style>
`;

          svg = svg.replaceAll(
            '<style type="text/css" id="current-color-scheme">',
            `${style}\n    <style type="text/css" id="current-color-scheme">`,
          );
          svg = svg.replaceAll(
            '<style id="current-color-scheme" type="text/css">',
            `${style}\n    <style type="text/css" id="current-color-scheme">`,
          );

          svg = svg.replaceAll('class="ColorScheme-Text"', 'class="ColorText"');
          svg = svg.replaceAll(
            'class="ColorScheme-Highlight"',
            'class="ColorHighlight"',
          );

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

            if (actions[template].replaceColors.length > 0) {
              svg = svg.replaceAll(
                `"fill:${actions[template].replaceColors[0]}"`,
                '"fill:currentColor" class="ColorScheme-Highlight"',
              );
            }

            if (actions[template].replaceColors.length > 1) {
              svg = svg.replaceAll(
                `"fill:${actions[template].replaceColors[1]}"`,
                '"fill:currentColor" class="ColorScheme-Highlight"',
              );
            }

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

          let style = `
    <style type="text/css" >`;

          if (colors[color][1] !== 'default') {
            style += `
    .ColorText {
      color:${colors[color][1]};
    }
`;
          }

          style += `    .ColorHighlight {
      color:${colors[color][0]};
    }
    </style>
`;

          svg = svg.replaceAll(
            '<style type="text/css" id="current-color-scheme">',
            `${style}\n    <style type="text/css" id="current-color-scheme">`,
          );
          svg = svg.replaceAll(
            '<style id="current-color-scheme" type="text/css">',
            `${style}\n    <style type="text/css" id="current-color-scheme">`,
          );

          if (colors[color][1] !== 'default') {
            svg = svg.replaceAll(
              'class="ColorScheme-Text"',
              'class="ColorText"',
            );
          }

          svg = svg.replaceAll(
            'class="ColorScheme-Highlight"',
            'class="ColorHighlight"',
          );

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
  const actionsNames = Object.keys(actions);

  let desktopFileColors = `[Desktop Entry]
Type=Service
MimeType=inode/directory
Actions=${colorNames
    .map((color, index) => `action${`${index}`.padStart(2, '0')};`)
    .join('')}_SEPARATOR_;noColor;
X-KDE-Priority=TopLevel
X-KDE-StartupNotify=false
X-KDE-Submenu=Change color
Icon=folder-green
`;

  desktopFileColors += `
[Desktop Action noColor]
Name=No Color
Icon=folder
Exec=change-folder-icon color "" %U
`;

  desktopFileColors += colorNames
    .map(
      (color, index) => `
[Desktop Action action${`${index}`.padStart(2, '0')}]
Name=${titleCase(color.replaceAll('-', ' '), { pascalCase: true })}
Icon=folder-${color}
Exec=change-folder-icon color ${color} %U
`,
    )
    .join('');

  //

  let desktopFileActions = `[Desktop Entry]
Type=Service
MimeType=inode/directory
Actions=${actionsNames
    .map((action, index) => `action${`${index}`.padStart(2, '0')};`)
    .join('')}_SEPARATOR_;noLabel;
X-KDE-Priority=TopLevel
X-KDE-StartupNotify=false
X-KDE-Submenu=Change label
Icon=folder-bookmark
`;

  desktopFileActions += `
[Desktop Action noLabel]
Name=No Label
Icon=folder
Exec=change-folder-icon label "" %U
`;

  desktopFileActions += actionsNames
    .map(
      (action, index) => `
[Desktop Action action${`${index}`.padStart(2, '0')}]
Name=${titleCase(action.replaceAll('-', ' '), { pascalCase: true })}
Icon=folder-${action}
Exec=change-folder-icon label ${action} %U
`,
    )
    .join('');

  //

  await writeFile('change-color.desktop', desktopFileColors);
  await writeFile('change-label.desktop', desktopFileActions);
};

generateDesktopFiles();
