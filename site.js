var express = require("express");
var _ = require("underscore");

var config = require("./config.json");

var db = require("./database")(config.db.connection_string);
var swig = require('swig');

var site = express();

site.engine('swig.html', swig.renderFile);

site.set('view engine', 'swig.html');

site.use(express.logger());
site.use("/static", express.static(__dirname + "/" + config.static_dir));

site.use(express.cookieParser())
site.use(express.session({secret: config.secret}));

_.each(config.apps, function (app) {
    var module = require(app.module);
    site.use(app.route, module.app(config, db, site));
});

site.listen(config.port);
console.log("Started listening on port " + config.port);
