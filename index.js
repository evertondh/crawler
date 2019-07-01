var PORT = process.env.PORT || 3333;
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');

var server = express();
var papelMoeda;
server.use(express.json());

request('https://www.melhorcambio.com/cotacao/compra/euro/recife', function(err, res, body){
  if(err){
    console.log('Erro: ', + err);
  }

  let $ = cheerio.load(body);

  papelMoeda = $('#div-especie h3 span').eq(1).text().replace(',', '.');

});

server.get('/', (req, res) => {
  res.json({
    valor: papelMoeda
  });
});

server.listen(PORT);
