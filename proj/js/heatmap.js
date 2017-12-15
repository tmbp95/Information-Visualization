var year = 0;
var dispatch2 = d3.dispatch("squareClick");
var selectedSquare, selectedMonth;
var clickedSquare = null;
var id = null;

dispatch2.on("squareClick.heatmap", function(data){
  if(clickedSquare == null){
    clickedSquare = data;
    selectedSquare = d3.select("rect[title=\'"+data+"\'")
                     .transition() // <------- TRANSITION STARTS HERE --------
                     .delay(0) 
                     .duration(200)
                     .attr("stroke","#ffcc00")
                     .attr("stroke-width", 4);
  }else{
    selectedSquare = d3.select("rect[title=\'"+clickedSquare+"\'")
                     .transition() // <------- TRANSITION STARTS HERE --------
                     .delay(0) 
                     .duration(200)
                     .attr("stroke","#eeeeee")
                     .attr("stroke-width", 1);
    clickedSquare = data;
    selectedDot = d3.select("rect[title=\'"+clickedSquare+"\'")
                    .transition() // <------- TRANSITION STARTS HERE --------
                    .delay(0) 
                    .duration(200)
                    .attr("stroke","#ffcc00")
                    .attr("stroke-width", 4);
  }
})

function drawCalendar(dateData,id){
  if(id==null){
    id=0;
  }
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
      cellSize = 13.5;

  var day = d3.timeFormat("%w"),
      week = d3.timeFormat("%U"),
      format = d3.timeFormat("%d/%m/%Y"),
      titleFormat = d3.utcFormat("%a, %d-%b");
      monthName = d3.timeFormat("%B"),
      months= d3.timeMonth.range(d3.timeMonth.floor(minDate), maxDate);

  d3.selection.prototype.moveToFront = function() {
    return this.each(function(){
    this.parentNode.appendChild(this);
    });
  };

  var svg = d3.select("#calendar").selectAll("svg")
    .data(months)
    .enter().append("svg")
    .attr("class", function(d){
      if(d.getFullYear()==2014){
      	return "month2";
      }else if(d.getFullYear()==2015){
        if(monthName(d)=="January" || monthName(d)=="February" || monthName(d)=="October"){
          return "month";
        }else{
          return "month2";
        }
      }else if(d.getFullYear()==2016){
        if(monthName(d)=="April"){
          return "month";
        }else{
          return "month2";
        }
      }else if(d.getFullYear()==2017){
        if(monthName(d)=="September"){
          return "month";
        }else{
          return "month2";
        }
      }
    })
    .attr("title", function(d){
      return d;
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

  var lookupEventsByIDandName = d3.nest()
    .key(function(d) { return d.DATE; })
    .rollup(function(leaves) {
      IDByDate = leaves[0].IDByDate;
      NameByDate = leaves[0].NameByDate;
      IDByDateParts = IDByDate.split("@");
      NameByDateParts = NameByDate.split("@");
      concatString = IDByDateParts.concat(NameByDateParts);
      return concatString;
    })    
    .object(dateData);

  var lookupEventsIDgiven = d3.nest()
    .key(function(d) { return d.DATE; })
    .rollup(function(leaves) {
      IDByDate = leaves[0].IDByDate;
      IDByDateParts = IDByDate.split("@");
      return IDByDateParts;
    })    
    .object(dateData);


    svg.selectAll("rect.day")
    .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
    .enter().append("text")
    .attr("class", "textday")
    .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
    .attr("dy", "1.18em")
    .attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin; })
    .attr("dx", "0.75em")
    .attr("text-anchor", "middle")
    .style("position", "absolute")
    .style("z-index", 9999)
    /*.style("fill", function(d){
      var lookupEventsByIDResult = lookupEventsIDgiven[((d.getDate() < 10 ? '0' : '') + d.getDate()) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear()];
      if(lookupEventsByIDResult!=null){
        for(i=0;i<lookupEventsByIDResult.length;i++){
          return "white";
        }
      }else{
        return "#a0a0a0";
      }
    })
    .text(function(d){
      return d.getDate();
    });*/
  var rect = svg.selectAll("rect.day")
    .data(function(d, i) { return d3.timeDays(d, new Date(d.getFullYear(), d.getMonth()+1, 1)); })
    .enter().append("rect")
    .attr("class", "day")
    .attr("title", function(d){ return ((d.getDate() < 10 ? '0' : '') + d.getDate()) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear(); })
    .attr("width", cellSize)
    .attr("height", cellSize)
    .attr("rx", 1).attr("ry", 1) // rounded corners
    .attr("y", function(d) { return (day(d) * cellSize) + (day(d) * cellMargin) + cellMargin; })
    .attr("x", function(d) { return ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellSize) + ((week(d) - week(new Date(d.getFullYear(),d.getMonth(),1))) * cellMargin) + cellMargin ; })
    .attr("fill", "#eeeeee")
    .attr("id", function(d){
      var lookupEventsByIDResult = lookupEventsIDgiven[((d.getDate() < 10 ? '0' : '') + d.getDate()) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear()];
      if(lookupEventsByIDResult!=null){
        for(i=0;i<lookupEventsByIDResult.length;i++){
          if(lookupEventsByIDResult[i]==id){
            return "ESTE";
          }else{
            return "NOT";
          }
        }
      }
    })
    .attr("stroke-width", function(d){
      var lookupEventsByIDResult = lookupEventsIDgiven[((d.getDate() < 10 ? '0' : '') + d.getDate()) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear()];
      if(lookupEventsByIDResult!=null){
        for(i=0;i<lookupEventsByIDResult.length;i++){
          if(lookupEventsByIDResult[i]==id){
            return 4;
          }else{
            return 1;
          }
        }
      }
    })
    .attr("stroke", function(d){
      var lookupEventsByIDResult = lookupEventsIDgiven[((d.getDate() < 10 ? '0' : '') + d.getDate()) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear()];
      if(lookupEventsByIDResult!=null){
        for(i=0;i<lookupEventsByIDResult.length;i++){
          if(lookupEventsByIDResult[i]==id){
            return "#ffcc00";
          }else{
            return "#eeeeee";
          }
        }
      }
    }) // default light grey fill
    .on("mouseover", function(d) {
        div.transition()
                 .duration(200)
                 .style("opacity", 0.95)
        div.html("<strong>Date:</strong> <span style='color:white'>" + d +  "</span><br>" + 
                 "<strong>Tournaments:</strong> <span id='demo' style='color:white'></span><br>" + 
                 "<span id='demo2' style='color:white'></span>")
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY + 42) + "px");
        var lookupEventsByDateResult = lookupEventsByDate[d];
        var lookupEventsByIDResult = lookupEventsByID[d];
        var lookupEventsByIDResultString = "";
        if(lookupEventsByDateResult==null){
          lookupEventsByDateResult = 0;
        }
        if(lookupEventsByIDResult==null){
          lookupEventsByIDResultString = "";
        }else{
          lookupEventsByIDResult.forEach(function(d) {
               lookupEventsByIDResultString = lookupEventsByIDResultString + "&nbsp&nbsp - " + d + "<br>"; 
          });
        }
        $("#demo").html(lookupEventsByDateResult);
        $("#demo2").html(lookupEventsByIDResultString);
    })
    .on("mouseleave", function(d){
            div.transition()
               .duration(200)
               .style("opacity", 0);
    })
    .on("click", function(d) {
      dispatch2.call("squareClick", d, d);
      var lookupEventsByIDandNameResult = lookupEventsByIDandName[d];
      var lookupEventsByIDandNameResultString = "";
      if(lookupEventsByIDandNameResult==null){
        lookupEventsByIDandNameResultString = "No tournaments<br>";
        $("#divInfoHeatmap").show();
      $("#InfoHeatmap").html("Date: " + d+"<br>"+lookupEventsByIDandNameResultString+"<br>");
      }else{
        lengthList = lookupEventsByIDandNameResult.length;
        EventsID = lookupEventsByIDandNameResult.slice(0,lengthList/2);
        EventsNAME = lookupEventsByIDandNameResult.slice(lengthList/2,lengthList);
        var count = 0;
        EventsNAME.forEach(function(d) { 
          var name = String(EventsNAME[count]);
          lookupEventsByIDandNameResultString = lookupEventsByIDandNameResultString + '&nbsp&nbsp- <a href="#" onclick="teste(' + EventsID[count] + ',\'' + name + '\')" style="font-size:12px;">' + d + '</a><br>'; 
          count++;
        });
        $("#divInfoHeatmap").show();
          $("#InfoHeatmap").html("Date: " + d+"<br><text id='tournamentsstrong'>Tournaments:</text><br>"+lookupEventsByIDandNameResultString+"<br>");
      }
      
    })
    .datum(format);

  var scale = d3.scaleLinear()
    .domain([0,1,2, 3, d3.max(dateData, function(d) { return new Date(d.EventsByDate) })])
    .range(["#eeeeee", "#71e7f4", "#52a6af", "#41848b","#2c6167"]);

  rect.filter(function(d) { return d in lookupEventsByDate; })
    .style("fill", function(d) { return scale(lookupEventsByDate[d]); })


  var sel = d3.selectAll('.textday');
  sel.moveToFront();

}

function updateData(year,id) {
  d3.select("#calendar").selectAll("svg").remove();
  d3.select("div[title=tip").remove();
  $("#divInfoHeatmap").hide();
  d3.json("data/Events" + year + ".json", function(response) {
   drawCalendar(response,id);
  });
}

window.onload = d3.json("data/Events2014.json", function(response){
                  drawCalendar(response,id);
                   $("#divInfoHeatmap").hide();
                });


/*
$("body").click(function(e){
  if(e.target.className !== "tooltip2"){
    $(".tooltip2").hide();
    clicked = 0;
  }
});*/
