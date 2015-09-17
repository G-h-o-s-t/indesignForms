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

    }
};

