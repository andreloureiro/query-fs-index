var _ = require('lodash');
var Promise = require('es6-promise').Promise;
var request = require('request');
var pagesParam = process.argv[2];

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
          direction = '';
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

      console.log(direction + player.VariacaoAtualizada + ' ' + player.Nome + ' - ' + player.Equipe);
    }

function _debug(value) {
  console.log('> DEBUG', value);
}

function initialize(pages) {
  console.log(pages)
  getPages(pages)
    .then(function(playersArray) {
      var players = playersArray.reduce(function (a, b) {
        return a.concat(b);
      })
      players = sortPlayersOrder(players);
      console.log('Total players:', players.length);
      showPlayers(players, 'Goleiro ', 3);
      showPlayers(players, 'Lateral esquerdo', 3);
      showPlayers(players, 'Lateral direito', 3);
      showPlayers(players, 'Zagueiro', 3);
      showPlayers(players, 'Volante', 3);
      showPlayers(players, 'Meia', 3);
      showPlayers(players, 'Atacante', 3);
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
      var playerData = JSON.parse(response.body);
      resolve(playerData.Data);
    });
  });
}

function getPages(pages) {
  var promises = [];

  for (var i = 0; i < pages; i++) {
    promises[i] = getPage(i);
  }

  return Promise.all(promises);
}

function getByPosition(players, position) {
  return players.filter(function(player) {
    if (player === undefined) return;
    return player.PosicaoJogador == position;
  });
}

function sortPlayersOrder (players) {
  return _.sortByOrder(players,
    ['Direcao', 'VariacaoAtualizada'],
    ['desc', 'desc'])
}

function showPlayers(players, position, quantity) {
  var playersPosition = getByPosition(players, position);
  console.log('-----------------------------------');
  console.log(':: ' + position);
  for (var i = 0; i < quantity; i++) {
    if (playersPosition[i] !== undefined) log(playersPosition[i]);
  }
}

initialize(pagesParam);