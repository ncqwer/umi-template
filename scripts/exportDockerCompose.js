const fsp = require('fs').promises;

const reg = /\$\$(\S+?)\$\$/g;

const main = async () => {
  const envContent = await fsp.readFile('./docker-compose.example.yml', {
    encoding: 'utf-8',
  });
  const newContent = envContent.replace(reg, (raw, key) => {
    const v = process.env[key];

    return v || raw;
  });
  await fsp.writeFile('./docker-compose.yml', newContent, {
    encoding: 'utf-8',
  });
  // console.log(`::set-ouput name=content::${newContent}`);
  // console.log(`::set-ouput name=dir::${dir}`);
  // const
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
