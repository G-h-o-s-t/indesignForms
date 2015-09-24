/**
 * FormController
 *
 * @description :: Server-side logic for managing forms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	look: function (req, res) {
        console.log( req.session );
        User.findOne(req.session.passport.user).exec(function (err, user) {
            if(err) res.serverError(err);
            console.log(user.username);
            res.view('test', {user: user.username, email: user.email});
        });
    },

    create: function (req, res) {
        //console.log( req.session );
        //console.log( req.allParams() );

        if(!req.session || !req.session.user.id) { return res.redirect('/'); }
        if(!req.allParams().clientId ){ return res.badRequest('No id Specified');}

        var locals = { user: req.session.user },
            id = req.session.user.id,
            typeId = req.allParams().typeId;

        Client.findOne( req.allParams().clientId , function(err, cli){
            if (err) return res.serverError(err);

            var data = cli.data,
                type,
                catName='';

            locals.client = cli;

            for(var i=0,l=data.length; i<l; i++){
                var cat = data[i];
                    for(var n=0,ln=cat.types.length; n<ln; n++){
                        if(cat.types[n].id == typeId){
                            type = cat.types[n];
                            catName = cat.name;
                            typeId = cat.types[n].id;
                        }
                    }
            }

            locals.type = type;

            Fields.find(type.fields).sort('order ASC').exec(function(err, flds){
                if (err) return res.serverError(err);
                locals.fields = flds;
                locals.catName = catName;
                locals.typeId = typeId;

                res.view('form', locals);
            });
        });
    },

    // получает сразу все поля, обновляет их в базе,
    // возвращает реультат

    updateFields: function (req, res) {
        if(!req.allParams().fields.length) return res.badRequest('No fields specified.');
        var fields = req.allParams().fields,
            ids = [],
            map = {};

        for(var i=0,l=fields.length; i<l; i++){         // collect id's
            var field = fields[i];
            ids.push(field.id);
            map[field.id] = field;
        }

        Fields.find(ids, function (err, flds) {
            if (err) return res.serverError(err);

            for(var i=0,l=flds.length; i<l; i++){
                var fld = flds[i];
                fld.data = map[fld.id].data;

                if(fld.data.indexOf( map[fld.id].data.pop() ) == -1) fld.save();            // save only Uniq
            }
            res.send(200, 'fields Accepted');
        });
    },

    // request
    createRequest: function (req, res) {
        if (!req.allParams().fields.length) return res.badRequest('No fields specified.');

        var model = {
            'fields' : req.allParams().fields,
            'client' : req.allParams().client,
            'status' : '0',
            'comments': 'Just added',
            'previewPath' :'',
            'outputPath': ''

        };

        Request.create(model, function (err, record) {
            if (err) return res.serverError(err);
            res.send(200, record);
        });
    },

    request: function (req, res) {
        if (!req.allParams().id ) return res.badRequest('Invalid params.');
        Request.findOne(req.allParams().id, function (err, record) {
            if (err) return res.serverError(err);
            res.json(record);
        });
    }

};

