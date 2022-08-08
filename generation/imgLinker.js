const path = require("path");
const fs = require("fs");

const jsonsDirPath = path.join(process.cwd(), "Result", "properties");

console.log("A: " + process.cwd());
function setImgLink(dirPath, link) {
  const jsonsInDir = fs.readdirSync(dirPath);

  jsonsInDir.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    jsonReader(fullPath, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        data.image = `${link}/${file}.png`;
        fs.writeFile(fullPath, JSON.stringify(data, null, 2), (err) => {
          if (err) {
            console.log(err);
          }
        });
      }
    });
  });
}

function jsonReader(filePath, cb) {
  fs.readFile(filePath, "utf-8", (err, fileData) => {
    if (err) {
      return cb && cb(err);
    }
    try {
      const object = JSON.parse(fileData);
      return cb && cb(null, object);
    } catch (err) {
      return cb && cb(err);
    }
  });
}

setImgLink(
  jsonsDirPath,
  "https://gateway.pinata.cloud/ipfs/QmdZ6pQ9FZxcbofXq9ijRqgyj2DVVmk32GFGwLmtAJXcok",
);
