var dispatch9 = d3.dispatch("BarClick");
var selectedBar;
var BarClick = 0;
var clickedBar;
var colorBar;

dispatch9.on("BarClick.barchart", function(data){
  BarClick = 1;

  if(clickedBar == null){
    clickedBar = data.name;
    console.log(clickedBar)
    selectedBar = d3.select("rect[title=\'"+data.name+"\'");
    console.log(selectedBar)
    colorBar = selectedBar.attr("fill");
    selectedBar.transition() // <------- TRANSITION STARTS HERE --------
                .delay(0) 
                .duration(200)
                .attr("fill","orange")

    var killsinput = $("#killsinput").prop('checked');
    var deathsinput = $("#deathsinput").prop('checked');
    var lossesinput = $("#lossesinput").prop('checked');
    var winsinput = $("#winsinput").prop('checked');
    gen_radarchartPlayers(idTournament);
  }else{
    selectedBar = d3.select("rect[title=\'"+clickedBar+"\'");
    selectedBar.transition();
    selectedBar.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill",colorBar)
    clickedBar = data.name;
    selectedBar = d3.select("rect[title=\'"+data.name+"\'");
    colorBar = selectedBar.attr("fill");
    selectedBar.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill","orange")
    var killsinput2 = $("#killsinput2").prop('checked');
    var deathsinput2 = $("#deathsinput2").prop('checked');
    var lossesinput2 = $("#lossesinput2").prop('checked');
    var winsinput2 = $("#winsinput2").prop('checked');
    gen_radarchartPlayers(idTournament);
  }
})

function gen_horizbarchart(name,ola) {
var idTournament = ola;
$("#teamsfont").html(name);
var margin = {top: 10, right: 11, bottom: 55, left: 30},
      width = 280 - margin.left - margin.right,
      height = 250 - margin.top - margin.bottom;

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

    var vectorData = [];
    var average = 0;
    for(i=0;i<data.length;i++){
      if(data[i].team == name && data[i].tournament == idTournament){
        vectorData.push(data[i]);
        average += data[i].rating;
      }
    }
    $(".Playerlabel").html(data[0].name);
    $("#nameofplayer").val(data[0].name);
    var widthBox = parseFloat($(".Playerlabel").css("width"));
    $(".Playerlabel").css("left", "30%");
    $(".Playerlabel").css("margin-left", -(widthBox/2));

    average = average/5;
    average = average.toFixed(2);

    data = vectorData;
  
  	data.sort(function(a) { return a.rating; });
  
  	x.domain([0, d3.max(data, function(d) { return d.rating; })+0.5]);
    y.domain(data.map(function(d) { return d.name; })).padding(0.1);


    var filter = g.append('defs').append('filter').attr('id','glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation','1').attr('result','coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in','coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in','SourceGraphic');

    g.append("g")
        .attr("class", "x axis")
       	.attr("transform", "translate(0," + height + ")")
      	.call(d3.axisBottom(x).ticks(4).tickSizeInner([-height]));

    g.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
      .style("text-anchor", "middle")
      .attr("dy", "2em")
      .style("font-size", "0.9em")
      .text("Rating"); 

    g.append("g")
        .attr("class", "y axis")
        .call(d3.axisLeft(y));

    g.append("text")
      .attr("dy", "-0.5em")
      .attr("dx", "-3.8em")
      .attr("text-anchor", "start")
      .style("font-size", "0.9em")
      .text("Players"); 

      var svgDefs = svg.append('defs');

      var svgDefs2 = svg.append('defs');


      var mainGradient = svgDefs.append('linearGradient')
                                .attr('id', 'mainGradient');


      mainGradient.append('stop')
                .attr('class', 'stop-left')
                .attr('offset', '0');

      mainGradient.append('stop')
                .attr('class', 'stop-right')
                .attr('offset', '1');


      var mainGradient2 = svgDefs2.append('linearGradient')
                                .attr('id', 'mainGradient2');


      mainGradient2.append('stop')
                .attr('class', 'stop-left2')
                .attr('offset', '0');

      mainGradient2.append('stop')
                .attr('class', 'stop-right2')
                .attr('offset', '1');

      g.append("rect")
        .classed('filled', true)
        .style("fill-opacity", 0.2)
        .style("filter" , "url(#glow)")
        .attr("x", 0)
        .attr("y", 0 )
        .attr("height", height)
        .attr("width", function(){ return x(average)})

      g.append("rect")
        .classed('filled2', true)
        .style("fill-opacity", 0.2)
        .style("filter" , "url(#glow)")
        .attr("x", function(){ return x(average)})
        .attr("y", 0 )
        .attr("height", height)
        .attr("width", width)

    g.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("fill", "#52a6af")
        .attr("class", "bar")
        .attr("title", function(d) {return d.name;})
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", function(d) { return y(d.name); })
        .attr("width", function(d) { return x(d.rating); })
        .on("click", function(d) {
            dispatch9.call("BarClick", d, d);
         })
        .on("mouseover", function(d){
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("<strong>Player:</strong> <span style='color:white'>" + d.name + "</span><br>" + 
                 "<strong>Rating:</strong> <span style='color:white'>" + d.rating + "</span>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");

        if(BarClick==1){
              if(clickedBar != d.name){
                $(".Playerlabel").html(clickedBar + " VS " + d.name);
                var widthBox = parseFloat($(".Playerlabel").css("width"));
                $(".Playerlabel").css("left", "29%");
                $(".Playerlabel").css("margin-left", -(widthBox/2));
                $("#legenda1").html(clickedBar.substring(0,9));
                $("#legenda2").html(d.name.substring(0,9));
                $("#nameofplayer").val(d.name);
                gen_radarchartPlayers(idTournament); 
              }else{
                $(".Playerlabel").html(d.name);
                var widthBox = parseFloat($(".Playerlabel").css("width"));
                $(".Playerlabel").css("left", "27%");
                $(".Playerlabel").css("margin-left", -(widthBox/2));
                $("#legenda1").html(d.name.substring(0,9));
                $("#nameofplayer").val(d.name);
                gen_radarchartPlayers(idTournament);
              }
            }else if(BarClick == 0){
              $(".Playerlabel").html(d.name);
              var widthBox = parseFloat($(".Playerlabel").css("width"));
              $(".Playerlabel").css("left", "27%");
              $(".Playerlabel").css("margin-left", -(widthBox/2));
              $("#legenda1").html(d.name.substring(0,9));
              $("#nameofplayer").val(d.name);
              gen_radarchartPlayers(idTournament);
            }
      })
      .on("mouseleave", function(d){
        div.transition()
           .duration(500)
           .style("opacity", 0);
      });

     g.append("rect")
        .attr("class", "bar")
        .attr("x", function() { return x(average); })
        .attr("height", height+20)
        .attr("y", -10 )
        .attr("width", 0.7)
        .attr("stroke", "orange")
        .attr("fill", "transparent")
        .on("mouseover", function(d){
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("<strong>Average:</strong> <span style='color:white'>" + average + "</span><br>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY) + "px");
      })
      .on("mouseleave", function(d){
        div.transition()
           .duration(500)
           .style("opacity", 0);
      })

      g.append("text")             
        .style("text-anchor", "middle")
        .attr("x", function() { return x(average); })
        .attr("y", -13 )
        .style("font-size", "0.7em")
        .text("Average");

});
}