const path = require('path');
const { inflate } = require('./helpers')

// // // //

const OUTPUT_DIRECTORY = 'build'

// CodotypeRuntime class definition
// TODO - should this extend the CodotypeGenerator class?
module.exports = class CodotypeRuntime {

  // constructor
  // Handles options to run a single generator instance
  constructor(options = {}) {

    // Assigns this.options
    this.options = options;

    // Assigns this.options.cwd
    this.options.cwd = process.cwd();

    // Returns the runtime instance
    return this
  }

  // // TODO - integrate into write() method
  // TODO - integrate into INTERNAL generator
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

  // write
  // Method for write files to the filesystem
  async execute ({ app, stages, output_directory }) {

    // Inflates application metadata
    // TODO - handle missing app object
    app = inflate({ app });

    // Runs stage of the build array
    // TODO - accept OUTPUT_DIRECTORY override
    stages.forEach(async ({ generator_path, project_path, configuration }) => {

      // Sets output_directory default
      output_directory = output_directory || '';

      // Assigns `dest` option for generator
      // TODO - handle condition of missing app.identifier
      const dest = path.join(this.options.cwd, OUTPUT_DIRECTORY, output_directory, app.identifier, project_path);

      // Defines module path to generator
      // TODO - this approach is brittle and should be re-evaluated
      // Currently relites on ONLY relative paths - need option
      // for absolute paths from a globally intsalled location
      const modulePath = path.join(this.options.cwd, generator_path);

      // Try to load up the generator, cach error
      try {
        const GeneratorClass = require(modulePath); // eslint-disable-line import/no-dynamic-require
        const resolved = require.resolve(modulePath);

        // Defines options for
        const generator_options = {
          app,
          dest,
          resolved,
          configuration
        }

        // Logging
        console.info(`Executing ${GeneratorClass.name} generators:`)
        await new GeneratorClass(generator_options).write(this.options)
        // await generator.write(this.options)


        // Logs which generator is being run
      } catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
          console.log('RUNTIME ERROR - GENERATOR NOT FOUND')
        } else {
          console.log('RUNTIME ERROR - OTHER')
          throw err;
        }
      }

      // Thank you message
      console.log('\nBuild complete\nThank you for using Codotype :)\nFollow us on github.com/codotype\n')

    })
  }
}