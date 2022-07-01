const child_process = require('child_process');

const COMMIT_REF_NAME = process.env.COMMIT_REF_NAME;
const DOCKERHUB_USERNAME = process.env.DOCKERHUB_USERNAME;
const PROJECT_NAME = process.env.PROJECT_NAME;

const main = async () => {
  const tagName = `${DOCKERHUB_USERNAME}/${PROJECT_NAME}:${COMMIT_REF_NAME}`;

  await new Promise((res, rej) =>
    child_process.exec(`docker build -t ${tagName} .`, (error, stdout) => {
      if (error) {
        rej(error);
        return;
      }
      res(stdout);
    }),
  );

  await new Promise((res, rej) =>
    child_process.exec(`docker push ${tagName}`, (error, stdout) => {
      if (error) {
        rej(error);
        return;
      }
      res(stdout);
    }),
  );
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
