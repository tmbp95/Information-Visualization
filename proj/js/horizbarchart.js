function gen_horizbarchart(name) {

$("#teamsfont").html(name);
var margin = {top: 10, right: 30, bottom: 40, left: 30},
      width = 280 - margin.left - margin.right,
      height = 180 - margin.top - margin.bottom;

var svg = d3.select("#horizbarchart")
      .append("svg")
          .attr("width", width + margin.left + margin.right + 20)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

var div = d3.select("body").append("div")
    .attr("class", "tooltip5")
    .style("opacity", 0);
  
var x = d3.scaleLinear().range([0, width]);
var y = d3.scaleBand().range([height, 0]);

var g = svg.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
d3.json("data/teste4.json", function(error, data) {
  	if (error) throw error;
  
  	data.sort(function(a) { return a.rating; });
  
  	x.domain([0, d3.max(data, function(d) { return d.rating; })+0.5]);
    y.domain(data.map(function(d) { return d.name; })).padding(0.1);

    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(4).tickSizeInner([-height]));

    g.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
      .style("text-anchor", "middle")
      .attr("dy", "0.6em")
      .style("font-size", "0.9em")
      .text("Rating"); 

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.append("text")
      .attr("dy", "-0.5em")
      .attr("dx", "-3em")
      .attr("text-anchor", "start")
      .style("font-size", "0.9em")
      .text("Players"); 

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("fill", "#52a6af")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return x(d.rating); })
        .on("mouseover", function(d){
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("<strong>Player:</strong> <span style='color:red'>" + d.name + "</span><br>" + 
                 "<strong>Rating:</strong> <span style='color:red'>" + d.rating + "</span>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseleave", function(d){
        div.transition()
           .duration(500)
           .style("opacity", 0);
      });
});
}