/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index   : function( req, res ){
        res.view('admin/admin',{ users: [1,2,3,4] });
//        res.send(200, 'Admin controller');
    }
};

