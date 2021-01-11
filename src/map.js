import "./styles.css";
import { drawPieChart } from "./piechart.js";
import { drawLoli } from "./lolichart.js";
import { drawCurve } from "./curve.js";
import { printList, hideGraphs } from "./list.js";

// La carte
const widthMap = 1500,
  heightMap = 1500;
var svg = d3
  .select("#map")
  .append("svg")
  .attr("viewBox", "250 400 1100 1100")
  .attr("preserveAspectRatio", "xMinYMin meet");

var tooltip = d3.select("body").append("div").attr("class", "hidden tooltip");

// On rajoute un groupe englobant toute la visualisation de la carte pour plus tard
var g = svg.append("g");

// Carte du monde
var projection = d3
  .geoNaturalEarth1()
  .translate([widthMap / 2, heightMap / 2])
  .scale(225);

var path = d3.geoPath().projection(projection);

// Range et Domain pour la coloration de la carte
const color = d3
  .scaleQuantize()
  .range([
    "#ffffcc",
    "#ffff7f",
    "#ffff00",
    "#ffbf7f",
    "#ffb266",
    "#ff8000",
    "#ff4c4c",
    "#ff0000",
    "#7f0000"
  ])
  .domain([1, 50]);

//Tentative de légende
/*
g.selectAll("rect")
  .data([1, 50])
  .enter()
  .append("rect")
  .attr("x", (d) => color(d))
  .attr("y", heightMap - 500)
  .attr("height", 30)
  .attr("width", widthMap)
  .attr("fill", (d) => color(d));
*/

var countrySelected;

var data_decade = [];

for (var i = 0; i < 20; i++) {
  data_decade.push({
    date: 1820 + 10 * i,
    nb: 0,
    extinctionCauses: {}
  });
}
var list_causes = [];

document.getElementById("graphs").style.display = "none";

// Compte le nombre d'occurence pour chaque élément différent contenu dans l'array data.
function frequencies(data) {
  var freq = data.reduce(function (acc, curr) {
    if (typeof acc[curr] === "undefined") {
      acc[curr] = 1;
    } else {
      acc[curr] += 1;
    }
    return acc;
  }, {});
  return freq;
}

// On lit le fichier csv
d3.dsv(";", "extinct_species.csv").then(function (csvdata) {
  // On lit le fichier json
  d3.json("world.geojson").then(function (jsondata) {
    jsondata.features.forEach((e) => {
      e.properties.nbspecies = 0;
      e.properties.names = [];
      e.properties.extinctionCauses = [];
      e.properties.habitats = [];
      e.properties.species = [];
    });

    // On parcourt le csv et on récupère le pays et le nom de l'espèce de la ligne courante
    for (var i = 0; i < csvdata.length; i++) {
      var country = csvdata[i].FormerDistribution;
      var name = csvdata[i].CommonName;

      // traitement de la date
      var date = csvdata[i].EstimatedExtinctionDate;
      date = Number(date);
      if ((typeof date === "number", date)) {
        // console.log(date, typeof date, Math.floor(date / 10) - 182);
        var d = Math.floor(date / 10) - 182;
        if (d > 0) {
          data_decade[d].nb++;
          if (list_causes.indexOf(cause) == -1) list_causes.push(cause);
          if (data_decade[d].extinctionCauses[cause])
            data_decade[d].extinctionCauses[cause]++;
          else data_decade[d].extinctionCauses[cause] = 1;
        }
      }

      var cause = csvdata[i].CausesOfExtinction;
      var habitat = csvdata[i].Habitat;
      var species = csvdata[i].Species;
      // On parcourt le json
      for (var j = 0; j < jsondata.features.length; j++) {
        // Si le pays dans le json est contenu dans celui dans la ligne actuelle du csv
        if (country.indexOf(jsondata.features[j].properties.name) > -1) {
          // On incrémente le nombre d'espèces disparues provenant de ce pays.
          jsondata.features[j].properties.nbspecies++;
          // On ajoute l'espèce à la liste des espèces disparues de ce pays
          jsondata.features[j].properties.names.push(name);
          jsondata.features[j].properties.species.push(species);
          // On ajoute la cause d'extinction (seulement si elle est connue)
          if (cause !== "Unknown") {
            jsondata.features[j].properties.extinctionCauses.push(cause);
          }
          // On ajoute le type d'habitat
          jsondata.features[j].properties.habitats.push(habitat);
        }
      }
    }
    //console.log(jsondata);

    for (var i = 0; i < data_decade.length; i++) {
      var d = data_decade[i];

      list_causes.forEach((cause) => {
        if (!data_decade[i].extinctionCauses[cause]) {
          data_decade[i].extinctionCauses[cause] = 0;
        }
      });
    }

    // Draw the countries
    g.selectAll("path")
      .data(jsondata.features)
      .enter()
      .append("path")
      .on("mousemove", function (event, d) {
        tooltip
          .classed("hidden", false)
          // on positionne le tooltip en fonction
          // de la position de la souris
          .attr(
            "style",
            "left:" + (event.x + 15) + "px; top:" + (event.y - 15) + "px"
          )
          // Le tooltip contient le nom du pays et son nombre d'espèces disparues
          .html(
            "<div><b>Country : </b>" +
              d.properties.name +
              "<br /><b>Species extincted : </b>" +
              d.properties.nbspecies +
              "</div>"
          );
      })
      .on("mouseout", function (event, d) {
        tooltip.classed("hidden", true);
      })
      .on("click", function (event, d) {
        if (countrySelected !== undefined) {
          countrySelected.attr("stroke-width", 1).attr("stroke", "#ffffff");
        }
        countrySelected = d3.select(this);
        countrySelected.attr("stroke-width", 2).attr("stroke", "#00004c");

        document.getElementById("generalInfos").innerHTML =
          "<h3>" +
          d.properties.name +
          "</h3><h4>Number of species extincted in this country : " +
          d.properties.nbspecies +
          "</h4>";

        hideGraphs(d.properties.nbspecies);

        document.getElementById("listContainer").innerHTML =
          "<h4>List of extincted species :</h4><ul id='species'></ul><br />";
        var asterisk = document.createElement("p");
        asterisk.innerHTML =
          "Note : \"Unknown\" means that the species hasn't a common name, that's why the species name is indicated between parenthesis.";
        document.getElementById("listContainer").appendChild(asterisk);
        printList(d.properties.names, d.properties.species);

        // Compte le nombre d'occurences de chaque cause d'extinction et
        // crée un object liant chaque cause avec son nombre d'occurence
        var freqCauses = frequencies(d.properties.extinctionCauses);
        var keys = Object.keys(freqCauses);
        var values = Object.values(freqCauses);
        // Appelle la fonction qui dessine le pie chart
        drawPieChart(keys, values);

        var freqHabitats = frequencies(d.properties.habitats);
        drawLoli(freqHabitats);
      })
      // On colore la carte en fonction du nombre d'espèces disparues dans chaque pays
      .attr("fill", function (d) {
        var nbspecies = d.properties.nbspecies;
        if (nbspecies > 0) {
          return color(nbspecies);
        } else {
          // si pas de valeur alors en gris
          return "#C0C0C0";
        }
      })
      .attr("class", "country")
      .attr("d", path);

    drawCurve(data_decade, list_causes);
  });
});
