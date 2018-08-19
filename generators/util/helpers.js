const _ = require('lodash')
const { inflateRelation } = require('codotype/lib/inflator')
// formatBuild
// Fomats the build parameters for the generator
// Mostly adds some additional metadata to each relation to simplify template rendering
module.exports.formatBuild = (build) => {

    // Iterates over each schema
    build.app.schemas = _.map(build.app.schemas, (schema) => {

        // Isolates relations
        // let relations = []

        // Iterates over all attributes, handles relations
        // schema.attributes = _.map(schema.attributes, (attr) => {
        //     if (attr.datatype !== 'RELATION') return attr

        //     let relatedSchema = _.find(build.app.schemas, { _id: attr.datatypeOptions.schema_id })

        //     // Debugging
        //     // console.log(attr.datatypeOptions)
        //     // console.log(relatedSchema)

        //     // Pulls metadata from relatedSchema
        //     let { label, label_plural, identifier, identifier_plural, class_name, class_name_plural } = relatedSchema
        //     attr.datatypeOptions.schema_label = label
        //     attr.datatypeOptions.schema_label_plural = label_plural
        //     attr.datatypeOptions.schema_identifier = identifier
        //     attr.datatypeOptions.schema_identifier_plural = identifier_plural
        //     attr.datatypeOptions.schema_class_name = class_name
        //     attr.datatypeOptions.schema_class_name_plural = class_name_plural
        //     attr.datatypeOptions.lead_attr = relatedSchema.attributes[0].identifier

        //     let relation = {
        //       name: '',
        //       type: '',
        //       action: '',
        //       method: '',
        //       getter: '',
        //       computed: ''
        //     }

        //     if (attr.datatypeOptions.relationType === 'HAS_MANY') {
        //         relation.name = `${attr.datatypeOptions.schema_class_name}ListWidget`
        //         relation.label = `Related ${attr.datatypeOptions.schema_label_plural}`
        //         relation.type = 'LIST'
        //         relation.url = attr.datatypeOptions.schema_identifier_plural
        //         relation.module = `${schema.identifier}`
        //         relation.action = `fetch${attr.datatypeOptions.schema_class_name_plural}`
        //         relation.method = `fetch${attr.datatypeOptions.schema_class_name_plural}`
        //         relation.getter = `${attr.datatypeOptions.schema_identifier_plural}`
        //         relation.computed = `${attr.datatypeOptions.schema_identifier_plural}`
        //         relation.state = `${attr.datatypeOptions.schema_identifier_plural}`
        //         relation.state_value = "[]"
        //     } else if (attr.datatypeOptions.relationType === 'OWNS_MANY') {
        //         relation.name = `${attr.datatypeOptions.schema_class_name}ListWidget`
        //         relation.label = `Related ${attr.datatypeOptions.schema_label_plural}`
        //         relation.type = 'LIST'
        //         relation.url = attr.datatypeOptions.schema_identifier_plural
        //         relation.module = `${schema.identifier}`
        //         relation.action = `fetch${attr.datatypeOptions.schema_class_name_plural}`
        //         relation.method = `fetch${attr.datatypeOptions.schema_class_name_plural}`
        //         relation.getter = `${attr.datatypeOptions.schema_identifier_plural}`
        //         relation.computed = `${attr.datatypeOptions.schema_identifier_plural}`
        //         relation.state = `${attr.datatypeOptions.schema_identifier_plural}`
        //         relation.state_value = "[]"
        //     } else {
        //         relation.name = `${attr.datatypeOptions.schema_class_name}ShowWidget`
        //         relation.label = `Related ${attr.datatypeOptions.schema_label}`
        //         relation.type = 'SHOW'
        //         relation.url = attr.datatypeOptions.schema_identifier
        //         relation.module = `${schema.identifier}`
        //         relation.action = `fetch${attr.datatypeOptions.schema_class_name}`
        //         relation.method = `fetch${attr.datatypeOptions.schema_class_name}`
        //         relation.getter = `${attr.datatypeOptions.schema_identifier}`
        //         relation.computed = `${attr.datatypeOptions.schema_identifier}`
        //         relation.state = `${attr.datatypeOptions.schema_identifier}`
        //         relation.state_value = "{}"
        //     }

        //     relations.push(relation)
        //     // console.log(relation)

        //     return attr
        // })

        // Inflate relations
        schema.relations = _.map(schema.relations, (relation) => {
            return inflateRelation({
                relation: relation,
                schemas: build.app.schemas
            })
        })

        return schema
    })

    // Defines the data to split up build.app.seeds by the records' respective schemas
    build.app.seed_data = {}
    _.each(build.app.schemas, (s) => {
        build.app.seed_data[s._id] = {
            identifier: s.identifier_plural,
            records: []
        }
    })

    // Iterates over each piece of seed data
    _.each(build.app.seeds, (seed) => {
        let seedObject = {}
        seedObject._id = { '$oid': seed._id }
        seedObject = {
            ...seedObject,
            ...seed.attributes
        }
        // Adds to build.app.seed_data object
        build.app.seed_data[seed.schema_id].records.push(seedObject)
    })

    return build
}
