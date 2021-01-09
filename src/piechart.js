const piemargin = { top: 140, right: 40, bottom: 50, left: 120 },
  piewidth = 400 - piemargin.left - piemargin.right,
  pieheight = 400 - piemargin.top - piemargin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "hidden tooltip");

var piesvg = d3
  .select("#graph1")
  .append("svg")
  .attr("viewBox", "0 0 250 250")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
  .attr("transform", "translate(" + piemargin.left + "," + piemargin.top + ")");

piesvg
  .append("text")
  .attr("x", piewidth / 4 - piemargin.left / 2)
  .attr("y", -120)
  .attr("text-anchor", "middle")
  .attr("font-size", "14px")
  .style("text-decoration", "underline")
  .text("Species by extinction cause");

// Dessine le pie chart des causes d'extinctions
export function drawPieChart(keys, values) {
  //Pour effacer le précédent affichage
  piesvg.selectAll("path").remove();
  var piecolor = d3.interpolateRainbow;

  // Génère le pie chart
  var pie = d3.pie().value(function (d) {
    return d;
  });
  // Génère les arcs/parties du pie chart
  var arc = d3
    .arc()
    .innerRadius(0)
    .outerRadius(pieheight / 2);

  // Trace les parties du graphe
  piesvg
    .selectAll("arc")
    .data(pie(values))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function (d, i) {
      return piecolor(i / values.length);
    })
    .attr("stroke", "black")
    .style("stroke-width", "1px")
    .style("opacity", 0.8)
    .on("mousemove", function (event, d) {
      //console.log(d);
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
            keys[d.index] +
            "<br /><b>Number of species extincted by this cause : </b>" +
            d.value +
            "</div>"
        );
    })
    .on("mouseout", function (event, d) {
      tooltip.classed("hidden", true);
    });
}
