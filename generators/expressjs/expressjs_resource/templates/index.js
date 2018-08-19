const router = require('express').Router();
const controller = require('./<%= schema.identifier %>.controller');
<%_ if (schema.identifier === 'user') { _%>
const authorization = require('../middleware/authorization')
<%_ } _%>

// // // //

// GET /<%= schema.identifier_plural %>
router.get('/', controller.list);

// POST /<%= schema.identifier_plural %>
router.post('/', controller.create);
<%_ if (schema.identifier === 'user') { _%>
// GET /<%= schema.identifier_plural %>/profile
router.get('/profile', authorization, controller.profile)
<%_ } _%>

// GET /<%= schema.identifier_plural %>/:id
router.get('/:id', controller.show);

// PUT /<%= schema.identifier_plural %>/:id
router.put('/:id', controller.update);

// DELETE /<%= schema.identifier_plural %>/:id
router.delete('/:id', controller.delete);
<%_ for (index in schema.relations) { _%>
<%_ let each = schema.relations[index] _%>
<%_ if (each.type === 'BELONGS_TO') { _%>

// GET /<%= schema.identifier_plural %>/:id/<%= each.schema.identifier %>
router.get('/:id/<%= each.schema.identifier %>', controller.show<%= each.schema.class_name %>);
<%_ } else if (each.type === 'HAS_MANY') { _%>

// GET /<%= schema.identifier_plural %>/:id/<%= each.schema.identifier_plural %>
router.get('/:id/<%= each.schema.identifier_plural %>', controller.show<%= each.schema.class_name_plural %>);
<%_ } else if (each.type === 'OWNS_MANY') { _%>

// GET /<%= schema.identifier_plural %>/:id/<%= each.schema.identifier_plural %>
router.get('/:id/<%= each.schema.identifier_plural %>', controller.show<%= each.schema.class_name_plural %>);
<%_ } _%>
<%_ } _%>

// // // //

module.exports = router;
