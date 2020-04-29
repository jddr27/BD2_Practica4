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
    if(req.body.fEmail == ""){
        console.log("correo vacio");
        var query = 'SELECT * FROM tickets WHERE fecha > \'?\' AND fecha < \'?\' ALLOW FILTERING;';
        client.execute(query,[req.body.fIni, req.body.fFin], (err, result) => {
            if(err){
                salida = err;
                console.log("ERROR");
            } else {
                arreglo = result.rows;
                console.log(result.rows);
                salida = "Correcta";
            }
        });
    }
    else{
        console.log("correo no vacio");
        var query = 'SELECT * FROM tickets WHERE fecha > \'?\' AND fecha < \'?\' AND email = \'?\' ALLOW FILTERING;';
        client.execute(query,[req.body.fIni, req.body.fFin, req.body.fEmail], (err, result) => {
            if(err){
                salida = err;
                console.log("ERROR");
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

    const query = 'INSERT INTO tickets (idTicket, titulo, descripcion, email, fecha) VALUES (?, ?, ?, ?, ?)';
    client.execute(query,[idfinal, req.body.nTitulo, req.body.nDescri, req.body.nEmail, req.body.nFecha], (err, result) => {
		if(err){
			salida = err;
		} else {
            salida = result;
		}
    });
    res.redirect('/');
});
  

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
  });