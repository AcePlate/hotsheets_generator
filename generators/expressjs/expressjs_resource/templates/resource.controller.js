const <%= schema.class_name %> = require('./<%= schema.identifier %>.model')
<%_ for (index in schema.relations) { _%>
<%_ let relation = schema.relations[index] _%>
<%_ if (relation.schema.class_name !== schema.class_name) { _%>
const <%= relation.schema.class_name %> = require('../<%= relation.schema.identifier %>/<%= relation.schema.identifier %>.model')
<%_ } _%>
<%_ } _%>

// // // //

// TODO - abstract elsewhere
function handleError (res) {
    return function(err) {
        return res.status(500).json({ error: err }).end()
    }
}

// // // //

<%_ if (schema.identifier === 'user') { _%>
/**
* @api {get} /api/<%= schema.identifier_plural %> Profile
* @APIname Profile
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets profile of the current <%= schema.label %>
* @apiSuccess {json} User's profile
* @apiError (Error) 500 Internal server error
*/
exports.profile = (req, res) => {
    return <%= schema.class_name %>.findOne({ username: req.user.username }, '-password -__v').exec()
    .then( (user) => { res.json(user) })
}
<%_ } _%>
/**
* @api {get} /api/<%= schema.identifier_plural %> Index
* @APIname Index
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets list of current <%= schema.label_plural %>
* @apiSuccess {json} Collection of <%= schema.label_plural %>
* @apiError (Error) 500 Internal server error
*/
module.exports.list = (req, res, next) => {
    return <%= schema.class_name %>
    .find({})
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (rel.type === 'BELONGS_TO') { _%>
    .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
    <%_ } _%>
    <%_ }) _%>
    .then((response) => {
        return res
        .status(200)
        .send(response)
        .end();
    })
    .catch(handleError(res));
};


/**
* @api {POST} /api/<%= schema.identifier_plural %> Create
* @APIname Create
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Creates a new <%= schema.label %>
* @apiSuccess {json} The newly created <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
module.exports.create = (req, res, next) => {
    <%_ if (schema.identifier === 'user') { _%>
    return User.create(req.body)
    <%_ } else { _%>
    return new <%= schema.class_name %>(req.body).save()
    <%_ } _%>
    .then((response) => {
        return res
        .status(200)
        .send(response)
        .end();
    })
    .catch(handleError(res));
};


/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id Show
* @APIname Show
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Fetch a single <%= schema.label %>
* @apiSuccess {json} The requested <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
module.exports.show = (req, res, next) => {
    return <%= schema.class_name %>.findById(req.params.id)
    <%_ schema.relations.forEach((rel) => { _%>
    <%_ if (rel.type === 'BELONGS_TO') { _%>
    .populate({ path: '<%= rel.alias.identifier %>', select: '<%= rel.related_lead_attribute %>' })
    <%_ } else if (rel.type === 'OWNS_MANY') { _%>
    // .populate({ path: '<%= rel.alias.identifier_plural %>', select: '<%= rel.related_lead_attribute %>' })
    <%_ } _%>
    <%_ }) _%>
    .then((response) => {
        return res
        .status(200)
        .send(response)
        // .send(response.toJSON({ getters: true, virtuals: true }))
        .end();
    })
    .catch(handleError(res));
};

<%_ for (index in schema.relations) { _%>
<%_ let rel = schema.relations[index] _%>
<%_ if (rel.type === 'BELONGS_TO') { _%>

/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id/<%= rel.schema.identifier %> show<%= rel.schema.label %>
* @APIname show<%= rel.schema.label %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets related <%= rel.schema.label %>
* @apiSuccess {json} The related <%= rel.schema.label %> model
* @apiError (Error) 500 Internal server error
*/
module.exports.show<%= rel.schema.class_name %> = (req, res, next) => {
    return <%= schema.class_name %>.findById(req.params.id)
    .then((<%= schema.identifier %>) => {

        return <%= rel.schema.class_name %>.findById(<%= schema.identifier %>.<%= rel.schema.identifier + '_id' %>)
        .then((<%= rel.schema.identifier %>) => {
            return res
            .status(200)
            .send(<%= rel.schema.identifier %>)
            .end();
        })
        .catch(handleError(res));

    })
    .catch(handleError(res));
};

<% } else if (rel.type === 'HAS_MANY') { %>

/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id/<%= rel.schema.identifier_plural %> show<%= rel.schema.class_name_plural %>
* @APIname show<%= rel.schema.class_name_plural %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets related <%= rel.schema.class_name_plural %>
* @apiSuccess {json} The related <%= rel.schema.class_name_plural %>
* @apiError (Error) 500 Internal server error
*/
// TODO - this must be refactored to do: RelatedModel.find({ _id: [1,2,3] })
module.exports.show<%= rel.schema.class_name_plural %> = (req, res, next) => {

    return <%= schema.class_name %>.findById(req.params.id)
    .then((response) => {
        return <%= rel.schema.class_name %>.find({ _id: response.<%= rel.identifier %> })
        .then((<%= rel.schema.identifier_plural %>) => {
            return res
            .status(200)
            .send(<%= rel.schema.identifier_plural %>)
            .end();
        })
        .catch(handleError(res));
    })
    .catch(handleError(res));

};

<%_ } else if (rel.type === 'OWNS_MANY') { _%>

/**
* @api {GET} /api/<%= schema.identifier_plural %>/:id/<%= rel.schema.identifier_plural %> show<%= rel.schema.class_name_plural %>
* @APIname show<%= rel.schema.class_name_plural %>
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Gets related <%= rel.schema.class_name_plural %>
* @apiSuccess {json} The related <%= rel.schema.class_name_plural %>
* @apiError (Error) 500 Internal server error
*/
module.exports.show<%= rel.schema.class_name_plural %> = (req, res, next) => {
    return <%= rel.schema.class_name %>.find({ <%= schema.identifier %>_id: req.params.id })
    .then((<%= rel.schema.identifier_plural %>) => {
        return res
        .status(200)
        .send(<%= rel.schema.identifier_plural %>)
        .end();
    })
    .catch(handleError(res));
};
<%_ } _%>
<%_ } _%>


/**
* @api {PUT} /api/<%= schema.identifier_plural %>/:id Update
* @APIname Update
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Update a single <%= schema.label %>
* @apiSuccess {json} The updated <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
module.exports.update = (req, res, next) => {
    return <%= schema.class_name %>.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
    .then((response) => {
        return res
        .status(200)
        .send(response)
        .end();
    })
    .catch(handleError(res));
};


/**
* @api {DELETE} /api/<%= schema.identifier_plural %>/:id Destroy
* @APIname Destroy
* @APIgroup <%= schema.class_name %> Controller
* @apidescription Destroy a single <%= schema.label %>
* @apiSuccess {json} The destroyed <%= schema.label %>
* @apiError (Error) 500 Internal server error
*/
module.exports.delete = (req, res, next) => {
    return <%= schema.class_name %>.remove({ _id: req.params.id })
    .then((response) => {
        return res
        .status(200)
        .send(response)
        .end();
    })
    .catch(handleError(res));
};
