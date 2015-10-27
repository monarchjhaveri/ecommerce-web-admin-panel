var srcRootFolder = __dirname + "/../../frontend";
var destRootFolder = __dirname + "/../../public";

module.exports = {
    filepaths: {
        root: {
            src: srcRootFolder,
            dest: destRootFolder
        },
        javascript: {
            entryFile: srcRootFolder + "/javascript/main.js",
            destinationFile: destRootFolder + "/bundle.js"
        },
        html: {
            src: __dirname + "/../../frontend/index.html"
        }
    }
};