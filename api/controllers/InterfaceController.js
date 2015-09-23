/**
 * InterfaceController
 *
 * @description :: Server-side logic for managing interfaces
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: function (req, res) {
        console.log('CONTROLLER: sess:', req.session );

        if(req.session.type ==='admin'){ res.redirect('admin'); }
        res.view('main');
    }
};

