var selectedDot;
var clickedDot = null;
var begin = true;
  
function gen_linechart(namePlayer) {
  d3.select("#linechart").selectAll("svg").remove();

var margin = {top: 30, right: 20, bottom: 90, left: 20},
      width = 560 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom
      margin2 = {top: 180, right: 20, bottom: 30, left: 20},
      height2 = 250 - margin2.top - margin2.bottom;

var svg = d3.select("#linechart")
      .append("svg")
          .attr("width", width + margin.left + margin.right + 20)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

var parseDate = d3.timeParse("%d/%m/%Y");

var x = d3.scaleTime().range([0, width]),
    x2 = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    y2 = d3.scaleLinear().range([height2, 0]);

var xAxis = d3.axisBottom(x),
    xAxis2 = d3.axisBottom(x2),
    yAxis = d3.axisLeft(y).ticks(4);

var brush = d3.brushX()
    .extent([[0, 0], [width, height2]])
    .on("brush end", brushed);

var zoom = d3.zoom()
    .scaleExtent([1, Infinity])
    .translateExtent([[0, 0], [width, height]])
    .extent([[0, 0], [width, height]])
    .on("zoom", zoomed);

var area = d3.line()
    .x(function(d) { return x(d.DATE); })
    .y(function(d) { return y(d.PlayerRating); });

var area2 = d3.line()
    .x(function(d) { return x2(d.DATE); })
    .y(function(d) { return y2(d.PlayerRating); });

svg.append("defs").append("clipPath")
    .attr("id", "clip")
  .append("rect")
    .attr("width", width)
    .attr("height", height);

var focus = svg.append("g")
    .attr("class", "focus")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

d3.json("data/teste6.json", function(error, data) {
  if (error) throw error;
  
  var vector = [];
  data.forEach(function(d){
    d.DATE = parseDate(d.DATE);
    d.PlayerRating = +d.PlayerRating;
    if(d.PlayerName == namePlayer){
      vector.push(d);
    }

  })
  data = vector;

  x.domain(d3.extent(data, function(d) { return d.DATE; }));
  y.domain([0, d3.max(data, function(d) { return d.PlayerRating+0.7; })]);
  x2.domain(x.domain());
  y2.domain(y.domain());

  focus.append("path")
      .datum(data)
      .attr("class", "area2")
      .attr("d", area(data));

  focus.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  focus.append("g")
      .attr("class", "axis axis--y")
      .call(yAxis);

  focus.append("text")
      .attr("dy", "-1em")
      .attr("dx", "-3em")
      .attr("fill", "#000")
      .attr("font-size", "0.8em")
      .attr("font-weight", "bold")
      .attr("text-anchor", "start")
      .text("Rating"); 

  context.append("path")
      .datum(data)
      .attr("class", "area2")
      .attr("d", area2(data));

  context.append("g")
      .attr("class", "axis axis--x")
      .attr("transform", "translate(0," + height2 + ")")
      .call(xAxis2);

  context.append("g")
      .attr("class", "brush")
      .call(brush)
      .call(brush.move, x.range());

  svg.append("rect")
      .attr("class", "zoom")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoom);
});

function brushed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
  var s = d3.event.selection || x2.range();
  x.domain(s.map(x2.invert, x2));
  focus.select(".area2").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
      .scale(width / (s[1] - s[0]))
      .translate(-s[0], 0));
}

function zoomed() {
  if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") return; // ignore zoom-by-brush
  var t = d3.event.transform;
  x.domain(t.rescaleX(x2).domain());
  focus.select(".area2").attr("d", area);
  focus.select(".axis--x").call(xAxis);
  context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
}

function type(d) {
  d.DATE = parseDate(d.DATE);
  d.PlayerRating = +d.PlayerRating;
  return d;
}

}