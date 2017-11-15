var dispatch = d3.dispatch("dotEnter", "dotOut", "dotClick", "squareClick");
var selectedDot;
var clickedDot = null;
var begin = true;

dispatch.on("dotEnter.scatterplot", function(data){
  selectedDot = d3.select("circle[title=\'"+data.YEAR+"\'");
  if(selectedDot.attr("title") == 2014 && begin == true){
    return;
  }
  if(clickedDot == null || selectedDot.attr("title") != clickedDot){
    selectedDot.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill","orange")
               .attr("r", 4);
  }  
})

dispatch.on("dotOut.scatterplot", function(data){
  selectedDot = d3.select("circle[title=\'"+data.YEAR+"\'");
  if(selectedDot.attr("title") == 2014 && begin == true){
    return;
  }
  if(clickedDot == null || selectedDot.attr("title") != clickedDot){
    selectedDot.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill","black")
               .attr("r", 3);
  }  
})

dispatch.on("dotClick.scatterplot", function(data){
  if(selectedDot.attr("title") == 2014 && begin == true){
    return;
  }else if(selectedDot.attr("title") != 2014 && begin == true){
    begin = false;
    clickedDot = 2014;
    selectedDot = d3.select("circle[title=\'"+clickedDot+"\'");
    selectedDot.transition();
    selectedDot.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill","black")
               .attr("r", 3);
    clickedDot = data.YEAR;
  }
  if(clickedDot == null){
    begin = false;
    clickedDot = data.YEAR;
    selectedDot = d3.select("circle[title=\'"+data.YEAR+"\'");
    selectedDot.transition() // <------- TRANSITION STARTS HERE --------
                .delay(0) 
                .duration(200)
                .attr("fill","red")
                .attr("r", 6);
  }else{
    selectedDot = d3.select("circle[title=\'"+clickedDot+"\'");
    selectedDot.transition();
    selectedDot.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill","black")
               .attr("r", 3);
    clickedDot = data.YEAR;
    selectedDot = d3.select("circle[title=\'"+data.YEAR+"\'");
    selectedDot.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill","red")
               .attr("r", 6);
  }
})
  
function gen_scatterplot() {
  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 30, bottom: 40, left: 55},
      width = 300 - margin.left - margin.right,
      height = 200 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);  

  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

  // Adds the svg canvas
  var svg = d3.select("#bubblechart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

  // Define the line
  var valueline = d3.line()
      .x(function(d) { return x(d.YEAR); })
      .y(function(d) { return y(d.NumEvents); });

  // Get the data
  d3.json("data/EventsPerYear.json", function(error, data) {
      data.forEach(function(d) {
          d.YEAR = d.YEAR;
          d.NumEvents = +d.NumEvents;
      });

      // Scale the range of the data
      x.domain([data[0].YEAR-0.2,data[data.length-1].YEAR]);
      y.domain([0, d3.max(data, function(d) { return d.NumEvents; })+100]);

      var yAxis = d3.axisLeft()
                    .ticks(4)
                    .scale(y);                  

      var xAxis = d3.axisBottom()
                .ticks(4)
                .tickFormat(d3.format("d"))
                .scale(x);
    
      // Add the scatterplot
      svg.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("r", function(d){
            if(d.YEAR==2014 && begin == true){
              return 6;
            }else{
              return 3;
            }
          })
          .attr("fill", function(d){
            if(d.YEAR==2014 && begin == true){
              return "red";
            }else{
              return "black";
            }
          }) 
          .attr("cursor","pointer")
          .attr("cx", function(d) { return x(d.YEAR); })
          .attr("cy", function(d) { return y(d.NumEvents); })
          .attr("title", function(d) {return d.YEAR;})
          .on("mouseover", function(d){
            dispatch.call("dotEnter", d, d);
            div.transition()
               .duration(200)
               .style("opacity", .9);
            div.html("<strong>Year:</strong> <span style='color:red'>" + d.YEAR + "</span><br>" + 
                      "<strong>Qty:</strong> <span style='color:red'>" + d.NumEvents + "</span>")
               .style("left", (d3.event.pageX) + "px")
               .style("top", (d3.event.pageY - 42) + "px");
          })
          .on("mouseleave", function(d){
            dispatch.call("dotOut", d, d);
            div.transition()
               .duration(500)
               .style("opacity", 0);
          })
          .on("click", function(d){ 
            dispatch.call("dotClick", d, d);
            if(d.YEAR == 2014 && begin == true){}else{
              if(year != d.YEAR ){
                year = d.YEAR; 
                updateData(year);
              }
            }
          });

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Year"); 

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)

      svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "20px")
      .style("text-anchor", "middle")
      .style("font-size", "13px")
      .text("Rating");      


  });
}
gen_scatterplot();