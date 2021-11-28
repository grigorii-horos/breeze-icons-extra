/* eslint-disable no-await-in-loop, no-restricted-syntax */
import mkdirp from "mkdirp";
import { existsSync } from "node:fs";
import {
  readFile,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";

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

const baseColors = ["#3daee9", "#232629"];

const colors = {
  default: ["#3daee9", "#232629"],

  black: ["#333333", "#d1d0d1"],
  blue: ["#4183d7", "#333659"],
  brown: ["#8b6039", "#eff0c1"],
  cyan: ["#21bbd7", "#233639"],
  green: ["#3bad7e", "#204024"],
  grey: ["#a7afb4", "#232629"],
  magenta: ["#b5006a", "#331e39"],
  orange: ["#f89406", "#433629"],
  red: ["#eb0a42", "#432629"],
  violet: ["#8e44ad", "#ffc0f1"],
  yellow: ["#f2cb40", "#636629"],
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
          `${iconsOutDir}/${size}/folder-${path}.svg`
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
          if (color === "default") {
            let svg = await readFile(
              `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
              "UTF-8"
            );

            svg = svg.replaceAll(
              `"fill:#da4453"`,
              `"fill:currentColor" class="ColorScheme-Text"`
            );

            await writeFile(
              `${iconsOutDir}/${size}/folder${
                template ? `-${template}` : ""
              }.svg`,
              svg
            );

            continue;
          }

          let svg = await readFile(
            `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
            "UTF-8"
          );

          const newColor = colors[color][0];
          svg = svg.replaceAll("#232629", newColor);
          svg = svg.replaceAll("#eff0f1", newColor);

          svg = svg.replaceAll("ColorScheme-Text", "ctn");
          svg = svg.replaceAll('id="current-color-scheme"', "");

          await writeFile(
            `${iconsOutDir}/${size}/folder-${color}${
              template ? `-${template}` : ""
            }.svg`,
            svg
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
          if (color === "default") {
            let svg = await readFile(
              `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
              "UTF-8"
            );

            svg = svg.replaceAll(
              `"fill:#eb0a42"`,
              `"fill:currentColor" class="ColorScheme-Highlight"`
            );


            await writeFile(
              `${iconsOutDir}/${size}/folder${
                template ? `-${template}` : ""
              }.svg`,
              svg
            );

            continue;
          }

          let svg = await readFile(
            `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
            "UTF-8"
          );

          svg = svg.replaceAll(baseColors[0], colors[color][0]);
          svg = svg.replaceAll(baseColors[1], colors[color][1]);

          svg = svg.replaceAll("ColorScheme-Text", "ctn");
          svg = svg.replaceAll("ColorScheme-Highlight", "chn");
          svg = svg.replaceAll('id="current-color-scheme"', "");


          await writeFile(
            `${iconsOutDir}/${size}/folder-${color}${
              template ? `-${template}` : ""
            }.svg`,
            svg
          );
        } catch {
          // console.log(err)
        }
      }
    }

    for (const size of iconSizes) {
      for (const [path, target] of Object.entries(links)) {
        if (color === "default") {
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
            `${iconsOutDir}/${size}/folder-${color}-${path}.svg`
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
