import { writeFile } from 'node:fs/promises';
import path from 'node:path';

const icons = [
  'ic:baseline-arrow-back',
  'ic:baseline-check',
  'ic:baseline-code',
  'ic:baseline-format-bold',
  'ic:baseline-format-italic',
  'ic:baseline-keyboard-command-key',
  'ic:baseline-link',
  'ic:baseline-more-vert',
  'material-symbols:close-rounded',
  'ri:double-quotes-r',
  'lucide:heading-1',
  'lucide:heading-2',
  'lucide:heading-3',
  'material-symbols:format-ink-highlighter',
  // 'ion:information-sharp',
  'material-symbols:info-outline',
  'material-symbols:list',
  'material-symbols:menu-rounded',
  'ic:outline-add',
  'ic:outline-folder',
  'ic:round-chevron-right',
  'ic:round-keyboard-return',
  'material-symbols:search-rounded',
  'material-symbols:format-strikethrough',
  'mi:warning',
];

const svgDir = path.join(process.cwd(), 'public', 'svg');
const iconifyApi = 'https://api.simplesvg.com';

async function main() {
  const groups = icons.reduce((acc, icon) => {
    const [prefix, name] = icon.split(':');

    acc[prefix] ||= [];
    acc[prefix].push(name);

    return acc;
  }, {});

  await Promise.all(Object.keys(groups).map(async (group) => {
    const icons = groups[group].join(',');
    const url = `${iconifyApi}/${group}.json?icons=${icons}`;

    /** @type {{prefix:string,width:number,height:number,icons: {} }} */
    const data = await fetch(url).then((res) => res.json());
    console.log('fetched group', group);

    const svgProps = getSvgProps(data);

    await Promise.all(Object.entries(data.icons).map(async ([icon, { body }]) => {
      const svg = `<svg ${svgProps}>${body}</svg>`;

      await writeFile(getSvgPath(icon), svg);

      console.log('wrote icon', `${group}:${icon}`);
    }));
  }));
}

main();

function getSvgProps(props) {
  const attrs = [
    'id="fragment"',
    'version="1.1"',
    'xmlns="http://www.w3.org/2000/svg"',
    `viewBox="0 0 ${props.width} ${props.height}"`,
  ];

  return attrs.join(' ');
}

function getSvgPath(iconName) {
  return path.join(svgDir, `${iconName}.svg`);
}
