const ejs = require('ejs')
const path = require('path');
const fsExtra = require('fs-extra')

// // // //

// BlazeplateGenerator class definition
module.exports = class BlazeplateGenerator {

  // constructor
  // Handles build options
  constructor (options) {

    // Assigns helper libraries to class variables
    this.fs = fsExtra

    // Assigns this.options
    this.options = options;
    return this
  }

  // write
  // Method for write files to the filesystem
  async write () {
    console.log('NOTHING TO WRITE - this should be overwritten by a subclassed generator.')
  }

  // ensureDir
  // Ensures presence of directory for template compilation
  async ensureDir (dest) {
    return new Promise((resolve, reject) => {
      return this.fs.ensureDir(dest, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  // copyDir
  // copy a directory from src to dest
  async copyDir (src, dest) {
    return new Promise((resolve, reject) => {
      return this.fs.copy(src, dest, (err) => {
        if (err) return reject(err)
        return resolve()
      })
    })
  }

  // copyTemplate
  // Compiles an EJS template and writes the result to the dest location
  async copyTemplate (src, dest, data) {
    return new Promise((resolve, reject) => {

      let renderOptions = {}

      // Compiles EJS template
      return ejs.renderFile(src, data, renderOptions, (err, str) => {

        // Handles template compilation error
        if (err) return reject(err)

        // Writes the compiled template to the dest location
        this.fs.writeFile(dest, str, (err) => {
          if (err) return reject(err)
          return resolve();
        });

      })

    })
  }

  // templatePath
  // TODO - finish implementing this function with __dirname
  templatePath (path) {
    return path
  }

  // destinationPath
  // TODO - finish implementing this function __dirname
  destinationPath (path) {
    return path
  }

  // composeWith
  // Enables one generator to fire off several child generators
  async composeWith (generatorClass) {
    let generatorInstance = new generatorClass(this.options)
    return generatorInstance.write()
  }

}