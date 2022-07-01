const COS = require('cos-nodejs-sdk-v5');

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

const createRemoveAll = (cos) => {
  const removeAll = async (marker) => {
    const { NextMarker, Contents } = await promisify(cos.getBucket.bind(cos), {
      Bucket: BUCKET /* 填入您自己的存储桶，必须字段 */,
      Region: REGION /* 存储桶所在地域，例如ap-beijing，必须字段 */,
      Prefix: `${COMMIT_REF_NAME}/`,
      Marker: marker,
      MaxKeys: 1000,
    });
    const objs = Contents.map((v) => ({ Key: v.Key }));
    const { IsTruncated } = await promisify(
      cos.deleteMultipleObject.bind(cos),
      {
        Bucket: BUCKET /* 填入您自己的存储桶，必须字段 */,
        Region: REGION /* 存储桶所在地域，例如ap-beijing，必须字段 */,
        Objects: objs,
      },
    );
    if (IsTruncated === 'true') {
      await removeAll(NextMarker);
    }
  };
  return removeAll;
};

const main = async () => {
  const cos = new COS({
    SecretId: SECRETID,
    SecretKey: SECRETKEY,
  });
  const fn = createRemoveAll(cos);
  await fn();
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
