// set the dimensions and margins of the graph
var margin = { top: 30, right: 30, bottom: 70, left: 60 },
  width = 460 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "hidden tooltip");

// append the svg object to the body of the page
//let text = d3.select("#Classification").append("p").text("oui");
let barsvg = d3
  .select("#Classification")
  .append("svg")
  //.attr("width", width + margin.left + margin.right)
  //.attr("height", height + margin.top + margin.bottom)
  .attr("viewBox", "-50 0 460 350")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .attr("margin", 2);
//.append("g")
//.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

barsvg
  .append("text")
  .attr("x", width / 2)
  .attr("y", 20)
  .attr("text-anchor", "middle")
  .style("text-decoration", "underline")
  .text("Number of species extincted grouped by their phylum");

var barcolor = d3.interpolateRainbow;
// Scales pour la légende
var svgLegend = d3
  .select(".legendClassification")
  .append("svg")
  .attr("width", width)
  .attr("height", 80);

export function drawBar(data) {
  barsvg.selectAll("rect").remove();
  barsvg.selectAll("g").remove();

  let xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(Object.keys(data))
    .padding(0.65);

  let yScale = d3
    .scaleLinear()
    .range([height, 0])
    .domain([0, Math.max(...Object.values(data))]);

  let barg = barsvg
    .append("g")
    .attr("transform", "translate(0," + margin.top + ")");

  barg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .append("line")
    .style("stroke", "black")
    .style("stroke-width", 1)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", width)
    .attr("y2", 0);

  barg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .append("text")
    .attr("x", width - 50)
    .attr("y", 20)
    .text("Phylum");

  barg.append("g").call(
    d3
      .axisLeft(yScale)
      .tickFormat(function (d) {
        return d;
      })
      .ticks(5)
  );

  barsvg
    .selectAll("myRect")
    .data(Object.entries(data))
    .enter()
    .append("rect")
    .attr("fill", function (d, i) {
      return barcolor(i / Object.entries(data).length);
    })
    .attr("x", function (d) {
      return xScale(d[0]);
    })
    .attr("y", function (d) {
      return yScale(d[1]) + margin.top;
    })
    .attr("width", 40)
    .attr("height", function (d) {
      return height - yScale(d[1]);
    })
    // Tooltip
    .on("mousemove", function (event, d) {
      tooltip
        .classed("hidden", false)
        .attr(
          "style",
          "left:" + (event.x + 15) + "px; top:" + (event.y - 15) + "px"
        )
        // Le tooltip contient la cause d'extinction représentée par la partie survolée
        // et le nombre d'espèces disparues par cette cause.
        .html(
          "<div><b>Phylum : </b>" +
            d[0] +
            "<br /><b>Number of species of this phylum : </b>" +
            d[1] +
            "</div>"
        );
    })
    .on("mouseout", function (event, d) {
      tooltip.classed("hidden", true);
    });
  console.log(data);
  // Draw legend
  //Remove old legends before drawing
  svgLegend.selectAll("*").remove();

  var legendClassification = svgLegend
    .selectAll(".legendClassification")
    .data(Object.entries(data))
    .enter()
    .append("g")
    .attr("class", "legendClassification")
    .attr("transform", function (d, i) {
      if (i % 2 === 0) {
        return "translate(0," + 15 * Math.trunc(i / 2) + ")";
      } else {
        return "translate(" + 150 + "," + 15 * Math.trunc(i / 2) + ")";
      }
    });

  legendClassification
    .append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", 10)
    .attr("height", 11)
    .style("fill", function (d, i) {
      return barcolor(i / Object.entries(data).length);
    });

  legendClassification
    .append("text")
    .attr("x", 20)
    .attr("y", 11)
    //.attr("dy", ".35em")
    .text(function (d, i) {
      return d[0];
    })
    .attr("class", "textselected")
    .style("text-anchor", "start")
    .style("font-size", 12);
}
