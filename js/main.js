var matchesData;
var teamData;

var loadStandings = () => {
  showLoader();
  var standings = getStandings()
  standings.then(data => {

    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);

    var html = ''
    data.standings.forEach(standing => {
      var detail = ''
      standing.table.forEach(result => {
        detail += `<tr>
            <td>${result.position}</td>
            <td><img class="responsive-img" width="24" height="24" src="${ result.team.crestUrl || 'img/empty_badge.svg'}"> ${result.team.name}</td>
            <td>${result.playedGames}</td>
            <td>${result.won}</td>
            <td>${result.draw}</td>
            <td>${result.lost}</td>
            <td>${result.goalsFor}</td>
            <td>${result.goalsAgainst}</td>
            <td>${result.goalDifference}</td>
            <td>${result.points}</td>
          </tr>`
      })

      html += `
        <div class="col s12 m12">
        <div class="card">
        <div class="card-content">
        <h5 class="header">${standing.group}</h5>
        <table class="responsive-table striped">
        <thead>
          <tr>
            <th>Position</th>
            <th>Team</th>
            <th>Played</th>
            <th>Won</th>
            <th>Draw</th>
            <th>Lost</th>
            <th>GF</th>
            <th>GA</th>
            <th>GD</th>
            <th>Points</th>
          </tr>
        </thead>
        <tbody>` + detail + `</tbody>
        </table>
        </div>
        </div>
        </div>
      `
    });
    document.getElementById("header-title").innerHTML = 'Standings';
    document.getElementById("main-content").innerHTML = html;
    hideLoader()
  })
}

var loadMatches = () => {
  showLoader()
  var matches = getMatches()
  matches.then(data => {
    matchesData = data;
    var matchdays = groupBy(data.matches, 'matchday');

    html = ''
    for (const key in matchdays) {
      if (key != 'null') {
        html += `
              <h5>Group stage - ${key} of 6</h5>
              <div class="row">
            `
        matchdays[key].forEach(match => {
          html += `
          <div class="col s12 m6 l6">
            <div class="card">
              <div class="card-content card-match">
              <div style="text-align: center"><h6>${dateToDMY(new Date(match.utcDate))}</h6></div>
                <div class="col s10">${match.homeTeam.name}</div>
                <div class="col s2">${match.score.fullTime.homeTeam}</div>
                <div class="col s10">${match.awayTeam.name}</div>
                <div class="col s2">${match.score.fullTime.awayTeam}</div>
              </div>
              <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small" onclick="insertMatchListener(${match.id})"><i class="material-icons left">star</i>Add to Favorite</a>
              </div>
            </div>
          </div>
            `
        });
        html += `
        </div>`
      }

    }
    document.getElementById("header-title").innerHTML = 'Matches';
    document.getElementById("main-content").innerHTML = html;
    hideLoader()
  })
}

var loadTeams = () => {
  showLoader()
  var teams = getTeams()

  teams.then(data => {
    var str = JSON.stringify(data).replace(/http:/g, 'https:');
    data = JSON.parse(str);
    
    teamData = data
    var html = ''
    html += '<div class="row">'
    data.teams.forEach(team => {
      html += `
      <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${team.crestUrl || 'img/empty_badge.svg'}"></div>
            <div class="center flow-text">${team.name}</div>
            <div class="center">${team.area.name}</div>
            <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small green" onclick="insertTeamListener(${team.id})"><i class="material-icons left">star</i>Add to Favorite</a>
          </div>
        </div>
      </div>
    `
    })
    html += "</div>"
    document.getElementById("header-title").innerHTML = 'Teams';
    document.getElementById("main-content").innerHTML = html;
    hideLoader()
  })
}

var loadFavMatch = () => {
  showLoader()
  var matches = getFavMatch()
  
    matches.then(data => {
    var html = ''
    html += '<div class="row">'
    data.forEach(match => {
      html += `
          <div class="col s12 m6 l6">
            <div class="card">
              <div class="card-content card-match">
              <div style="text-align: center"><h6>${dateToDMY(new Date(match.utcDate))}</h6></div>
                <div class="col s10">${match.homeTeam.name}</div>
                <div class="col s2">${match.score.fullTime.homeTeam}</div>
                <div class="col s10">${match.awayTeam.name}</div>
                <div class="col s2">${match.score.fullTime.awayTeam}</div>
              </div>
              <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small red" onclick="deleteMatchListener(${match.id})"><i class="material-icons left">delete</i>Delete</a>
              </div>
            </div>
          </div>
            `
    })

    if(data.length == 0) html += '<h6 class="center-align">No favorite match found!</6>'

    html += "</div>"
    document.getElementById("header-title").innerHTML = 'Favorites Match';
    document.getElementById("main-content").innerHTML = html;
    hideLoader()
  })
}

var loadFavTeams = () => {
  showLoader()
  var teams = getFavTeams()

  teams.then(data => {
    teamData = data;
    var html = ''
    html += '<div class="row">'
    data.forEach(team => {
      html += `
      <div class="col s12 m6 l6">
        <div class="card">
          <div class="card-content">
            <div class="center"><img width="64" height="64" src="${team.crestUrl || 'img/empty_badge.svg'}"></div>
            <div class="center flow-text">${team.name}</div>
            <div class="center">${team.area.name}</div>
            <div class="center"><a href="${team.website}" target="_blank">${team.website}</a></div>
          </div>
          <div class="card-action right-align">
              <a class="waves-effect waves-light btn-small red" onclick="deleteTeamListener(${team.id})"><i class="material-icons left">delete</i>Delete</a>
          </div>
        </div>
      </div>
    `
    })

    if(data.length == 0) html += '<h6 class="center-align">No favorite team found!</6>'

    html += "</div>"
    document.getElementById("header-title").innerHTML = 'Favorite Teams';
    document.getElementById("main-content").innerHTML = html;
    hideLoader()
  })
}

// database operations
var dbx = idb.open('football', 1, upgradeDb => {
  switch (upgradeDb.oldVersion) {
    case 0:
      upgradeDb.createObjectStore('matches', { 'keyPath': 'id' })
      upgradeDb.createObjectStore('teams', { 'keyPath': 'id' })
  }
});

var insertMatch = (match) => {
  dbx.then(db => {
    var tx = db.transaction('matches', 'readwrite');
    var store = tx.objectStore('matches')
    match.createdAt = new Date().getTime()
    store.put(match)
    return tx.complete;
  }).then(() => {
    M.toast({ html: `Pertandingan ${match.homeTeam.name} VS ${match.awayTeam.name}\nberhasil disimpan!` })
    console.log('Pertandingan berhasil disimpan');
  }).catch(err => {
    console.error('Pertandingan gagal disimpan', err);
  });
}

var deleteMatch = (matchId) => {
  dbx.then(db => {
    var tx = db.transaction('matches', 'readwrite');
    var store = tx.objectStore('matches');
    store.delete(matchId);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Match has been deleted!' });
    loadFavMatch();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

var getFavMatch = () => {
  return dbx.then(db => {
    var tx = db.transaction('matches', 'readonly');
    var store = tx.objectStore('matches');
    return store.getAll();
  })
}

var insertTeam = (team) => {
  dbx.then(db => {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams')
    team.createdAt = new Date().getTime()
    store.put(team)
    return tx.complete;
  }).then(() => {
    M.toast({ html: `${team.name} berhasil disimpan!` })
    console.log('Pertandingan berhasil disimpan');
  }).catch(err => {
    console.error('Pertandingan gagal disimpan', err);
  });
}

var deleteTeam = (teamId) => {
  dbx.then(db => {
    var tx = db.transaction('teams', 'readwrite');
    var store = tx.objectStore('teams');
    store.delete(teamId);
    return tx.complete;
  }).then(() => {
    M.toast({ html: 'Team has been deleted!' });
    loadFavTeams();
  }).catch(err => {
    console.error('Error: ', err);
  });
}

var getFavTeams = () => {
  return dbx.then(db => {
    var tx = db.transaction('teams', 'readonly');
    var store = tx.objectStore('teams');
    return store.getAll();
  })
}

var insertMatchListener = matchId => {
  var match = matchesData.matches.filter(el => el.id == matchId)[0]
  insertMatch(match)
}

var deleteMatchListener = matchId => {
  var c = confirm("Delete this match?")
  if (c == true) {
    deleteMatch(matchId);
  }
}

var insertTeamListener = teamId => {
  var team = teamData.teams.filter(el => el.id == teamId)[0]
  insertTeam(team);
}

var deleteTeamListener = teamId => {
  var c = confirm("Delete this team?")
  if (c == true) {
    deleteTeam(teamId);
  }
}

var showLoader = () => {
  var html = `<div class="preloader-wrapper medium active">
              <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
              </div>`
    document.getElementById("loader").innerHTML = html;
}

var hideLoader = () => {
  document.getElementById("loader").innerHTML = '';
}

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

var dateToDMY = date => {
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
}