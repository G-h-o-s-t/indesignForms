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
                type;

            locals.client = cli;

            for(var i=0,l=data.length; i<l; i++){
                var cat = data[i];
                    for(var n=0,ln=cat.types.length; n<ln; n++){
                        if(cat.types[n].id == typeId){ type = cat.types[n]; }
                    }
            }
            console.log( 'Found', type );
            locals.type = type;

            Fields.find(type.fields).sort('order ASC').exec(function(err, flds){
                if (err) return res.serverError(err);
                locals.fields = flds;

                res.view('form', locals);
            });
        });
    },
    updateFields: function (req, res) {
        console.log( req.allParams() );
        res.send(200,'Ok');
    }

};

