const core = require('@actions/core');
const fs = require('fs');

async function run() {
  try {
    const feedUrl = core.getInput('feed-url');
    const personalAccessToken = core.getInput('personal-access-token');
    const isWindows = core.getInput('is-windows');

    fileContents = `registry=https://www.myget.org/F/ed-fi/npm/
    //www.myget.org/F/ed-fi/npm/:_authToken=${personalAccessToken}
`;

    var filePath = `${process.env.HOME}/.npmrc`;

    if (isWindows) {
      `${process.env.USERPROFILE}\\.npmrc`;
    }

    fs.writeFile(filePath, fileContents, err => { if(err) throw err; });

  } catch (error) {
    setFailed(error.message);
  }
};

run();
