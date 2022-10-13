/* eslint-disable no-await-in-loop, no-restricted-syntax */
import mkdirp from 'mkdirp';
import { existsSync } from 'node:fs';
import {
  readFile, symlink, unlink, writeFile,
} from 'node:fs/promises';
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

const baseColors = ['#3daee9', '#232629', '#31363b'];

const colors = {
  default: ['#3daee9', '#232629'],

  red: ['#D32F2F', 'default'], //+
  orange: ['#F57C00', 'default'], //+
  yellow: ['#FBC02D', 'default'], //+
  green: ['#388E3C', 'default'], //+
  teal: ['#00796B', 'default'], //+
  cyan: ['#0097A7', 'default'], //+
  blue: ['#1976D2', 'default'], //+
  violet: ['#512DA8', 'default'], //+
  magenta: ['#7B1FA2', 'default'], //+

  darkgrey: ['#5c5c5c', '#ffffff'], //-
  grey: ['#a7afb4', '#000000'], //+
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
  //

  'appimage',
  'build',
  'calculate',
  'chart',
  'crash',
  'database',
  'design',
  'desktop',
  'docker',
  'drawing',
  'extension',
  'flatpack',
  'git',
  'language',
  'log',
  'mac',
  'notes',
  'paint',
  'presentation',
  'sign',
  'snap',
  'table',
  'windows',
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

          // const newColor = colors[color][0];
          // svg = svg.replaceAll('#232629', newColor);
          // svg = svg.replaceAll('#eff0f1', newColor);

          let style = `
    <style type="text/css" >
`;

          style += `    .ColorText {
      color:${colors[color][0]};
    }
`;

          style += `    </style>
`;

          svg = svg.replaceAll('<style type="text/css" id="current-color-scheme">', `${style}\n    <style type="text/css" id="current-color-scheme">`);
          svg = svg.replaceAll('<style id="current-color-scheme" type="text/css">', `${style}\n    <style type="text/css" id="current-color-scheme">`);

          svg = svg.replaceAll('class="ColorScheme-Text"', 'class="ColorText"');
          svg = svg.replaceAll('class="ColorScheme-Highlight"', 'class="ColorHighlight"');

          // svg = svg.replaceAll('ColorScheme-Text', 'ctn');
          // svg = svg.replaceAll('id="current-color-scheme"', '');

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

          // svg = svg.replaceAll(baseColors[0], colors[color][0]);
          // svg = svg.replaceAll(baseColors[1], colors[color][1]);
          // svg = svg.replaceAll(baseColors[2], colors[color][1]);

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

          svg = svg.replaceAll('<style type="text/css" id="current-color-scheme">', `${style}\n    <style type="text/css" id="current-color-scheme">`);
          svg = svg.replaceAll('<style id="current-color-scheme" type="text/css">', `${style}\n    <style type="text/css" id="current-color-scheme">`);

          if (colors[color][1] !== 'default') {
            svg = svg.replaceAll('class="ColorScheme-Text"', 'class="ColorText"');
          }

          svg = svg.replaceAll('class="ColorScheme-Highlight"', 'class="ColorHighlight"');

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
