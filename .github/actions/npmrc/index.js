const core = require('@actions/core');
const fs = require('fs');

async function run() {
  try {
    console.log('111111111111111111111');
    const feedUrl = core.getInput('feed-url');
    console.log('2222222222222222222222');
    const personalAccessToken = core.getInput('personal-access-token');
    console.log('3333333333333333333333');
    const isWindows = core.getInput('is-windows');
    console.log('4444444444444444444444444');

    fileContents = `registry=https://www.myget.org/F/ed-fi/npm/
    //www.myget.org/F/ed-fi/npm/:_authToken=${personalAccessToken}
`;
    console.log('5555555555555555555555555');

    var filePath = `${process.env.HOME}/.npmrc`;

    if (isWindows) {
      `${process.env.USERPROFILE}\\.npmrc`;
    }

    console.log('666666666666666666666666666666666');
    fs.writeFile(filePath, fileContents, err => { if(err) throw err; });
    console.log('77777777777777777777777777');
  } catch (error) {
    setFailed(error.message);
  }
};

run();
