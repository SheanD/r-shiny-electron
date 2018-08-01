// A hook to only retain one relevant R distrubtion per platform

const {remove} = require('fs-extra')
const path = require('path')

const tryRemove = async (path) => {
  try {
    await remove(path)
  } catch (e) {
    console.error(e)
  }
}

module.exports = async (buildPath, _electronVersion, platform, _arch, callback) => {
  const rMacPath = path.join(buildPath, 'r-mac')
  const rWinPath = path.join(buildPath, 'r-win')
  if (platform === 'darwin') {
    await tryRemove(rWinPath)
  } else if (platform === 'win32') { 
    await tryRemove(rMacPath)
  } else {
    throw new Error('Platform is not supported')
  }
  const filesToDelete = ['prune-r.js',
                         'get-r-mac.sh',
                         'get-r-win.sh',
                         'Dockerfile',
                         'add-cran-binary-pkgs.R']
  const deleteAllFiles = filesToDelete.map((f) => path.join(buildPath, f)).map(tryRemove)
  await Promise.all(deleteAllFiles)
  callback()
}