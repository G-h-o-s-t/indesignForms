/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
//        console.log('CONTROLLER: sess:', req.session );

        if(!req.session || !req.session.user.id) { return res.redirect('/'); }
        if(req.session.type ==='admin'){ return res.redirect('admin'); }


        var locals = { user: req.session.user },
            id = req.session.user.id;

        Client.native(function(err, cli) {
            if (err) return res.serverError(err);
            cli.find({'users': { $elemMatch : {'id': id }}} ).toArray(function(err, clients) {
                if(err) return next(err);
                locals.client = clients[0];
                if(!clients[0]){ console.log('no client assigned');
                    return res.send(200,'No clients assigned to user');
                }

                res.view('main', locals);
            });
        });

    },

    client   : function ( req, res ) {
        if(!req.allParams().id) return res.serverError('No id specified');
        Client.findOne(req.allParams().id,function(err, client) {
            if (err) return res.serverError(err);
            res.json({client : client});
        });

    }

};
