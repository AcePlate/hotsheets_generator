// Generator index file
var Generator = require('../util/generator')

module.exports = class extends Generator {

  // writing to file
  async write() {

    // TODO - copy README.md
    // this.copyTemplate(
    //   this.templatePath(__dirname, 'index.html'),
    //   this.destinationPath('public/index.html'),
    //   { title: 'Templating with Yeoman' }
    // );

  }

};


// // TODO - integrate into write() method
// async writeBuildManifest (req, buildId) {
//   return new Promise((resolve, reject) => {

//     // Makes /build/buildId
//     this.fs.mkdirSync(__dirname + `/build/${buildId}`)

//     // Writes blazeplate.json file
//     this.fs.writeFile(__dirname + `/build/${buildId}/blazeplate.json`, JSON.stringify(req.body, null, 2), (err) => {
//       if (err) throw err;
//       // console.log(`Build ${buildId} manfiest saved`);
//       return resolve()
//     });

//   });

// }