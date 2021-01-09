// ================================================
// creer le graph qui decrit l'augmentation du nombre d'extinction au cours du temps
export function drawCurve(data_decade) {
    // set the dimensions and margins of the graph
    var margin_c = { top: 10, right: 30, bottom: 100, left: 100 },
      width_c = 1000 - margin_c.left - margin_c.right,
      height_c = 500 - margin_c.top - margin_c.bottom;
  
    // append the svg object to the body of the page
    var svg_c = d3
      .select("#courbe")
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
      .attr("font-size", "16px")
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
    // Add the area
    svg_c
      .append("path")
      .datum(data_decade)
      .attr("fill", "#cce5df")
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .area()
          .x(function (d) {
            return x(d.date);
          })
          .y0(y(0))
          .y1(function (d) {
            return y(d.nb);
          })
      );
  }
  