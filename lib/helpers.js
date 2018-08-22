const titleize = require('underscore.string/titleize')
const underscored = require('underscore.string/underscored')
const classify = require('underscore.string/classify')
const pluralize = require('pluralize')
const _ = require('lodash')

// // // //

function inflateMeta(label) {
  return {
    label: titleize(label),
    label_plural: pluralize(titleize(label)),
    identifier: underscored(label),
    identifier_plural: underscored(pluralize(label)),
    class_name: classify(titleize(label)),
    class_name_plural: pluralize(classify(titleize(label)))
  }
}

function inflateRelation({ schemas, relation }) {
  // Clones the base attributes from the relation
  // let inflated = { ...relation }
  let inflated = _.clone(relation)

  // console.log(inflated)

  // defines inflated.alias && inflate.schema
  const relatedSchema = schemas.find((s) => { return s._id === inflated.related_schema_id })
  inflated.schema = inflateMeta(relatedSchema.label)
  inflated.alias = inflateMeta(inflated.as || relatedSchema.label)
  inflated.related_lead_attribute = relatedSchema.attributes[0].identifier

  // Returns the inflated relation
  return inflated;
}

function inflateSchema({ schema, schemas }) {
  // let inflated = { ...schema }
  let inflated = _.cloneDeep(schema)
  inflated.relations = schema.relations.map(relation => inflateRelation({ schemas, relation }))
  inflated.attributes = schema.attributes.map(attribute => attribute)
  return inflated
}

// object that gets passed into the generator
// const config = {
//   id: '...',
//   schemas: schemas.map(schema => inflateSchema({ schema, schemas }))
// }

// inflate
// Fomats the build parameters for the generator
// Mostly adds some additional metadata to each relation to simplify template rendering
function inflate(app) {

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


// // // //

module.exports = {
  inflateSchema,
  inflateRelation,
  inflateMeta,
  inflate
}