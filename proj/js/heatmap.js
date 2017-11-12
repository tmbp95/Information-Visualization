var year = 0;
var dispatch2 = d3.dispatch("squareClick");
var selectedSquare;
var clickedDot = null;

dispatch2.on("squareClick.heatmap", function(data){
  if(clickedDot == null){
    clickedDot = data;
    selectedSquare = d3.select("rect[title=\'"+data+"\'")
                     .transition() // <------- TRANSITION STARTS HERE --------
                     .delay(0) 
                     .duration(200)
                     .attr("stroke","#ffcc00")
                     .attr("stroke-width", 4);
  }else{
    selectedSquare = d3.select("rect[title=\'"+clickedDot+"\'")
                     .transition() // <------- TRANSITION STARTS HERE --------
                     .delay(0) 
                     .duration(200)
                     .attr("stroke","#eeeeee")
                     .attr("stroke-width", 1);
    clickedDot = data;
    selectedDot = d3.select("rect[title=\'"+clickedDot+"\'")
                    .transition() // <------- TRANSITION STARTS HERE --------
                    .delay(0) 
                    .duration(200)
                    .attr("stroke","#ffcc00")
                    .attr("stroke-width", 4);
  }
})

function drawCalendar(dateData){

  var weeksInMonth = function(month){
    var m = d3.timeMonth.floor(month)
    return d3.timeWeeks(d3.timeWeek.floor(m), d3.timeMonth.offset(m,1)).length;
  }

  var div = d3.select("body").append("div")
    .attr("title", "tip")
    .attr("class", "tooltip2")
    .style("opacity", 0)

  var minDate = d3.min(dateData, function(d) { return new Date(d.DATE) })
  var maxDate = d3.max(dateData, function(d) { return new Date(d.DATE) })

  var cellMargin = 2,
      cellSize = 13;

  var day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      format = d3.timeFormat("%d/%m/%Y"),
      titleFormat = d3.utcFormat("%a, %d-%b");
      monthName = d3.timeFormat("%B"),
      months= d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

  var svg = d3.select("#calendar").selectAll("svg")
    .data(months)
    .enter().append("svg")
    .attr("class", function(d){
      if(d.getFullYear()==2014){
      	return "month2";
      }else if(d.getFullYear()==2015){
        if(monthName(d)=="January" || monthName(d)=="February"){
          return "month";
        }else{
          return "month2";
        }
      }else if(d.getFullYear()==2016){
        return "month2";
      }else if(d.getFullYear()==2017){
        return "month2";
      }
    })
    .attr("height", ((cellSize * 7) + (cellMargin * 8) + 20) ) // the 20 is for the month labels
    .attr("width", function(d) {
      var columns = weeksInMonth(d);
      return ((cellSize * columns) + (cellMargin * (columns + 1)));
    })
    .append("g")

  svg.append("text")
    .attr("class", "month-name")
    .attr("y", (cellSize * 7) + (cellMargin * 8) + 15 )
    .attr("x", function(d) {
      var columns = weeksInMonth(d);
      return (((cellSize * columns) + (cellMargin * (columns + 1))) / 2);
    })
    .attr("text-anchor", "middle")
    .text(function(d) { return monthName(d); })

  var lookupEventsByDate = d3.nest()
    .key(function(d) { return d.DATE; })
    .rollup(function(leaves) {
      return d3.sum(leaves, function(d){ return parseInt(d.EventsByDate); });
    })
    .object(dateData);

  var lookupEventsByID = d3.nest()
    .key(function(d) { return d.DATE; })
    .rollup(function(leaves) {
      NameByDate = leaves[0].NameByDate;
      NameByDateParts = NameByDate.split("@");
      return NameByDateParts;
    })
    .object(dateData);

  var rect = svg.selectAll("rect.day")
    .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
    .enter().append("rect")
    .attr("class", "day")
    .attr("title", function(d){ return ((d.getDate() < 10 ? '0' : '') + d.getDate()) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear(); })
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 1).attr("ry", 1) // rounded corners
    .attr("fill", '#eeeeee') // default light grey fill
    .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
    .attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; })
    .on("mouseover", function(d) {
        div.transition()
                 .duration(200)
                 .style("opacity", 1)
        div.html("<strong>Date:</strong> <span style='color:red'>" + d +  "</span><br>" + 
                 "<strong>Tournaments:</strong> <span id='demo' style='color:red'></span><br>" + 
                 "<strong>Names:</strong> <br><span id='demo2' style='color:red'></span>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 42) + "px");
        var lookupEventsByDateResult = lookupEventsByDate[d];
        var lookupEventsByIDResult = lookupEventsByID[d];
        var lookupEventsByIDResultString = "";
        if(lookupEventsByDateResult==null){
          lookupEventsByDateResult = 0;
        }
        if(lookupEventsByIDResult==null){
          lookupEventsByIDResultString = "empty";
        }else{
          lookupEventsByIDResult.forEach(function(d) {
               lookupEventsByIDResultString = lookupEventsByIDResultString + " - " + d + "<br>"; 
          });
        }
        $("#demo").html(lookupEventsByDateResult);
        $("#demo2").html(lookupEventsByIDResultString);
    })
    .on("mouseleave", function(d){
            div.transition()
               .duration(500)
               .style("opacity", 0);
    })
    .on("click", function(d) {
      dispatch2.call("squareClick", d, d);
      /*div.transition()
               .duration(200)
               .style("display", "block");
      div.html("<button type='button' id='closetip' class='close' aria-label='close' style='margin-top:-5px;color:white;opacity:1;'><span aria-hidden='true'>&times;</span></button>" +
              "<strong>Date:</strong> <span style='color:red'>" + d +  "</span><br>" + 
               "<strong>Tournaments:</strong> <span id='demo' style='color:red'></span><br>" + 
               "<strong>Names:</strong> <br><span id='demo2' style='color:red'></span>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY + 42) + "px");
      var lookupEventsByDateResult = lookupEventsByDate[d];
      var lookupEventsByIDResult = lookupEventsByID[d];
      var lookupEventsByIDResultString = "";
      if(lookupEventsByDateResult==null){
        lookupEventsByDateResult = 0;
      }
      if(lookupEventsByIDResult==null){
        lookupEventsByIDResultString = "empty";
      }else{
        lookupEventsByIDResult.forEach(function(d) {
             lookupEventsByIDResultString = lookupEventsByIDResultString + " - " + d + "<br>"; 
        });
      }
      $("#demo").html(lookupEventsByDateResult);
      $("#demo2").html(lookupEventsByIDResultString);*/
    })
    .datum(format);

  var scale = d3.scaleLinear()
    .domain([0,1,2, 3, d3.max(dateData, function(d) { return new Date(d.EventsByDate) })])
    .range(["#eeeeee", "#71e7f4", "#52a6af", "#41848b","#2c6167"]);

  rect.filter(function(d) { return d in lookupEventsByDate; })
    .style("fill", function(d) { return scale(lookupEventsByDate[d]); })

}

function updateData(year) {
  d3.select("#calendar").selectAll("svg").remove();
  d3.select("div[title=tip").remove();
  d3.json("data/Events" + year + ".json", function(response) {
   drawCalendar(response);
  });
}

window.onload = d3.json("data/Events2014.json", function(response){
                  drawCalendar(response);
                });
/*
$("body").click(function(e){
  if(e.target.className !== "tooltip2"){
    $(".tooltip2").hide();
    clicked = 0;
  }
});*/
