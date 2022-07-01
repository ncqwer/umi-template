const fsp = require('fs').promises;

const reg = /\$\$(\S+?)\$\$/g;

const main = async () => {
  const envContent = await fsp.readFile('.env.example', {
    encoding: 'utf-8',
  });
  const newContent = envContent.replace(reg, (raw, key) => {
    const v = process.env[key];

    // if (v && key === 'COMMIT_REF_NAME') {
    //   // if (v === 'main' || v === 'master') return '';
    //   return `${v}/`;
    // }
    return v || raw;
  });
  await fsp.writeFile('.env', newContent, { encoding: 'utf-8' });
  // const
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
