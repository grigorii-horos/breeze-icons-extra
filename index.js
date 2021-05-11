/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Color from "color";
import memoizee from "memoizee";
import mkdirp from "mkdirp";
import { copyFile, readFile, symlink, writeFile } from "node:fs/promises";

const iconsDirs = [
  "./.icons/icons/places",
  "./.icons/icons-dark/places",
];
const iconsOutDirs = ["./tmp/icons/places", "./tmp/icons-dark/places"];

const justCopy = ["16", "22"];
const transform = ["32", "48", "64", "96"];

const basecolor = "#3daee9";

const colors = {
  blue: {},

  cyan: { rotate: 345, saturate: 0.2, darken: 0.2 },
  teal: { rotate: 340, desaturate: 0.3, darken: 0.15 },

  green: { rotate: 300, desaturate: 0.3, darken: 0.2 },

  yellow: { rotate: 210, saturate: 0.15, darken: 0.1 },
  orange: { rotate: 190, saturate: 0.5, darken: 0.15 },
  brown: { rotate: 190, desaturate: 0.3, darken: 0.1 },

  violet: { rotate: 80, desaturate: 0.1, darken: 0 },
  magenta: { rotate: 110, saturate: 0.25, darken: 0.3 },

  red: { rotate: 145, saturate: 0.15, darken: 0.2 },

  grey: { desaturate: 1 },

  // black: { desaturate: 1, darken: 0.5 },
  // white: { desaturate: 1, lighten: 1 },
};

const templates = [
  "activities",
  "bookmark",
  "cloud",
  "development",
  "documents",
  "download",
  "favorites",
  "games",
  "gdrive",
  "html",
  "image-people",
  "important",
  "locked",
  "mail",
  "network",
  "open",
  "pictures",
  "print",
  "publicshare",
  "root",
  "script",
  "sound",
  "tar",
  "templates",
  "temp",
  "text",
  "unlocked",
  "videos",

  "",
];

const links = {
  downloads: "download",
  dropbox: "cloud",
  image: "pictures",
  images: "pictures",
  music: "sound",
  onedrive: "cloud",
  owncloud: "cloud",
  picture: "pictures",
  public: "publicshare",
  recent: "temp",
  remote: "html",
  txt: "text",
  video: "videos",
};

const genColor = memoizee((color, initialColor) => {
  let newColor = Color(initialColor);
  if (colors[color].rotate) {
    newColor = newColor.rotate(colors[color].rotate);
  }

  if (colors[color].saturate) {
    newColor = newColor.saturate(colors[color].saturate);
  }
  if (colors[color].desaturate) {
    newColor = newColor.desaturate(colors[color].desaturate);
  }

  if (colors[color].lighten) {
    newColor = newColor.lighten(colors[color].lighten);
  }
  if (colors[color].darken) {
    newColor = newColor.darken(colors[color].darken);
  }

  newColor = newColor.hex();
  return newColor;
});

const fn = async (iconsDir, iconsOutDir) => {
  for (const size of [...justCopy, ...transform]) {
    try {
      await mkdirp(`${iconsOutDir}/${size}/`);
    } catch {}
  }

  for (const color of Object.keys(colors)) {
    for (const size of justCopy) {
      for (const template of templates) {
        let svg = await readFile(
          `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
          "UTF-8"
        );
        const newColor = genColor(color, basecolor);

        svg = svg.replaceAll("fill:currentColor", `fill:${newColor}`);
        svg = svg.replaceAll('fill="currentColor"', `fill="${newColor}"`);

        svg = svg.replaceAll(
          'fill:#da4453',
          `fill:${newColor}`
        );

        await writeFile(
          `${iconsOutDir}/${size}/folder-${color}${
            template ? `-${template}` : ""
          }.svg`,
          svg
        );
      }

      for (const [target, path] of Object.entries(links)) {
        try {
          await symlink(
            `folder-${color}${target ? `-${target}` : ""}.svg`,
            `${iconsOutDir}/${size}/folder-${color}${
              path ? `-${path}` : ""
            }.svg`
          );
        } catch {}
      }
    }

    for (const size of transform) {
      for (const template of templates) {
        let svg = await readFile(
          `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
          "UTF-8"
        );

        const colorsInFile = [...svg.matchAll(/#[\da-f]{3,6}/gi)].map(
          (item) => item[0]
        );

        for (const colorInFile of colorsInFile) {
          const newColor = genColor(color, colorInFile);

          svg = svg.replaceAll(colorInFile, newColor);
        }

        await writeFile(
          `${iconsOutDir}/${size}/folder-${color}${
            template ? `-${template}` : ""
          }.svg`,
          svg
        );
      }

      for (const [path, target] of Object.entries(links)) {
        try {
          await symlink(
            `folder-${color}${target ? `-${target}` : ""}.svg`,
            `${iconsOutDir}/${size}/folder-${color}${
              path ? `-${path}` : ""
            }.svg`
          );
        } catch {}
      }
    }
  }
};

fn(iconsDirs[0], iconsOutDirs[0]);
fn(iconsDirs[1], iconsOutDirs[1]);
