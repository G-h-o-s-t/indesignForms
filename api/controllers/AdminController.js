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

            res.view('admin/admin',{ users: users });
        });

//        res.send(200, 'Admin controller');
    }
};

