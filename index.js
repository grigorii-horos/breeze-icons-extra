/* eslint-disable no-await-in-loop, no-restricted-syntax */
import { readFile, symlink, unlink, writeFile } from "node:fs/promises";

const iconsDirs = [
  "./breeze-icons/icons/places",
  "./breeze-icons/icons-dark/places",
];

const smallIconSizes = ["16", "22"];
const largeIconSizes = ["32", "48", "64", "96"];
const iconSizes = [...smallIconSizes, ...largeIconSizes];

const baseColors = ["#3daee9", "#6cc1ef", "#147eb8", "#1272a5"];

const colors = {
  blue: ["#4183d7", "#5b94df", "#2059a3", "#1d4f91"],
  cyan: ["#21bbd7", "#3dc8e1", "#13788a", "#116d7e"],

  green: ["#3bad7e", "#45cc87", "#069061", "#057f57"],
  yellow: ["#f2cb40", "#f5d76e", "#a77403", "#916403"],

  red: ["#eb0a42", "#f62459", "#9a052a", "#8b0426"],
  violet: ["#8e44ad", "#9d52bd", "#693081", "#612c77"],

  orange: ["#f89406", "#faa938", "#a3660d", "#925c0c"],
  brown: ["#8b6039", "#996e45", "#664629", "#5b3f24"],

  grey: ["#a7afb4", "#bdc3c7", "#6e6e6e", "#636363"],
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
        const newColor = colors[color][0];

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

        svg = svg.replaceAll(baseColors[0], colors[color][0]);
        svg = svg.replaceAll(baseColors[1], colors[color][1]);
        svg = svg.replaceAll(baseColors[2], colors[color][2]);
        svg = svg.replaceAll(baseColors[3], colors[color][3]);

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
