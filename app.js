const app = require('express')(),
    bodyParser = require('body-parser'),
    chalk = require('chalk'),
    cookieParser = require('cookie-parser'),
    express = require('express'),
    session = require('express-session'),
    subdomain = require('express-subdomain'),
    expressValidator = require('express-validator'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    path = require('path'),
    sass = require('node-sass-middleware'),
    flash = require('connect-flash');
    dotenv = require ('dotenv/config');
    
const port = process.env.PORT || 8080;

//----------Socket.IO v2.2.0 Middleware----------
const Controlador = require('./models/controller'),
    elpolar_Lote = require('./models/elpolar-lotes');

const http = require('http').Server(app),
    io = require('socket.io')(http);

io.on('connection', function(socket) {

    socket.on('precio inicial', function(precioInicial) {
        // Controlador.findOneAndUpdate({ subasta: 'Progen' }, { ofertar: precioInicial }, function(err) {
        Controlador.findOneAndUpdate({ subasta: 'El Polar' }, { ofertar: precioInicial }, function(err) {
            if(err) throw(err);
            io.emit('precio inicial', precioInicial);
        });
    });

    socket.on('peso', function(peso) {
        io.emit('peso', peso);
    });

    socket.on('update current lote', function(loteId) {
        // Lote.findById(loteId, function(err, data) {
            elpolar_Lote.findById(loteId, function(err, data) {
            if(err) throw(err);
            // Controlador.findOneAndUpdate( { subasta: 'Progen' },
            Controlador.findOneAndUpdate({ subasta: 'El Polar' },
              { loteActual: loteId,
                actual: null,
                ofertante: null,
                ofertar: null }, function(err) {
                if(err) throw(err);
                io.emit('update current lote', data);
            });
        });
    });

    socket.on('nuevaOferta', function(nuevaOferta) {
        // Controlador.findOneAndUpdate( { subasta: 'Progen' },
        Controlador.findOneAndUpdate( { subasta: 'El Polar' },
        {   actual: nuevaOferta.actual,
            ofertante: nuevaOferta.ofertante, 
            ofertar: parseInt(nuevaOferta.actual) + parseInt(nuevaOferta.aumento) }, function(err) {
            if(err) throw(err);
            io.emit('nuevaOferta', nuevaOferta);
        });
    });

    socket.on('_admin siguiente precio', function(ofertar) {
        // Controlador.findOneAndUpdate( { subasta: 'Progen' }, { ofertar: ofertar }, function(err) {
            Controlador.findOneAndUpdate( { subasta: 'El Polar' }, { ofertar: ofertar }, function(err) {
            if(err) throw(err);
            io.emit('_admin siguiente precio', ofertar);
        });
    });

    socket.on('cerrar lote', function() {
        io.emit('cerrar lote');
    });
});
//----------END----------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(cookieParser());
app.use(session({
    cookie: {
        httpOnly: true,
        secure: false
    },
    resave: true,
    saveUninitialized: true,
	secret: 'secret'
	})
);

app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        const namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(function (req, res, next) {
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash('error_msg');
	res.locals.error = req.flash('error');
	res.locals.user = req.user || null;
	next();
});

app.use(sass({
    src: './assets/',
    dest: './assets/',
    outputStyle: 'compressed'
}));

app.set('view engine', 'pug');

const public = require('./routes/public'),
    user = require('./routes/user'),
    event = require('./routes/event');
    elpolar = require('./routes/elpolar');

    /*  El router del subdominio debe de ir primero para que la aplicación
    le dé prioridad. */
    /* TODO: progen.agrariumtech.com */
app.use(subdomain('elpolar', elpolar));
app.use('/', public);
app.use('/event', event);
app.use('/user', user);

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(__dirname + '/assets'));

/*  This is because in your case the listener is app -- an Express handler.
    You have to make http be listener, so that Socket.IO will have access to request handling. */
mongoose.set('useFindAndModify', false);
mongoose.set('useNewUrlParser', true);
mongoose.connect(process.env.DATA_BASE, (err, res) => {
	if(err) {
		throw(err);
	} else {
		console.log("Successful connection to mLab server", chalk.green('✓'));
		http.listen(port, function() {
			console.log('App is running at http://localhost:' + port);
			console.log(chalk.black.italic('Agrarium Technologies v1.0'));
		});
	}
});

module.exports = app;