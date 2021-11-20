/* eslint-disable no-await-in-loop, no-restricted-syntax */
import mkdirp from "mkdirp";
import { existsSync } from "node:fs";
import {
  copyFile,
  readFile,
  symlink,
  unlink,
  writeFile,
} from "node:fs/promises";
import { optimize } from "svgo";

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

const baseColors = ["#3daee9"];

const colors = {
  default: ['#3daee9'],
  blue: ["#4183d7"],
  cyan: ["#21bbd7"],

  green: ["#3bad7e"],
  yellow: ["#f2cb40"],

  red: ["#eb0a42"],
  violet: ["#8e44ad"],
  magenta: ["#b5006a"],

  orange: ["#f89406"],
  brown: ["#8b6039"],

  grey: ["#a7afb4"],
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
          let svg = await readFile(
            `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
            "UTF-8"
          );
          const newColor = colors[color][0];

          svg = svg.replaceAll("#232629", colors[color][0]);
          svg = svg.replaceAll("#eff0f1", colors[color][0]);

          svg = svg.replaceAll(
            "ColorScheme-Highlight",
            `ColorScheme-Highlight-new`
          );
          svg = svg.replaceAll("ColorScheme-Text", `ColorScheme-Text-new`);

          svg = svg.replaceAll("fill:#da4453", `fill:${newColor}`);

          svg = optimize(svg, {
            path: `${iconsOutDir}/${size}/folder${color !=='default' ? `-${color}` : ""}${
              template ? `-${template}` : ""
            }.svg`,
            multipass: true,
            // plugins: ["convertStyleToAttrs", "convertPathData"],
          }).data;

          await writeFile(
            `${iconsOutDir}/${size}/folder${color !=='default' ? `-${color}` : ""}${
              template ? `-${template}` : ""
            }.svg`,
            svg
          );
        } catch(error) {
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
          let svg = await readFile(
            `${iconsDir}/${size}/folder${template ? `-${template}` : ""}.svg`,
            "UTF-8"
          );

          svg = svg.replaceAll(
            "ColorScheme-Highlight",
            `ColorScheme-Highlight-new`
          );
          svg = svg.replaceAll("ColorScheme-Text", `ColorScheme-Text-new`);
          svg = svg.replaceAll("fill:#eb0a42", `fill:${colors[color][0]}`);

          svg = svg.replaceAll(baseColors[0], colors[color][0]);
          // svg = svg.replaceAll(baseColors[1], colors[color][1]);
          // svg = svg.replaceAll(baseColors[2], colors[color][2]);
          // svg = svg.replaceAll(baseColors[3], colors[color][3]);
          svg = optimize(svg, {
            path: `${iconsOutDir}/${size}/folder-${color}${
              template ? `-${template}` : ""
            }.svg`,
            multipass: true,
            // plugins: ["convertStyleToAttrs", "convertPathData"],
          }).data;

          await writeFile(
            `${iconsOutDir}/${size}/folder${color !=='default' ? `-${color}` : ""}${
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
        try {
          await unlink(`${iconsOutDir}/${size}/folder${color !=='default' ? `-${color}` : ""}-${path}.svg`);
        } catch {
          // console.log(err)
        }

        try {
          await symlink(
            `folder${color !=='default' ? `-${color}` : ""}-${target}.svg`,
            `${iconsOutDir}/${size}/folder${color !=='default' ? `-${color}` : ""}-${path}.svg`
          );
        } catch {
          // console.log(err)
        }
      }
    }
  }
};

fn(iconsDirs[0], iconsOutDirs[0]);
// fn(iconsDirs[1], iconsOutDirs[1]);
