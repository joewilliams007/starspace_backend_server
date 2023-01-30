// Upload Profile Picture

module.exports = (req, res) => {

    var moment = require('moment');
    var date = moment().format('YYYY-MM-DD');
    var db = require('./db');
    var notif = require('./notif');
    var authenticate = require('./authenticate');
    var update_db = require('./update_db');
    var timestamp = Math.floor(new Date().getTime() / 1000) // in seconds

    const sharp = require('sharp');
    var fs = require('fs');
    const bcrypt = require('bcrypt');

       session = req.body.session

    var session_app = require('./session.js');

    // Authenticate session and ip
    session_app.verify(session, req, res, function(user_id){
        saveEditPost(user_id);
    })

    // Authenticate user id and password
    authenticate.identify(user_id, password, res, function(isAuthenticate){
        // returns true or false
        if(isAuthenticate) {
            saveProfilePicture();
        }
    })

    function saveProfilePicture(){
        sharp("./uploads/" + req.files[0].filename)
        .jpeg({ progressive: true, force: false, quality: 10 })
        .png({ progressive: true, force: false, quality: 10 })
        .resize(1000)
        .webp({ quality: 10 })
        .toFile("./uploads/" + req.files[0].filename + ".webp", (err, info) => {

            fs.unlinkSync("./uploads/" + req.files[0].filename)
            var newPath = user_id + "-" + timestamp + ".jpg"
            fs.rename("./uploads/" + req.files[0].filename + ".webp", "./uploads/" + newPath , function (err) {
                if (err) console.error('ERROR: ' + err);

                update_db.query(`UPDATE Users set image_path = "${newPath}", image = true WHERE user_id = ${user_id}`,res)
            });

        })
    }
}