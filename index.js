/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
import Color from "color";
import memoizee from "memoizee";
import { readFile, symlink, unlink, writeFile } from "node:fs/promises";

const iconsDirs = [
  "./breeze-icons/icons/places",
  "./breeze-icons/icons-dark/places",
];

const smallIconSizes = ["16", "22"];
const largeIconSizes = ["32", "48", "64", "96"];
const iconSizes = [...smallIconSizes, ...largeIconSizes];

const basecolor = "#3daee9";

const colors = {
  blue: {},
  cyan: { rotate: 340, saturate: 0.15, darken: 0.2 },
  teal: { rotate: 325, desaturate: 0.3, darken: 0.15 },

  green: { rotate: 300, desaturate: 0.1, darken: 0.2 },
  yellow: { rotate: 210, saturate: 0.15, darken: 0.1 },
  orange: { rotate: 190, saturate: 0.5, darken: 0.15 },

  red: { rotate: 145, saturate: 0.15, darken: 0.2 },
  violet: { rotate: 80, desaturate: 0, darken: 0 },
  magenta: { rotate: 120, saturate: 0.25, darken: 0.3 },

  brown: { rotate: 210, desaturate: 0.7, darken: 0.15 },
  "grey-cyan": { rotate: 330, desaturate: 0.7, darken: 0.15 },
  "grey-violet": { rotate: 90, desaturate: 0.7, darken: 0.15 },
  grey: { desaturate: 1, darken: 0.1 },
};

const links = {
  downloads: "download",
  dropbox: "cloud",
  onedrive: "cloud",
  owncloud: "cloud",
  nextcloud: "cloud",
  "google-drive": "cloud",
  github: "script",
  gitlab: "script",
  git: "script",
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
};

const linksCopies = {
  "network-workgroup": "network-workgroup",
  "user-home": "user-home",
};

const templates = [
  ...new Set([
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
    ...Object.keys(linksCopies),
    ...Object.values(links),

    "",
  ]),
];

const genColor = memoizee((color, initialColor) => {
  if (
    initialColor === "#fff" ||
    initialColor === "#FFF" ||
    initialColor === "#FFFFFF" ||
    initialColor === "#ffffff"
  ) {
    return initialColor;
  }

  let newColor = Color(initialColor);

  if (colors[color].negate && colors[color].negate.includes("first")) {
    newColor = newColor.negate();
  }

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

  if (colors[color].negate && colors[color].negate.includes("last")) {
    newColor = newColor.negate();
  }

  newColor = newColor.hex();
  return newColor;
});

const fn = async (iconsDir, iconsOutDir) => {
  for (const size of iconSizes) {
    for (const [path, target] of Object.entries(linksCopies)) {
      try {
        await unlink(`${iconsDir}/${size}/folder-${path}.svg`);
      } catch {}

      try {
        await symlink(
          `${target}.svg`,
          `${iconsOutDir}/${size}/folder-${path}.svg`
        );
      } catch {}
    }
  }

  for (const color of Object.keys(colors)) {
    for (const size of smallIconSizes) {
      for (const template of templates) {
        let svg = await readFile(
          `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
          "UTF-8"
        );
        const newColor = genColor(color, basecolor);

        svg = svg.replaceAll("fill:currentColor", `fill:${newColor}`);
        svg = svg.replaceAll('fill="currentColor"', `fill="${newColor}"`);

        svg = svg.replaceAll("fill:#da4453", `fill:${newColor}`);

        await writeFile(
          `${iconsOutDir}/${size}/folder-${color}${
            template ? `-${template}` : ""
          }.svg`,
          svg
        );
      }
    }

    for (const size of largeIconSizes) {
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
    }

    for (const size of iconSizes) {
      for (const [path, target] of Object.entries(links)) {
        try {
          await unlink(`${iconsOutDir}/${size}/folder-${color}-${path}.svg`);
        } catch {}

        try {
          await symlink(
            `folder-${color}-${target}.svg`,
            `${iconsOutDir}/${size}/folder-${color}-${path}.svg`
          );
        } catch {}
      }
    }
  }
};

fn(iconsDirs[0], iconsDirs[0]);
fn(iconsDirs[1], iconsDirs[1]);
