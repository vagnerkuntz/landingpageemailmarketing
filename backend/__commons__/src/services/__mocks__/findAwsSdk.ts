import path from "path";
import fs from "fs";

function findAwsSdk(currentPath: string): string {
  const sdkPath = path.join(currentPath, '__commons__', 'node_modules', 'aws-sdk')
  if (fs.existsSync(sdkPath)) {
    return sdkPath
  } else {
    return findAwsSdk(path.join(currentPath, '..'))
  }
}

export default findAwsSdk