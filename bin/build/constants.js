var srcRootFolder = __dirname + "/../../frontend";
var destRootFolder = __dirname + "/../../public";

module.exports = {
    filepaths: {
        root: {
            src: srcRootFolder,
            dest: destRootFolder
        },
        javascript: {
            entryFile: srcRootFolder + "/javascript/main.jsx",
            destinationFile: destRootFolder + "/bundle.js"
        },
        html: {
            src: __dirname + "/../../frontend/index.html"
        },
        scss: {
            root: srcRootFolder + "/style/",
            src: srcRootFolder + "/style/style.scss",
            dest: destRootFolder + "/style.css"
        }
    }
};