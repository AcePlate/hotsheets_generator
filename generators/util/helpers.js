const _ = require('lodash')
const { inflateRelation } = require('codotype/lib/inflator')

// formatBuild
// Fomats the build parameters for the generator
// Mostly adds some additional metadata to each relation to simplify template rendering
module.exports.formatBuild = (app) => {

    // Iterates over each schema
    app.schemas = _.map(app.schemas, (schema) => {

        // Inflate relations
        schema.relations = _.map(schema.relations, (relation) => {
            let rel = inflateRelation({
                relation: relation,
                schemas: app.schemas
            })
            let relatedSchema = app.schemas.find(s => s._id === rel.related_schema_id)
            let reverse_relation = relatedSchema.relations.find(r => r._id === rel.reverse_relation_id)
            rel.reverse_relation = _.cloneDeep(reverse_relation)
            return rel
        })

        return schema
    })

    // Defines the data to split up app.seeds by the records' respective schemas
    // app.seed_data = {}
    // _.each(app.schemas, (s) => {
    //     app.seed_data[s._id] = {
    //         identifier: s.identifier_plural,
    //         records: []
    //     }
    // })

    // Iterates over each piece of seed data
    // _.each(app.seeds, (seed) => {
    //     let seedObject = {}
    //     seedObject._id = { '$oid': seed._id }
    //     seedObject = {
    //         ...seedObject,
    //         ...seed.attributes
    //     }
    //     // Adds to app.seed_data object
    //     app.seed_data[seed.schema_id].records.push(seedObject)
    // })

    return app
}
