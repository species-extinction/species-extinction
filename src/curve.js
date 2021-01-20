// ================================================
// creer le graph qui decrit l'augmentation du nombre d'extinction au cours du temps
function drawCurve(data_decade, list_causes) {
  var tooltip = d3.select("body").append("div").attr("class", "hidden tooltip");

  // set the dimensions and margins of the graph
  var margin_c = { top: 50, right: 30, bottom: 100, left: 100 },
    width_c = 1000 - margin_c.left - margin_c.right,
    height_c = 500 - margin_c.top - margin_c.bottom;

  // append the svg object to the body of the page
  var svg_c = d3
    .select("#curve")
    .append("svg")
    .attr("width", width_c + margin_c.left + margin_c.right)
    .attr("height", height_c + margin_c.top + margin_c.bottom)
    .append("g")
    .attr("transform", "translate(" + margin_c.left + "," + margin_c.top + ")");

  svg_c
    .append("text")
    .attr("x", width_c / 2)
    .attr("y", margin_c.top - 70)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text(
      "Evolution of the number of species extincted over time by causes of extinction"
    );

  // Add X axis --> it is a date format
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data_decade, function (d) {
        // return new Date(d.date);
        return d3.timeParse("%Y")(d.date);
      })
    )
    .range([0, width_c]);

  svg_c
    .append("g")
    .attr("transform", "translate(0," + height_c + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3
    .scaleLinear()
    .domain([
      0,
      d3.max(data_decade, function (d) {
        return d.nb;
      })
    ])
    .range([height_c, 0]);

  svg_c.append("g").call(d3.axisLeft(y));

  var sumstat = d3.group(data_decade, (d) => d.date);

  // Stack the data: each group will be represented on top of each other
  var mygroups = list_causes; // list of group names
  var mygroup = []; // list of group names
  for (let i = 0; i < mygroups.length; i++) {
    mygroup.push(i);
  }

  var stackedData = d3
    .stack()
    .keys(mygroups)
    .value(function (d, key) {
      return d[1][0].extinctionCauses[key];
    })(sumstat);

  var color = d3.scaleOrdinal().domain(mygroups).range(d3.schemeSet2);

  // Add the area
  svg_c
    .selectAll("mylayers")
    .data(stackedData)
    .enter()
    .append("path")
    .attr("class", function (d) {
      return "myArea " + d.key;
    })
    .style("fill", function (d) {
      let name = d.key;
      return color(name);
    })
    .on("mousemove", function (event, d) {
      var indice = Math.floor(
        (((event.x - margin_c.left) / width_c) * (2000 - 1820) + 0) / 10
      );
      var nb_exctinction = d[indice - 1].data[1][0].extinctionCauses[d.key];
      tooltip
        .classed("hidden", false)
        .attr(
          "style",
          "left:" + (event.x + 15) + "px; top:" + (event.y - 15) + "px"
        )
        // Le tooltip contient la cause d'extinction représentée par la partie survolée
        // et le nombre d'espèces disparues par cette cause.
        .html(
          "<div><b>Cause of extinction : </b>" +
            d.key +
            "<br /><b>Number of species extincted by this cause : </b>" +
            nb_exctinction +
            "</div>"
        );
    })
    .on("mouseout", function (event, d) {
      tooltip.classed("hidden", true);
    })
    .attr(
      "d",
      d3
        .area()
        .x(function (d) {
          return x(d3.timeParse("%Y")(d.data[0]));
        })
        .y0(function (d) {
          return y(d[0]);
        })
        .y1(function (d) {
          return y(d[1]);
        })
    );

  // Add X axis label:
  svg_c
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", width_c)
    .attr("y", height_c + 40)
    .text("Time (year)");

  // Add Y axis label:
  svg_c
    .append("text")
    .attr("text-anchor", "end")
    .attr("x", -50)
    .attr("y", -30)
    .text("# of extinction")
    .attr("text-anchor", "start");

  //////////
  // HIGHLIGHT GROUP //
  //////////

  // What to do when one group is hovered
  var highlight = function (d) {
    console.log(d);
    // reduce opacity of all groups
    d3.selectAll(".myArea").style("opacity", 0.1);
    // expect the one that is hovered
    d3.select("." + d).style("opacity", 1);
  };

  // And when it is not hovered anymore
  var noHighlight = function (d) {
    d3.selectAll(".myArea").style("opacity", 1);
  };
}

// sources:
// - https://www.d3-graph-gallery.com/graph/stackedarea_template.html

export {drawCurve}
