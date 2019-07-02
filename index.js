var PORT = process.env.PORT || 3333;
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');

var server = express();
var papelMoeda, corretoras = [];
server.use(express.json());

request('https://www.melhorcambio.com/cotacao/compra/euro/recife', function(err, res, body){
  if(err){
    console.log('Erro: ', + err);
  }

  let $ = cheerio.load(body);

  papelMoeda = $('#div-especie h3 span').eq(1).text().replace(',', '.');
  
  for (let i = 0; i < $('.holder-resultados .hover-tip.lista_corretoras .valor').length; i++) {
    if (papelMoeda == $('.holder-resultados .hover-tip.lista_corretoras .valor').eq(i).text().split(" ")[0].split('R$')[1].replace(',', '.')){
        corretoras.push({
          nome: $('.holder-resultados .hover-tip.lista_corretoras .valor').eq(i).parent().find('.nome-corretora b').eq(0).text(),
          url: $('#site_' + i).val(),
          telefone: $('#telefone_' + i).val(),
          score: $('#score_corretora_' + i).val()
        })
    }
  }
});

server.get('/', (req, res) => {
  res.json({
    valor: papelMoeda,
    corretoras: corretoras
  });
});

server.listen(PORT);
