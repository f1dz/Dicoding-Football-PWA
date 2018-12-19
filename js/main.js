document.addEventListener("DOMContentLoaded", function () {
  var standings = getStandings()

  // Load page content
  var page = window.location.hash.substr(1);
  if (page == "") page = "home";
  loadPage(page);


  standings.then(data => {
    var html = ''
    data.standings.forEach(standing => {
      console.log(standing);

      var detail = ''
      standing.table.forEach(result => {
        detail += `<tr>
          <td>${result.position}</td>
          <td><img class="responsive-img" width="24" height="24" src="${result.team.crestUrl || '/img/empty_badge.svg'}"> ${result.team.name}</td>
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

  function loadPage(page) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState == 4) {
        var content = document.querySelector("#body-content");
        if (this.status == 200) {
          content.innerHTML = xhttp.responseText;
        } else if (this.status == 404) {
          content.innerHTML = "<p>Halaman tidak ditemukan.</p>";
        } else {
          content.innerHTML = "<p>Ups.. halaman tidak dapat diakses.</p>";
        }
      }
    };
    xhttp.open("GET", "pages/" + page + ".html", true);
    xhttp.send();
  }
})