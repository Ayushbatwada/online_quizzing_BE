const express = require('express');
const {createServer} = require("http");
const os = require("os");
const path = require("path");
const cluster = require('cluster');
const port = process.env.PORT || 8000;

require('./config/global');
require('./config/db');
const mongoose = require("mongoose");

if(cluster.isMaster) {
    console.log(`Master process ${process.pid} is running`);
    for(let iterator = 0; iterator < os.cpus().length; iterator++){
        cluster.fork();
    }
} else {
    console.log(`Worker process ${process.pid} started running`);

    const app = express();
    app.use(express.urlencoded({extended: false}))
    app.use(express.json());

    app.use((req, res, next) => {
        console.log('IP Address of client = ', req.ip);
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept,X-Access-Token');
        res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
        if('OPTIONS' === req.method) {
            res.sendStatus(200);
        } else {
            console.log(`${req.ip} ${req.method} ${req.url}`);
            next();
        }
    });

    app.set('view engine', 'ejs');
    app.set('views', path.join(__dirname, 'views'));
    app.engine('html', require('ejs').renderFile);
    app.use(express.static("public"));

    const configDB = require('./config/db');
    // Connection with mongodb and redis
    mongoose.connection = mongoose.connect(configDB.mongodbUrl);

    mongoose.connection.on('connected', () => {
        console.log('Mongo connection established');
    });

    mongoose.connection.on('error', () => {
        console.log('Mongo connection failed');
    });

    require('./routes')(app);
    const httpServer = createServer(app);

    httpServer.listen(port, ()=> {
        console.log(`Backend service app and running with http server on port = ${port}.
            Host Name = ${os.hostname()},  process id = ${process.pid}`
        )
    })
    module.exports = httpServer;
}

