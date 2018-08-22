const ejs = require('ejs')
const path = require('path');
const fsExtra = require('fs-extra')
const { inflate } = require('./helpers')

// // // //

// CodotypeRuntime class definition
module.exports = class CodotypeRuntime {

  // constructor
  // Handles options to run a single generator instance
  constructor(options) {

    // Assigns helper libraries to class variables
    this.fs = fsExtra

    // Assigns this.options
    this.options = options;

    // Assigns this.options.cwd
    this.options.cwd = process.cwd();

    // Assigns this.options.dest
    const OUTPUT_DIRECTORY = 'build'
    this.options.dest = path.join(this.options.cwd, OUTPUT_DIRECTORY, this.options.project_path)

    // Inflates application metadata
    this.options.app = inflate(this.options.app)

    // Returns the runtime instance
    return this
  }

  // write
  // Method for write files to the filesystem
  async execute () {

    // Defines module path to generator
    // TODO - this approach is brittle and should be re-evaluated
    const modulePath = path.join(this.options.cwd, this.options.generator_path)

    // Try to load up the generator, cach error
    try {
      const GeneratorClass = require(modulePath); // eslint-disable-line import/no-dynamic-require
      GeneratorClass.resolved = require.resolve(modulePath);

      // Logging
      console.info(`Executing ${GeneratorClass.name} generators:`)
      const generator = new GeneratorClass({
        ...this.options,
        resolved: require.resolve(modulePath)
      })
      await generator.write(this.options)

      // Logs which generator is being run
    } catch (err) {
      if (err.code === 'MODULE_NOT_FOUND') {
        console.log('RUNTIME ERROR - GENERATOR NOT FOUND')
      } else {
        console.log('RUNTIME ERROR - OTHER')
        throw err;
      }
    }

  }

}