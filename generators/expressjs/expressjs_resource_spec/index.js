const Generator = require('../../util/generator')

// // // //

module.exports = class ExpressJsResourceSpec extends Generator {
  async write () {

    // Destination helpers & constants
    let dest = this.options.build.dest.expressjs.root

    // Store all spec filenames for inclusion in web_api/test/index.js
    let specPaths = []

    // Iterates over each schema in the this.options.build.app.schemas array
    this.options.build.app.schemas.forEach(async (schema) => {

      // Defines the schema-specific destination
      let resourceDest = dest + 'server/api/' + schema.identifier

      // Ensures the presence of the directory
      await this.ensureDir(resourceDest)

      // Defines filepath for spec test
      let specFilePath = resourceDest + '/' + schema.identifier + '.spec.js'

      // Stores the spec path
      specPaths.push('server/api/' + schema.identifier + '/' + schema.identifier + '.spec.js')

      // server/api/resource/resource.spec.js
      if (schema.identifier === 'user') {
        await this.copyTemplate(
          this.templatePath(__dirname, 'user.spec.js'),
          specFilePath,
          { schema: schema }
        );
      } else {
        await this.copyTemplate(
          this.templatePath(__dirname, 'resource.spec.js'),
          specFilePath,
          { schema: schema }
        );
      }

    })

    // Writes the entrypoint in web_api/test/index.js
    specPaths = specPaths.map((p) => {
      return `require('../${p}');`
    })

    // Ensures the presence of the web_api/test directory
    await this.ensureDir(dest + '/test')

    // Writes the template
    await this.copyTemplate(
      this.templatePath(__dirname, 'test.js'),
      dest + '/test/index.js',
      { specPaths: specPaths }
    );

  }

};