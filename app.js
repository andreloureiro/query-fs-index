var _ = require('lodash');
var Promise = require('es6-promise').Promise;
var request = require('request');

var GK = [],
    WINGER = [],
    DEFENDER = [],
    MIDFIELDER = [],
    STRIKER = [],
    URL = 'http://footstats.net/stats/paginateRankingJogadorIndiceFootstats?campeonato=394&pagina=';

    function log(player) {
      var direction;

      switch (player.Direcao) {
        case 'negativo':
          direction = '-';
          break;
        case 'positivo':
          direction = '+';
          break;
        case 'igual':
          direction = '=';
          break;
        default:
          direction = '?';
          break;
      }

      console.log(direction + player.Variacao + ' ' + player.Nome + ' - ' + player.Equipe);
    }

function _debug(value) {
  console.log('> DEBUG', value);
}

function initialize(pages) {
  getPages(pages)
    .then(function(players) {
      console.log('Total players:', players.length);
      showPlayers(players, 'Goleiro', 3);
    })
  .catch(function(err) {
    console.log(err);
    throw err;
  });

}

function getPage(page) {
  return new Promise(function(resolve, reject) {
    var pageUrl = URL + page;
    request(pageUrl, function(err, response, body) {
      if (err) reject(err);
      var playerData = JSON.parse(body);
      resolve(playerData);
    });
  });
}

function getPages(pages) {
  var promises = [];

  for (var i = 0; i < pages; i++) {
    promises[i] = getPage(i); 
  }

  _debug(promises);
  return Promise.all(promises);
}

function getByPosition(players, position) {
  return players.filter(function(player) {
    if (player === undefined) return;
    return player.PosicaoJogador == position;
  });
}

function showPlayers(players, position, quantity) {
  var playersPosition = getByPosition(players, position);
  console.log(':: ' + position);
  for (var i = 0; i < quantity; i++) {
    if (playersPosition[i] !== undefined) log(playersPosition[i]);
  }
}

initialize(5);
