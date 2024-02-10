/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { existsSync } from "node:fs";
import { readFile, symlink, unlink, writeFile } from "node:fs/promises";

import { Hsluv } from "hsluv";
import { mkdirp } from "mkdirp";
import { titleCase } from "title-case";

const iconsDirs = [
  "./breeze-icons/icons/places",
  "./breeze-icons/icons-dark/places",
];

const iconsOutDirs = [
  "./breeze-icons/icons/places",
  "./breeze-icons/icons-dark/places",
];

const smallIconSizes = ["16", "22", "24"];
const largeIconSizes = ["32", "48", "64", "96"];

const iconSizes = [...smallIconSizes, ...largeIconSizes];

const base_h = 12;
const base_hsluv_l = 65;
const base_hsluv_s = 100;

const hsluvToHex = (index) => {
  const color = new Hsluv();
  color.hsluv_h = base_h + index;
  color.hsluv_s = base_hsluv_s;
  color.hsluv_l = base_hsluv_l;
  color.hsluvToHex();

  return color.hex;
};

// const rose = new Hsluv();
// rose.hsluv_h = base_h + 330;
// rose.hsluv_s = base_hsluv_s;
// rose.hsluv_l = base_hsluv_l;
// rose.hsluvToHex();

// const red = new Hsluv();
// red.hsluv_h = base_h + 0;
// red.hsluv_s = base_hsluv_s;
// red.hsluv_l = base_hsluv_l;
// red.hsluvToHex();

// const orange = new Hsluv();
// orange.hsluv_h = base_h + 30;
// orange.hsluv_s = base_hsluv_s;
// orange.hsluv_l = base_hsluv_l;
// orange.hsluvToHex();

// const yellow = new Hsluv();
// yellow.hsluv_h = base_h + 60;
// yellow.hsluv_s = base_hsluv_s;
// yellow.hsluv_l = base_hsluv_l;
// yellow.hsluvToHex();

// const chartreuse = new Hsluv();
// chartreuse.hsluv_h = base_h + 90;
// chartreuse.hsluv_s = base_hsluv_s;
// chartreuse.hsluv_l = base_hsluv_l;
// chartreuse.hsluvToHex();

// const green = new Hsluv();
// green.hsluv_h = base_h + 120;
// green.hsluv_s = base_hsluv_s;
// green.hsluv_l = base_hsluv_l;
// green.hsluvToHex();

// const springgreen = new Hsluv();
// springgreen.hsluv_h = base_h + 150;
// springgreen.hsluv_s = base_hsluv_s;
// springgreen.hsluv_l = base_hsluv_l;
// springgreen.hsluvToHex();

// const cyan = new Hsluv();
// cyan.hsluv_h = base_h + 180;
// cyan.hsluv_s = base_hsluv_s;
// cyan.hsluv_l = base_hsluv_l;
// cyan.hsluvToHex();

// const azure = new Hsluv();
// azure.hsluv_h = base_h + 210;
// azure.hsluv_s = base_hsluv_s;
// azure.hsluv_l = base_hsluv_l;
// azure.hsluvToHex();

// const blue = new Hsluv();
// blue.hsluv_h = base_h + 240;
// blue.hsluv_s = base_hsluv_s;
// blue.hsluv_l = base_hsluv_l;
// blue.hsluvToHex();

// const violet = new Hsluv();
// violet.hsluv_h = base_h + 270;
// violet.hsluv_s = base_hsluv_s;
// violet.hsluv_l = base_hsluv_l;
// violet.hsluvToHex();

// const magenta = new Hsluv();
// magenta.hsluv_h = base_h + 300;
// magenta.hsluv_s = base_hsluv_s;
// magenta.hsluv_l = base_hsluv_l;
// magenta.hsluvToHex();

console.log({
  red: hsluvToHex(0),
  orange: hsluvToHex(30),
  yellow: hsluvToHex(60),
  chartreuse: hsluvToHex(90),
  green: hsluvToHex(120),
  springgreen: hsluvToHex(150),
  cyan: hsluvToHex(180),
  azure: hsluvToHex(210),
  blue: hsluvToHex(240),
  violet: hsluvToHex(270),
  magenta: hsluvToHex(300),
  rose: hsluvToHex(330),
});

const colors = {
  default: ["#3daee9", "#232629"],

  red: [hsluvToHex(0), "#000000"],
  orange: [hsluvToHex(30), "#000000"],
  yellow: [hsluvToHex(60), "#000000"],
  chartreuse: [hsluvToHex(90), "#000000"],
  green: [hsluvToHex(120), "#000000"],
  springgreen: [hsluvToHex(150), "#000000"],
  cyan: [hsluvToHex(180), "#000000"],
  azure: [hsluvToHex(210), "#000000"],
  blue: [hsluvToHex(240), "#000000"],
  violet: [hsluvToHex(270), "#000000"],
  magenta: [hsluvToHex(300), "#000000"],
  rose: [hsluvToHex(330), "#000000"],

  grey: ["#a7afb4", "#000000"], //+
};

const actionsSpecial = {
  documents: {},
  download: {},
  pictures: {},
  sound: {},
  videos: {},
  games: {},
  book: {},
  comic: {},
  presentation: {},
  chart: {},
  calculate: {},
  text: {},
  bookmark: {},
  mail: {},
  notes: {},
  table: {},
  print: {},

  desktop: {},

  cloud: {},
  gdrive: {},
  network: {},
  publicshare: {},
};

const actionsDev = {
  build: {},
  script: {},
  html: {},
  git: {},
  database: {},
  log: {},
  development: {},
  language: {},

  mac: {},
  windows: {},
  android: { replaceColors: ["#9bd916"] },
};
const actionsAdditional = {
  important: { replaceColors: ["#da4453", "#eb0a42"] },
  activities: {},
  favorites: {},
  "image-people": {},

  trash: { replaceColors: ["#3bad7e"] },
  tar: {},
  drawing: {},
  paint: {},
  podcast: { replaceColors: ["#f89406"] },
  design: {},
  library: {},

  root: {},
  temp: {},
  templates: {},

  sign: {},
  locked: {},
  unlocked: {},
};

const actions = {
  ...actionsSpecial,
  ...actionsDev,
  ...actionsAdditional,
};

const links = {
  downloads: "download",
  image: "pictures",
  images: "pictures",
  picture: "pictures",
  photo: "pictures",
  music: "sound",
  public: "publicshare",
  remote: "html",
  txt: "text",
  video: "videos",
  recent: "temp",
  home: "user-home",
  network: "network-workgroup",
};

const linksCopies = {
  "network-workgroup": "network-workgroup",
  "user-home": "user-home",
};

const templates = [
  ...new Set([
    ...Object.keys(actions),
    ...Object.keys(linksCopies),
    ...Object.values(links),
    "",
  ]),
];

const fn = async (iconsDir, iconsOutDir) => {
  for (const size of iconSizes) {
    if (existsSync(`${iconsDir}/${size}`)) {
      try {
        await mkdirp(`${iconsOutDir}/${size}`);
      } catch (error) {
        console.log(error);
        console.log("mkdirp error");
      }

      for (const [path, target] of Object.entries(linksCopies)) {
        try {
          await unlink(`${iconsOutDir}/${size}/folder-${path}.svg`);
        } catch {
          // console.log(err)
        }

        try {
          await symlink(
            `${target}.svg`,
            `${iconsOutDir}/${size}/folder-${path}.svg`
          );
        } catch {
          // console.log(err)
        }
      }
    }
  }

  for (const color of Object.keys(colors)) {
    for (const size of smallIconSizes) {
      for (const template of templates) {
        try {
          if (color === "default") {
            let svg = await readFile(
              `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
              "utf8"
            );

            if (actions[template].replaceColors.length > 0) {
              svg = svg.replaceAll(
                `fill:${actions[template].replaceColors[0]}`,
                'fill:currentColor" class="ColorScheme-Text'
              );
            }

            if (actions[template].replaceColors.length > 1) {
              svg = svg.replaceAll(
                `fill:${actions[template].replaceColors[1]}`,
                'fill:currentColor" class="ColorScheme-Text'
              );
            }

            await writeFile(
              `${iconsOutDir}/${size}/folder${
                template ? `-${template}` : ""
              }.svg`,
              svg
            );
          } else {
            let svg = await readFile(
              `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
              "utf8"
            );

            let style = `
  <style type="text/css" >
   .ColorText {
      color:${colors[color][0]};
    }
  </style>
`;

            svg = svg.replaceAll(
              '<style type="text/css" id="current-color-scheme">',
              `${style}\n    <style type="text/css" id="current-color-scheme">`
            );
            svg = svg.replaceAll(
              '<style id="current-color-scheme" type="text/css">',
              `${style}\n    <style type="text/css" id="current-color-scheme">`
            );

            svg = svg.replaceAll(
              'class="ColorScheme-Text"',
              'class="ColorText"'
            );
            svg = svg.replaceAll(
              'class="ColorScheme-Highlight"',
              'class="ColorHighlight"'
            );

            await writeFile(
              `${iconsOutDir}/${size}/folder-${color}${
                template ? `-${template}` : ""
              }.svg`,
              svg
            );
          }
        } catch {
          // console.log(error)
        }
      }
    }

    for (const size of largeIconSizes) {
      if (existsSync(`${iconsDir}/${size}`)) {
        for (const template of templates) {
          try {
            let svg = await readFile(
              `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
              "utf8"
            );

            if (color === "default") {
              svg = svg.replaceAll(
                `fill="#3daee9"`,
                'style="fill:currentColor" class="ColorScheme-Highlight"'
              );

              if (actions[template].replaceColors.length > 0) {
                svg = svg.replaceAll(
                  `fill="${actions[template].replaceColors[0]}"`,
                  'style="fill:currentColor" class="ColorScheme-Highlight"'
                );

                svg = svg.replaceAll(
                  `"fill:${actions[template].replaceColors[0]}"`,
                  '"fill:currentColor" class="ColorScheme-Highlight"'
                );
              }

              if (actions[template].replaceColors.length > 1) {
                svg = svg.replaceAll(
                  `"fill:${actions[template].replaceColors[1]}"`,
                  '"fill:currentColor" class="ColorScheme-Highlight"'
                );
              }

              await writeFile(
                `${iconsOutDir}/${size}/folder${
                  template ? `-${template}` : ""
                }.svg`,
                svg
              );
            } else {
              let style = `
  <style type="text/css" >
  ${
    colors[color][1] !== "default"
      ? `
    .ColorText {
      color:${colors[color][1]};
    }`
      : ""
  }

    .ColorHighlight {
      color:${colors[color][0]};
    }
  </style>
`;

              svg = svg.replaceAll(
                `fill="#3daee9"`,
                'style="fill:currentColor" class="ColorScheme-Highlight"'
              );

              svg = svg.replaceAll(
                '<style type="text/css" id="current-color-scheme">',
                `${style}\n    <style type="text/css" id="current-color-scheme">`
              );
              svg = svg.replaceAll(
                '<style id="current-color-scheme" type="text/css">',
                `${style}\n    <style type="text/css" id="current-color-scheme">`
              );

              if (colors[color][1] !== "default") {
                svg = svg.replaceAll(
                  'class="ColorScheme-Text"',
                  'class="ColorText"'
                );
              }

              svg = svg.replaceAll(
                'class="ColorScheme-Highlight"',
                'class="ColorHighlight"'
              );

              await writeFile(
                `${iconsOutDir}/${size}/folder-${color}${
                  template ? `-${template}` : ""
                }.svg`,
                svg
              );
            }
          } catch {
            // console.log(err)
          }
        }
      }
    }

    for (const size of iconSizes) {
      for (const [path, target] of Object.entries(links)) {
        if (color !== "default") {
          try {
            await unlink(`${iconsOutDir}/${size}/folder-${color}-${path}.svg`);
          } catch {
            // console.log(err)
          }

          try {
            await symlink(
              `folder-${color}-${target}.svg`,
              `${iconsOutDir}/${size}/folder-${color}-${path}.svg`
            );
          } catch {
            // console.log(err)
          }
        }
      }
    }
  }
};

await fn(iconsDirs[0], iconsOutDirs[0]);
await fn(iconsDirs[1], iconsOutDirs[1]);

const generateDesktopFiles = async () => {
  const colorNames = Object.keys(colors).filter((color) => color !== "default");
  const actionsNames = Object.keys(actions);

  let desktopFileColors = `[Desktop Entry]
Type=Service
MimeType=inode/directory
Actions=${colorNames
    .map((color, index) => `action${`${index}`.padStart(2, "0")};`)
    .join("")}_SEPARATOR_;noColor;
X-KDE-StartupNotify=false
X-KDE-Submenu=Change Color
Icon=folder-green


[Desktop Action noColor]
Name=No Color
Icon=folder
Exec=change-folder-icon color "" %U
`;

  desktopFileColors += colorNames
    .map(
      (color, index) => `
[Desktop Action action${`${index}`.padStart(2, "0")}]
Name=${titleCase(color.replaceAll("-", " "), { pascalCase: true })}
Icon=folder-${color}
Exec=change-folder-icon color ${color} %U
`
    )
    .join("");

  //

  let desktopFileActions = `[Desktop Entry]
Type=Service
MimeType=inode/directory
Actions=${actionsNames
    .map((action, index) => `action${`${index}`.padStart(2, "0")};`)
    .join("")}_SEPARATOR_;noLabel;
X-KDE-StartupNotify=false
X-KDE-Submenu=Change Label
Icon=folder-bookmark


[Desktop Action noLabel]
Name=No Label
Icon=folder
Exec=change-folder-icon label "" %U
`;

  desktopFileActions += actionsNames
    .map(
      (action, index) => `
[Desktop Action action${`${index}`.padStart(2, "0")}]
Name=${titleCase(action.replaceAll("-", " "), { pascalCase: true })}
Icon=folder-${action}
Exec=change-folder-icon label ${action} %U
`
    )
    .join("");

  //

  await writeFile("change-color.desktop", desktopFileColors);
  await writeFile("change-label.desktop", desktopFileActions);
};

await generateDesktopFiles();
