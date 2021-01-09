const piemargin = { top: 140, right: 40, bottom: 50, left: 120 },
  piewidth = 400 - piemargin.left - piemargin.right,
  pieheight = 400 - piemargin.top - piemargin.bottom;

var tooltip = d3.select("body").append("div").attr("class", "hidden tooltip");

var pieClassificationSvg = d3
  .select("#graphClassificationContainer")
  .append("svg")
  .attr("viewBox", "0 0 250 250")
  .attr("preserveAspectRatio", "xMinYMin meet")
  .append("g")
  .attr("transform", "translate(" + piemargin.left + "," + piemargin.top + ")");

pieClassificationSvg
  .append("text")
  .attr("x", piewidth / 4 - piemargin.left / 2)
  .attr("y", -120)
  .attr("text-anchor", "middle")
  .attr("font-size", "14px")
  .style("text-decoration", "underline")
  .text("differents Classification of extincted species");

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(piewidth, pieheight) / 2 - piemargin;

// Create dummy data
var data = { a: 9, b: 20, c: 30, d: 8, e: 12 };

// set the color scale
var piecolor = d3.interpolateRainbow;

// Compute the position of each group on the pie:
var pie = d3.pie().value(function (d) {
  return d.value;
});
var data_ready = pie(d3.entries(data));
// Build the pie chart: Basically, each part of the pie is a path that we build using the arc function.
svg
  .selectAll("whatever")
  .data(data_ready)
  .enter()
  .append("path")
  .attr("d", d3.arc().innerRadius(0).outerRadius(radius))
  .attr("fill", function (d) {
    return piecolor(d.data.key);
  })
  .attr("stroke", "black")
  .style("stroke-width", "2px")
  .style("opacity", 0.7);
