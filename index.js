//import express en dotenv 
import express from 'express'

//maak een nieuwe express app
const server = express()

// Haalt de API op
const url = ["https://api.ultitv.fdnd.nl/api/v1"];

const postUrl = "https://api.ultitv.fdnd.nl/api/v1/players?first=15";
const apiUrl = "https://api.ultitv.fdnd.nl/api/v1/questions";

const questiondata = await fetchJson(apiUrl);

const urls = [
  [url] + "/game/943.json",
  [url] + "/game/943/statistics.json",
  [url] + "/facts/Player/8607.json",
  [postUrl],
  [apiUrl],
];

//public map gebruiken
server.use(express.static('public'))

//stel de views in
server.set('view engine', 'ejs')
server.set('views', './views')

// Stel afhandeling van formulieren in
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

//hier komen de routes
server.get("/", async function (request, response) {
  const [data1, data2, data3, data4, data5] = await Promise.all(urls.map(fetchJson));
  const data = { data1, data2, data3, data4, data5 };
  response.render("index", data);
});

server.get("/newPlayer", async function (request, response) {
  const [data1, data2, data3, data4, data5] = await Promise.all(urls.map(fetchJson));
  const data = { data1, data2, data3, data4, data5 };
  response.render("form", data);
});

server.post("/form", (request, response) => {
  request.body.answers = [
    {
      content: request.body.content,
      questionId: request.body.question,
    },
  ];
  postJson(postUrl, request.body).then((data) => {
    if (data.success) {
      response.redirect("/?memberPosted=true");
    }
    response.redirect("/");
  });
});

//poortnummer instellen
server.set('port', 4000)

//start de server
server.listen(server.get('port'), () => {
  console.log(`

  ░██████╗███████╗██████╗░██╗░░░██╗███████╗██████╗░  ██████╗░███████╗░█████╗░██████╗░██╗░░░██╗
  ██╔════╝██╔════╝██╔══██╗██║░░░██║██╔════╝██╔══██╗  ██╔══██╗██╔════╝██╔══██╗██╔══██╗╚██╗░██╔╝
  ╚█████╗░█████╗░░██████╔╝╚██╗░██╔╝█████╗░░██████╔╝  ██████╔╝█████╗░░███████║██║░░██║░╚████╔╝░
  ░╚═══██╗██╔══╝░░██╔══██╗░╚████╔╝░██╔══╝░░██╔══██╗  ██╔══██╗██╔══╝░░██╔══██║██║░░██║░░╚██╔╝░░
  ██████╔╝███████╗██║░░██║░░╚██╔╝░░███████╗██║░░██║  ██║░░██║███████╗██║░░██║██████╔╝░░░██║░░░
  ╚═════╝░╚══════╝╚═╝░░╚═╝░░░╚═╝░░░╚══════╝╚═╝░░╚═╝  ╚═╝░░╚═╝╚══════╝╚═╝░░╚═╝╚═════╝░░░░╚═╝░░░

  Application available on: http://localhost:${server.get('port')}
  `);
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}

/**
 * postJson() is a wrapper for the experimental node fetch api. It fetches the url
 * passed as a parameter using the POST method and the value from the body paramater
 * as a payload. It returns the response body parsed through json.
 * @param {*} url the api endpoint to address
 * @param {*} body the payload to send along
 * @returns the json response from the api endpoint
 */
export async function postJson(url, body) {
  return await fetch(url, {
    method: 'post',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
    .then((response) => response.json())
    .catch((error) => error)
}