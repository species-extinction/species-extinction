// Lolipop chart inspiré de d3 graph gallery : https://www.d3-graph-gallery.com/graph/lollipop_horizontal.html

var tooltip = d3.select("body").append("div").attr("class", "hidden tooltip");

const lolimargin = { top: 30, right: 40, bottom: 50, left: 200 },
  loliwidth = 520 - lolimargin.left - lolimargin.right,
  loliheight = 350 - lolimargin.top - lolimargin.bottom;

var lolisvg = d3
  .select("#graph2")
  .append("svg")
  .attr("viewBox", "40 0 450 350")
  .append("g")
  .attr(
    "transform",
    "translate(" + lolimargin.left + "," + lolimargin.top + ")"
  );

// Chart title
lolisvg
  .append("text")
  .attr("x", loliwidth / 2)
  .attr("y", -lolimargin.top / 2)
  .attr("text-anchor", "middle")
  .attr("font-size", "16px")
  .style("text-decoration", "underline")
  .text("Extincted species by habitat type");

export function drawLoli(data) {
  lolisvg.selectAll("line").remove();
  lolisvg.selectAll("circle").remove();
  lolisvg.selectAll("g").remove();
  // Add X axis

  var x = d3
    .scaleLinear()
    .domain([0, Math.max(...Object.values(data))])
    .range([0, loliwidth]);
  lolisvg
    .append("g")
    .attr("transform", "translate(0," + loliheight + ")")
    .call(d3.axisBottom(x))
    .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end");

  // Y axis
  var y = d3
    .scaleBand()
    .range([0, loliheight])
    .domain(Object.keys(data))
    .padding(1);
  lolisvg.append("g").call(d3.axisLeft(y));

  // Lines
  lolisvg
    .selectAll("myline")
    .data(Object.entries(data))
    .enter()
    .append("line")
    .attr("x1", x(0))
    .attr("x2", function (d) {
      return x(d[1]);
    })
    .attr("y1", function (d) {
      return y(d[0]);
    })
    .attr("y2", function (d) {
      return y(d[0]);
    })
    .attr("stroke", "black");

  // Circles
  lolisvg
    .selectAll("mycircle")
    .data(Object.entries(data))
    .enter()
    .append("circle")
    .attr("cx", function (d) {
      return x(d[1]);
    })
    .attr("cy", function (d) {
      return y(d[0]);
    })
    .attr("r", "8")
    .style("fill", "#69b3a2")
    .attr("stroke", "black")
    .on("mousemove", function (event, d) {
      tooltip
        .classed("hidden", false)
        // on positionne le tooltip en fonction
        // de la position de la souris
        .attr(
          "style",
          "left:" + (event.x + 5) + "px; top:" + (event.y - 15) + "px"
        )
        // Le tooltip contient le nom du pays et son nombre d'espèces disparues
        .html(
          "<div><b>" +
            d[0] +
            "</b><br /><b>Number of species : </b>" +
            d[1] +
            "</div>"
        );
    })
    .on("mouseout", function (event, d) {
      tooltip.classed("hidden", true);
    });
}
