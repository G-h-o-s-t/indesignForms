/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index   : function( req, res ){
        User.find({},function(err, users){
            if(err) return res.serverError(err);


            Client.find({}, function(err, clients){
                if(err) return res.serverError(err);

                Catalog.find({}, function(err, cat){
                    if(err) return res.serverError(err);

                    res.view('admin/admin',{
                        users: users,
                        clients: clients,
                        catalog: cat
                    });
                });
            });
        });
//        res.send(200, 'Admin controller');
    },

// some socket data sender helpers
    users   : function ( req, res ) {
        User.find({},function(err, users) {
            if (err) return res.serverError(err);
            res.json({users : users});
        });
    },
    clients   : function ( req, res ) {
        Client.find({},function(err, clients) {
            if (err) return res.serverError(err);
            res.json({clients : clients});
        });
    },
    catalog   : function ( req, res ) {
        Catalog.find({},function(err, cat) {
            if (err) return res.serverError(err);
            res.json({catalog : cat});
        });
    },

    // post/catalog
    // WARNING, !recreate all records!!
    saveCatalog: function ( req, res ) {
        if(req.allParams().forms.length) {
            Catalog.drop(function(err) {
                if (err) return res.serverError(err);
                Catalog.create({'forms': req.allParams().forms}, function (err, forms) {
                    if (err) return res.serverError(err);
                    return res.send(200, forms);
                })
            });
        } else {
            return res.send(200,'no income data');
        }
    },

//  Clients..
    createClient: function (req, res) {
        console.log('Creating client');
        console.log( req.allParams() );
        Client.create(req.allParams(), function (err, result) {
            if (err) return res.serverError(err);
            return res.json(result);
        });
    },

// Fields,
    getField: function (req, res) {
        Fields.find( req.allParams() , function (err, result) {
            if (err) return res.serverError(err);
            return res.json(result);
        });

    },

    createField: function (req, res) {
        Fields.create(req.allParams(), function (err, result) {
            if (err) return res.serverError(err);
            return res.json(result);
        });
    },

    deleteField: function (req, res) {
        if(!req.allParams().id) return res.serverError('No id to delete specified');
        Fields.destroy(req.allParams().id, function (err, result) {
            if (err) return res.serverError(err);
            return res.json(result);
        });
    },

    modifyField: function (req, res) {
        if(!req.allParams().id) return res.badRequest('No field id specified.');
        Fields.findOne(req.allParams().id, function (err, field) {
            if (err) return res.serverError(err);

            field.name = req.allParams().name;
            field.descr = req.allParams().descr;
            field.type = req.allParams().type;
            field.active = req.allParams().active;
            field.order = req.allParams().order;

            field.save(function(err, data){
                if (err) return res.serverError(err);
                return res.json(data);
            });
        });
    }

};

