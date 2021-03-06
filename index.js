'use strict';
const express = require('express');
const cassandra = require('cassandra-driver'); 
const client = new cassandra.Client({contactPoints:['bd2_DC1N1_1:9042','bd2_DC1N2_1:9043','bd2_DC1N3_1:9044'], keyspace:'practica2'});
client.connect((err, result) => {
    if(err){
        console.log(err);
    } else {
        console.log('index: cassandra connected');
    }
    
});
 

const app = express();
const bodyParser = require('body-parser');

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({ extended: true  }));
app.use(bodyParser.json()); 
app.use('/static', express.static(__dirname + '/public'));

var salida = "";
var arreglo = [];

app.get('/',function(req, res){
    res.render('main',{consola:salida, valores:arreglo});
});

app.post('/filtrar', (req, res) => {
    console.log('entro a filtrar');
    console.log(req.body)
    salida = "";
    if(req.body.fEmail == "" && req.body.fIni != "" && req.body.fFin != "" ){
        console.log("correo vacio");
        var query = "SELECT * FROM tickets WHERE fecha > '" + req.body.fIni + "' AND fecha < '" + req.body.fFin + "' ALLOW FILTERING;";
        console.log(query);
        client.execute(query,[], (err, result) => {
            if(err){
                salida = err;
                console.log("ERROR" + err);
            } else {
                arreglo = result.rows;
                console.log(result.rows);
                salida = "Correcta";
            }
        });
    }
    else if(req.body.fEmail != "" && req.body.fIni != "" && req.body.fFin != "" ){
        console.log("nada vacio");
        var query = "SELECT * FROM tickets WHERE fecha > '" + req.body.fIni + "' AND fecha < '" + req.body.fFin + "' AND email = '" + req.body.fEmail + "' ALLOW FILTERING;";
        console.log(query);
        client.execute(query,[], (err, result) => {
            if(err){
                salida = err;
                console.log("ERROR" + err);
            } else {
                arreglo = result.rows;
                console.log(result.rows);
                salida = "Correcta";
            }
        });
    }
    else if(req.body.fEmail != "" && req.body.fIni == "" && req.body.fFin != "" ){
        console.log("inicio vacio");
        var query = "SELECT * FROM tickets WHERE fecha < '" + req.body.fFin + "' AND email = '" + req.body.fEmail + "' ALLOW FILTERING;";
        console.log(query);
        client.execute(query,[], (err, result) => {
            if(err){
                salida = err;
                console.log("ERROR" + err);
            } else {
                arreglo = result.rows;
                console.log(result.rows);
                salida = "Correcta";
            }
        });
    }
    else if(req.body.fEmail != "" && req.body.fIni == "" && req.body.fFin != "" ){
        console.log("fin vacio");
        var query = "SELECT * FROM tickets WHERE fecha > '" + req.body.fIni + "' AND email = '" + req.body.fEmail + "' ALLOW FILTERING;";
        console.log(query);
        client.execute(query,[], (err, result) => {
            if(err){
                salida = err;
                console.log("ERROR" + err);
            } else {
                arreglo = result.rows;
                console.log(result.rows);
                salida = "Correcta";
            }
        });
    }
    else{
        console.log("todo");
        var query = "SELECT * FROM tickets;";
        console.log(query);
        client.execute(query,[], (err, result) => {
            if(err){
                salida = err;
                console.log("ERROR" + err);
            } else {
                arreglo = result.rows;
                console.log(result.rows);
                salida = "Correcta";
            }
        });
    }
    res.redirect('/');
});


app.post('/crear', (req, res) => {
    arreglo = [];
    console.log('entro a crear');
    console.log(req.body);
    var id = Math.floor(Math.random() * (100000000 - 10000000)) + 10000000;
    var id2 = Math.floor(Math.random() * (10 - 0));
    var idfinal = id.toString() + '-' + id2.toString();
    console.log("idfinal: " + idfinal);

    const query = "INSERT INTO tickets (idTicket, titulo, descripcion, email, fecha) VALUES ('"+idfinal+"', '"+req.body.nTitulo+"', '"+req.body.nDescri+"', '"+req.body.nEmail+"', '"+req.body.nFecha+"')";
    client.execute(query,[], (err, result) => {
		if(err){
            salida = err;
            console.log("ERROR" + err);
		} else {
            salida = "Creacion correcta";
            console.log(result);
		}
    });
    res.redirect('/');
});
  

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
  });