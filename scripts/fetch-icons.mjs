import path from 'node:path';
import { writeFile } from 'node:fs/promises';

const icons = [
  'lucide:heading-1',
  'lucide:heading-2',
  'lucide:heading-3',

  'material-symbols:search-rounded',
  'material-symbols:close-rounded',
  'material-symbols:list',

  'mi:warning',

  'ri:double-quotes-r',

  'ic:outline-add',
  'ic:outline-info',
  'ic:baseline-arrow-back',
  'ic:round-keyboard-return',
  'ic:outline-folder',
  'ic:baseline-more-vert',
  'ic:baseline-format-bold',
  'ic:baseline-format-italic',
  'ic:baseline-code',
  'ic:baseline-link',
  'ic:baseline-check',
];

const svgDir = path.join(process.cwd(), 'assets', 'svg');
const iconifyApi = 'https://api.simplesvg.com';

async function main() {
  const groups = icons.reduce((acc, icon) => {
    const [prefix, name] = icon.split(':');

    acc[prefix] ||= [];
    acc[prefix].push(name);

    return acc;
  }, {});

  let promises = [];

  for (const group of Object.keys(groups)) {
    const icons = groups[group].join(',');
    const url = `${iconifyApi}/${group}.json?icons=${icons}`;

    promises.push(fetch(url).then((res) => res.json()));
  }

  /**
   * @type {{prefix:string,width:number,height:number,icons: {} }[]}
   */
  const data = await Promise.all(promises);

  promises = [];

  for (const res of data) {
    const svgProps = getSvgProps(res);

    for (const [icon, { body }] of Object.entries(res.icons)) {
      const svg = `<svg ${svgProps}>${body}</svg>`;

      promises.push(
        writeFile(getSvgPath(icon), svg),
      );
    }
  }

  await Promise.all(promises);
}

main();

function getSvgProps(props) {
  const attrs = [
    'xmlns="http://www.w3.org/2000/svg"',
    'xmlns:xlink="http://www.w3.org/1999/xlink"',
    'aria-hidden="true"',
    'role="img"',
    'width="1em"',
    'height="1em"',
    'class="icon"',
    `viewBox="0 0 ${props.width} ${props.height}"`,
  ];

  return attrs.join(' ');
}

function getSvgPath(iconName) {
  return path.join(svgDir, `${iconName}.svg`);
}
