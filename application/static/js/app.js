const mongo = require('mongodb');
const MongoClient = mongo.MongoClient;

const url = 'mongodb://localhost:27017';

MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {

    if (err) throw err;

    console.log(client.topology.clientInfo);

    client.close();
});

var button = d3.select("#filter-btn")
var form = d3.select("#form")

button.on("click",dataEnter)
form.on("submit",dataEnter)
console.log(players)

function dataEnter() {
    var startInput = d3.select("#startyear");
    var endInput = d3.select("#endyear");
    var startYear = startInput.property("value");
    var endYear = endInput.property("value");

    console.log(startYear);
    console.log(endYear);
    console.log("end of dataEnter");


}