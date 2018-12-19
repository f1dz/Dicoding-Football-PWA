const API_KEY = '031cb13ff0274b41bf48afd7b3513c90'
const LEAGUE_ID = 2001
var base_url = "https://api.football-data.org/v2/";
var standing_ep = `${base_url}competitions/${LEAGUE_ID}/standings?standingType=TOTAL`
var matches_ep = `${base_url}competitions/${LEAGUE_ID}/matches`
var teams_ep = `${base_url}competitions/${LEAGUE_ID}/teams`

var fetchApi = url => {
  return fetch(url, {
    headers: {
      'X-Auth-Token': API_KEY
    }
  });
}

var status = response => {
  if (response.status !== 200) {
    console.log("Error : " + response.status);

    return Promise.reject(new Error(response.statusText));
  } else {
    return Promise.resolve(response);
  }
}

var json = response => {
  return response.json();
}

var error = error => {
  console.log("Error: " + error);
}

var getStandings = () => {
  return fetchApi(standing_ep)
    .then(status)
    .then(json);
}

var getMatches = () => {
  return fetchApi(matches_ep)
    .then(status)
    .then(json)
}

var getTeams = () => {
  return fetchApi(teams_ep)
    .then(status)
    .then(json)
}