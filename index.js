var PORT = process.env.PORT || 3333;
const request = require('request');
const cheerio = require('cheerio');
const express = require('express');

var server = express();
var papelMoeda, corretoras = [];
server.use(express.json());

server.get('/:cidade', (req, response) => {

  var { cidade } = req.params;

  request(`https://www.melhorcambio.com/cotacao/compra/euro/${cidade}`, function (err, res, body) {
    if (err) {
      console.log('Erro: ', + err);
    }
    let $ = cheerio.load(body);
    corretoras = [];
    papelMoeda = $('#div-especie h3 span').eq(1).text().replace(',', '.');

    for (let i = 0; i < $('.holder-resultados .hover-tip.lista_corretoras .valor').length; i++) {
      if (papelMoeda == $('.holder-resultados .hover-tip.lista_corretoras .valor').eq(i).text().split('R$')[1].substr(0, 5).replace(/\s/g, '').replace(',', '.')) {
        corretoras.push({
          nome: $('.holder-resultados .hover-tip.lista_corretoras .valor').eq(i).parent().find('.nome-corretora b').eq(0).text(),
          logo: "https://www.melhorcambio.com" + $('.holder-resultados .hover-tip.lista_corretoras .valor').eq(i).parent().find('.icon-corretora img').attr('src'),
          url: $('#site_' + i).val(),
          telefone: $('#telefone_' + i).val(),
          avaliacao: +$('#score_corretora_' + i).val().replace(/,/g, "."),
          valor: +parseFloat($('#valor_esp_' + i).val()).toFixed(2)
        })
      }
    }

    corretoras.sort((cor1, cor2) => {
      return cor2.avaliacao - cor1.avaliacao
    })

    response.json({
      valor: papelMoeda,
      corretoras: corretoras
    });
  });

});

server.listen(PORT);
