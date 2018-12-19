var loadStandings = () => {
  var standings = getStandings()
  standings.then(data => {
    var html = ''
    data.standings.forEach(standing => {
      var detail = ''
      standing.table.forEach(result => {
        detail += `<tr>
            <td>${result.position}</td>
            <td><img class="responsive-img" width="24" height="24" src='/img/empty_badge.svg'> ${result.team.name}</td>
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
    document.getElementById("standings").innerHTML = html;
  })
}

var loadMatches = () => {
  var matches = getMatches()
  matches.then(data => {

    var matchdays = groupBy(data.matches, 'matchday');
    console.log(matchdays);


    html = ''
    for (const key in matchdays) {
      if (key != 'null') {
        html += `
              <div><b>Group stage - ${key} of 6</b></div>
              <div class="card">
              <div class="card-content">
              <div class="row">
            `
        matchdays[key].forEach(match => {
          html += `
          <div class="col s12 m6 l6" style="border:rgba(0,0,0,.2) solid 1px">
            <div style="text-align: center"><h6>${dateToDMY(new Date(match.utcDate))}</h6></div>
              <div class="col s10">${match.homeTeam.name}</div>
              <div class="col s2">${match.score.fullTime.homeTeam}</div>
              <div class="col s10">${match.awayTeam.name}</div>
              <div class="col s2">${match.score.fullTime.awayTeam}</div>
          </div>
            `
        });
        html += `
          </div>
        </div>
        </div>`
      }

    }
    document.getElementById("matches-content").innerHTML = html;

  })
}

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

var dateToDMY = date => {
  return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
}