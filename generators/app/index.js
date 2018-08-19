const Helpers = require('../util/helpers')
const BlazeplateGenerator = require('../util/generator')
const Generators = require('./generators')

// // // //

module.exports = class extends BlazeplateGenerator {

  // constructor
  // Sets required input parameters
  constructor(options) {

    // Invokes super
    super(options)

    // // // //
    // TODO - abstract this into helpers.js

    // Global build configuration
    let build = {
      dest: {
        id: '',
        root: null,
        out: '',
        vue: {}, // TODO - phase out 'build.dest.expressjs'
        expressjs: {}, // TODO - phase out 'build.dest.expressjs'
        client: {}, // TODO - this is the pattern used going forward...
        server: {} // TODO - this is the pattern used going forward...
      }
    }

    // Assigngs build.app from options
    build.app = options['appconfig']

    // Isolates the buildId
    const buildId = options['buildId']
    build.id = buildId

    // // // //
    // Destination helpers & constants
    // TODO - use this.env.cwd & path library, instead of hardcoded relative path
    build.dest.out = './build/' + buildId + '/'
    build.dest.root = build.dest.out + build.app.identifier + '/'

    // ExpressJS
    // TODO - move into the ExpressJs generator
    build.dest.expressjs.root = build.dest.root + 'web_api/'

    //
    // // // //

    // Sets this.options.build
    this.options = { build: Helpers.formatBuild(build) }

    // Returns the generator instance
    return this

  }

  // TODO - integrate into write() method
  async writeBuildManifest (req, buildId) {
    return new Promise((resolve, reject) => {

      // Makes /build/buildId
      this.fs.mkdirSync(__dirname + `/build/${buildId}`)

      // Writes blazeplate.json file
      this.fs.writeFile(__dirname + `/build/${buildId}/blazeplate.json`, JSON.stringify(req.body, null, 2), (err) => {
        if (err) throw err;
        // console.log(`Build ${buildId} manfiest saved`);
        return resolve()
      });

    });

  }

  // TODO - update to conditionally run each generator
  async write () {

    console.log('Starting Blazeplate generate')
    // console.log(this.options)

    // TODO - write build configuration to JSON file
    // await fs.writeFileSync(outputFile, this.options)

    // Creates project build directories
    await this.ensureDir(this.options.build.dest.root)

    // Client
    // let { client } = this.options.build.app.stack
    // if (client.id === 'reactjs') await this.composeWith(Generators.ReactJS)

    // Server
    // let { server } = this.options.build.app.stack
    // if (server.id === 'expressjs') await this.composeWith(Generators.ExpressJS)
    // if (server.id === 'falconpy') await this.composeWith(Generators.FalconPy)
    // if (server.id === 'flaskpy') await this.composeWith(Generators.FlaskPy)
    await this.composeWith(Generators.ExpressJS)

    // Infrastructure & Seed Data
    // TODO - conditionally invoke these generators...
    // TODO - abstract these generators into a separate repo...
    // await this.composeWith(Generators.SeedData);
    // await this.composeWith(Generators.DockerCompose);

    // TODO - implement a more robust logging solution
    console.log('Finished Codotype generate')

  }

};
