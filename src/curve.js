// ================================================
// creer le graph qui decrit l'augmentation du nombre d'extinction au cours du temps
export function drawCurve(data_decade, list_causes) {
  // set the dimensions and margins of the graph
  var margin_c = { top: 70, right: 30, bottom: 100, left: 100 },
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
    .attr("y", margin_c.top)
    .attr("text-anchor", "middle")
    .style("text-decoration", "underline")
    .text("Global number of species extincted over time");

  // Add X axis --> it is a date format
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(data_decade, function (d) {
        return d.date;
      })
    )
    .range([0, width_c]);

  svg_c
    .append("g")
    .attr("transform", "translate(0," + height_c + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  //TODO: changer les noms de x et y
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

  console.log("stackedData", stackedData);

  // var color = d3
  //   .scaleOrdinal()
  //   .domain(mygroups)
  //   .range([
  //     "#e41a1c",
  //     "#377eb8",
  //     "#4daf4a",
  //     "#984ea3",
  //     "#ff7f00",
  //     "#ffff33",
  //     "#a65628",
  //     "#f781bf",
  //     "#999999"
  //   ]);

  var color = d3.scaleOrdinal().domain(mygroups).range(d3.schemeSet2);
  // Add the area
  // TODO ajouter un titre et les descriptions des abscisses
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
    .attr(
      "d",
      d3
        .area()
        .x(function (d) {
          return x(d.data[0]);
        })
        .y0(function (d, key) {
          if (d.data[0] < 1850) console.log(mygroups[key]);
          if (
            mygroups[key] ==
            "Habitat destruction and predation from introduced Euglandina rosea"
          )
            console.log(x(d[0]));

          return x(d[0]);
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
    .attr("x", -100)
    .attr("y", -50)
    .text("# of baby born")
    .attr("text-anchor", "start");
}
