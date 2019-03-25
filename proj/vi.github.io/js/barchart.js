function gen_barchart(ola) {
  var idTournament = ola;
  $("#legenda2").hide();
  d3.select("#barchart").selectAll("svg").remove();
var margin = {top: 30, right: 40, bottom: 40, left: 55},
      width = 290 - margin.left - margin.right,
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
    .range(["#52a6af", "#71e7f4"]);

var z2 = d3.scaleOrdinal()
    .range(["#ff5a00", "orange"]);

d3.json("data/teste3.json", function(error, data) {
    var tempClickedBall = $("#nameofteam").val();

      var arrayAxis = [];
      for(i=0;i<data.length;i++){
        if(data[i].Map == "Dust2" && checkbox1 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
        if(data[i].Map == "Nuke" && checkbox2 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
        if(data[i].Map == "Mirage" && checkbox3 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
        if(data[i].Map == "Inferno" && checkbox4 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
        if(data[i].Map == "CobStone" && checkbox5 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
        if(data[i].Map == "Cache" && checkbox6 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
        if(data[i].Map == "Overpass" && checkbox7 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
        if(data[i].Map == "Tuscan" && checkbox8 === true && data[i].tournament == idTournament){
          arrayAxis.push(data[i]);
        }
      }
    data = arrayAxis;

    var vectorData1 = [];
    var vectorData2 = [];
    var clickedBallEquals = true;
    for(i=0;i<data.length;i++){
      if(data[i].team == tempClickedBall){
        vectorData1.push(data[i]);
        
      }
      if(clickedBall!=null){
        if(data[i].team == clickedBall && data[i].team != tempClickedBall){
          vectorData2.push(data[i]);
          clickedBallEquals = false;
        }
        if(data[i].team == clickedBall && data[i].team == tempClickedBall){
          clickedBallEquals = true;
        }
      }
    }
    var data1 = vectorData1
    var data2 = vectorData2;



  if (error) throw error;

  var keys = ["CT", "T"];

  x0.domain(data.map(function(d) { return d.Map; }));
  x1.domain(keys).rangeRound([0, x0.bandwidth()]);
  y.domain([0, d3.max(data, function(d) { return d3.max(keys, function(key) { return d[key]; }); })]).nice();

   if(clickedBall!=null){
    if(clickedBallEquals == true){
      svg.append("g")
    .selectAll("g")
    .data(data1)
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
      .attr("fill", function(d) { return z2(d.key); })
      .on("mouseover", function(d){
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("<strong>Side:</strong> <span style='color:white'>" + d.key + "</span><br>" + 
                 "<strong>Win%:</strong> <span style='color:white'>" + d.value + "%</span>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 42) + "px");
      })
      .on("mouseleave", function(d){
        div.transition()
           .duration(500)
           .style("opacity", 0);
      })


      var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys)
    .enter().append("g")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width + 5)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", z2);

    legend.append("text")
      .attr("x", width + 22)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .attr("text-anchor", "start")
      .text(function(d) { return d; }); 
    }else{
      $("#legenda2").show();
      svg.append("g")
      .selectAll("g")
      .data(data2)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.Map) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key); })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth()/2)
        .attr("height", function(d) { return height - y(d.value); })
        .attr("class", "bar")
        .attr("fill", function(d) { return z2(d.key); })
        .on("mouseover", function(d){
          div.transition()
              .duration(200)
              .style("opacity", .9);
          div.html("<strong>Side:</strong> <span style='color:white'>" + d.key + "</span><br>" + 
                   "<strong>Win%:</strong> <span style='color:white'>" + d.value + "%</span>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 42) + "px");
        })
        .on("mouseleave", function(d){
          div.transition()
             .duration(500)
             .style("opacity", 0);
        })

        svg.append("g")
      .selectAll("g")
      .data(data1)
      .enter().append("g")
        .attr("transform", function(d) { return "translate(" + x0(d.Map) + ",0)"; })
      .selectAll("rect")
      .data(function(d) { return keys.map(function(key) { return {key: key, value: d[key]}; }); })
      .enter().append("rect")
        .attr("x", function(d) { return x1(d.key) + x1.bandwidth()/2; })
        .attr("y", function(d) { return y(d.value); })
        .attr("width", x1.bandwidth()/2)
        .attr("height", function(d) { return height - y(d.value); })
        .attr("class", "bar")
        .attr("fill", function(d) { return z(d.key); })
        .on("mouseover", function(d){
          div.transition()
              .duration(200)
              .style("opacity", .9);
          div.html("<strong>Side:</strong> <span style='color:white'>" + d.key + "</span><br>" + 
                   "<strong>Win%:</strong> <span style='color:white'>" + d.value + "%</span>")
              .style("left", (d3.event.pageX) + "px")
              .style("top", (d3.event.pageY - 42) + "px");
        })
        .on("mouseleave", function(d){
          div.transition()
             .duration(500)
             .style("opacity", 0);
        })

        var legend = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys)
      .enter().append("g")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

        legend.append("rect")
            .attr("x", width + 5)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", z2);

        legend.append("text")
            .attr("x", width + 22)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .attr("text-anchor", "start")
            .text(function(d) { return d; });


        var legend2 = svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("class", "legend2")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
      .selectAll("g")
      .data(keys)
      .enter().append("g")
        .attr("transform", function(d, i) { 
          i++;
          if(i==2){
            return "translate(0," + i * 37 + ")"; 
          }
          return "translate(0," + i * 55 + ")"; 
        });

        legend2.append("rect")
            .attr("x", width + 5)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", z);

        legend2.append("text")
            .attr("x", width + 22)
            .attr("y", 9.5)
            .attr("dy", "0.32em")
            .attr("text-anchor", "start")
            .text(function(d) { return d; });
    }

  }else{
    svg.append("g")
    .selectAll("g")
    .data(data1)
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
        div.html("<strong>Side:</strong> <span style='color:white'>" + d.key + "</span><br>" + 
                 "<strong>Win%:</strong> <span style='color:white'>" + d.value + "%</span>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 42) + "px");
      })
      .on("mouseleave", function(d){
        div.transition()
           .duration(500)
           .style("opacity", 0);
      })

    var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
    .selectAll("g")
    .data(keys)
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
  }
  

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

});
}


var checkbox1 = $("#checkbox1").prop('checked');
var checkbox2 = $("#checkbox2").prop('checked');
var checkbox3 = $("#checkbox3").prop('checked');
var checkbox4 = $("#checkbox4").prop('checked');
var checkbox5 = $("#checkbox5").prop('checked');
var checkbox6 = $("#checkbox6").prop('checked');
var checkbox7 = $("#checkbox7").prop('checked');
var checkbox8 = $("#checkbox8").prop('checked');

gen_barchart(idTournament);

$("#checkbox1").on("change", function(){
  checkbox1 = $("#checkbox1").prop('checked');
  gen_barchart(idTournament);
})
$("#checkbox2").on("change", function(){
  checkbox2 = $("#checkbox2").prop('checked');
  gen_barchart(idTournament);
})
$("#checkbox3").on("change", function(){
  checkbox3 = $("#checkbox3").prop('checked');
  gen_barchart(idTournament);
})
$("#checkbox4").on("change", function(){
  checkbox4 = $("#checkbox4").prop('checked');
  gen_barchart(idTournament);
})
$("#checkbox5").on("change", function(){
  checkbox5 = $("#checkbox5").prop('checked');
  gen_barchart(idTournament);
})
$("#checkbox6").on("change", function(){
  checkbox6 = $("#checkbox6").prop('checked');
  gen_barchart(idTournament);
})
$("#checkbox7").on("change", function(){
  checkbox7 = $("#checkbox7").prop('checked');
  gen_barchart(idTournament);
})
$("#checkbox8").on("change", function(){
  checkbox8 = $("#checkbox8").prop('checked');
  gen_barchart(idTournament);
})