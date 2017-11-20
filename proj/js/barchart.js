function gen_barchart() {
var margin = {top: 30, right: 30, bottom: 40, left: 55},
      width = 300 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;


var svg = d3.select("#barchart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip3")
    .style("opacity", 0);

var x0 = d3.scaleBand()
    .rangeRound([0, width])
    .paddingInner(0.1);

var x1 = d3.scaleBand()
    .padding(0.05);

var y = d3.scaleLinear()
    .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#0c83de", "#ffb515"]);

d3.csv("data/teste3.csv", function(d, i, columns) {
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = +d[columns[i]];
  return d;
}, function(error, data) {
  if (error) throw error;

  var keys = data.columns.slice(1);

  x0.domain(data.map(function(d) { return d.Map; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

  svg.append("g")
    .selectAll("g")
    .data(data)
    .enter().append("g")
      .attr("transform", function(d) { return "translate(" + x0(d.Map) + ",0)"; })
    .selectAll("rect")
    .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
    .enter().append("rect")
      .attr("x", function(d) { return x1(d.key); })
      .attr("y", function(d) { return y(d.value); })
      .attr("width", x1.bandwidth())
      .attr("height", function(d) { return height - y(d.value); })
      .attr("class", "bar")
      .attr("fill", function(d) { return z(d.key); })
      .on("mouseover", function(d){
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("<strong>Side:</strong> <span style='color:red'>" + d.key + "</span><br>" + 
                 "<strong>Win%:</strong> <span style='color:red'>" + d.value + "%</span>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 42) + "px");
      })
      .on("mouseleave", function(d){
        div.transition()
           .duration(500)
           .style("opacity", 0);
      })

  svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x0));

  svg.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(5))
    .append("text")
      .attr("x", 2)
      .attr("dy", "-1em")
      .attr("dx", "-3em")
      .attr("fill", "#000")
      .attr("text-anchor", "start")
      .style("font-size", "1.2em")
      .text("Win %");

  var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys.slice().reverse())
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width + 5)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", z);

  legend.append("text")
      .attr("x", width + 22)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; });
});
}
gen_barchart();