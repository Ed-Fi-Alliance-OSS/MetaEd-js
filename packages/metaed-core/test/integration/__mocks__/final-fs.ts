function sortFiles(a, b) {
  const pathA = a.path.toUpperCase();
  const pathB = b.path.toUpperCase();
  if (pathA < pathB) {
    return -1;
  }
  if (pathA > pathB) {
    return 1;
  }
  return 0;
}

const ffs: any = jest.genMockFromModule('final-fs');

const mockFiles: any[] = [];

ffs.addMockFile = (mockFile) => {
  mockFiles.push(mockFile);
};

ffs.clearMockFiles = () => {
  mockFiles.length = 0;
};

ffs.readdirRecursiveSync = () => mockFiles.sort(sortFiles).map((file) => file.path);

ffs.readFileSync = (fileToReadPath) => {
  const returnFile: any = mockFiles.find((f) => f.path === fileToReadPath);
  if (returnFile) return returnFile.content;
  return undefined;
};

export default ffs;
