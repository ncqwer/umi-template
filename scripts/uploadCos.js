const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const path = require('path');
const pAll = require('p-all');

const fsp = fs.promises;

const SECRETID = process.env.COS_SECRETID;
const SECRETKEY = process.env.COS_SECRETKEY;
const REGION = process.env.COS_REGION;
const BUCKET = process.env.COS_BUCKET;
const COMMIT_REF_NAME = process.env.COMMIT_REF_NAME;

const promisify = (fn, ...args) =>
  new Promise((res, rej) =>
    fn(...args, (err, data) => {
      if (data) {
        return res(data);
      } else {
        return rej(err);
      }
    }),
  );

const getAllFileInDir = async () => {
  const temp = [];
  const add = (v) => temp.push(v);
  await readDir('dist');
  return temp;
  async function readDir(target, prefixs = []) {
    const _prefixs = prefixs.concat(target);
    const dirs = await fsp.readdir(path.resolve(..._prefixs), {
      withFileTypes: true,
    });
    await dirs.map(async (dir) => {
      if (dir.isDirectory()) {
        await readDir(dir.name, _prefixs);
        return;
      }
      add(_prefixs.concat(dir.name));
    });
  }
};

const uploadFile = async (paths, cos) => {
  if (paths.length === 0) return;
  const filePath = path.resolve(...paths);
  if (path.extname(filePath) === '.html') return;

  const option = {
    Bucket: BUCKET,
    Region: REGION,
    Key: [COMMIT_REF_NAME].concat(paths.slice(1)).join('/'),
    /* 当Body为stream类型时，ContentLength必传，否则onProgress不能返回正确的进度信息 */
    Body: fs.createReadStream(filePath),
    ContentLength: fs.statSync(filePath).size,
    // filePath,
  };
  console.log({
    Bucket: BUCKET,
    Region: REGION,
  });
  await promisify(cos.putObject.bind(cos), option);
};

const main = async () => {
  const cos = new COS({
    SecretId: SECRETID,
    SecretKey: SECRETKEY,
  });
  // const data = await promisify(cos.headBucket.bind(cos), {
  //   Bucket: BUCKET,
  //   Region: REGION,
  // });
  const files = await getAllFileInDir();
  await pAll(
    files.map((v) => () => uploadFile(v, cos)),
    { concurrency: 1 },
  );
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
