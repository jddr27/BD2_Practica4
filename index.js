'use strict';

const express = require('express');
const cassandra = require('cassandra-driver'); 
const client = new cassandra.Client({contactPoints:['bd2_DC1N1_1:9042','bd2_DC1N2_1:9043','bd2_DC1N3_1:9044'], keyspace:'practica2'});
client.connect(function(err, result){
    if(err){
        console.log(err);
    } else {
        console.log('index: cassandra connected');
    }
    
});
 
// App
const app = express();

app.get('/', (req, res) => {
    const query = 'SELECT * FROM tickets WHERE fecha > \'2020-01-01\' AND fecha < \'2020-01-31\' ALLOW FILTERING;';
    client.execute(query,[], function(err, result){
		if(err){
			res.status(404).send({msg: err});
		} else {
			res.send(result.rows);
		}
	});
});

app.listen(3001, function () {
    console.log('Example app listening on port 3001!');
  });