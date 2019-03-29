var dispatch4 = d3.dispatch("BallClick");
var selectedBall;
var BallClick = 0;
var clickedBall;
var begin = true;
var idTournament, nameTournament;
var show = 0;
var colorBall,size;

dispatch4.on("BallClick.bubblechart", function(data){
  if(BallClick==0){
    gen_horizbarchart(data.NAME, idTournament);
    gen_radarchartPlayers(idTournament);
    $(".barcharttBOX").slideDown(300);
  }else{
    $(".barcharttBOX").slideUp(300);
    
    gen_horizbarchart(data.NAME, idTournament);
    gen_radarchartPlayers(idTournament);
    $(".barcharttBOX").slideDown(300);
  }
  BallClick = 1;
  if(clickedBall == null){
    begin = false;
    clickedBall = data.NAME;

    selectedBall = d3.select("circle[title=\'"+clickedBall+"\'");
    colorBall = selectedBall.attr("fill");
    selectedBall.transition() // <------- TRANSITION STARTS HERE --------
                .delay(0) 
                .duration(200)
                .attr("fill","orange")
                .attr("stroke", "#6d6E70")
                .attr("stroke-width", 2);


    var killsinput = $("#killsinput").prop('checked');
    var deathsinput = $("#deathsinput").prop('checked');
    var lossesinput = $("#lossesinput").prop('checked');
    var winsinput = $("#winsinput").prop('checked');
    gen_radarchart(idTournament);
    gen_barchart(idTournament);
  }else{
    selectedBall = d3.select("circle[title=\'"+clickedBall+"\'");
    selectedBall.transition();
    selectedBall.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill",colorBall)
               .attr("stroke-width", 0)
    clickedBall = data.NAME;
    selectedBall = d3.select("circle[title=\'"+data.NAME+"\'");
    colorBall = selectedBall.attr("fill");
    selectedBall.transition() // <------- TRANSITION STARTS HERE --------
               .delay(0) 
               .duration(200)
               .attr("fill","orange")
               .attr("stroke", "#6d6E70")
                .attr("stroke-width", 2);
    var killsinput = $("#killsinput").prop('checked');
    var deathsinput = $("#deathsinput").prop('checked');
    var lossesinput = $("#lossesinput").prop('checked');
    var winsinput = $("#winsinput").prop('checked');
    gen_radarchart(idTournament);
    gen_barchart(idTournament);
  }
})

function teste(data, data2){
  idTournament = data;
  nameTournament = data2;
  $("#tournamentsfont").html(nameTournament);
  if(show==0){
    gen_bubblechart(idTournament);
    gen_radarchart(idTournament);
    gen_barchart(idTournament);
    $(".bubblechartBOX").slideDown(300);
  }else{
    $(".barcharttBOX").slideUp(300);
    $(".bubblechartBOX").slideUp(300);
    d3.select("#bubblechart").selectAll("svg").remove();
    gen_bubblechart(idTournament);
    gen_radarchart(idTournament);
    gen_barchart(idTournament);
    $(".bubblechartBOX").slideDown(300);
  }
}
  
function gen_bubblechart(id_Tournament) {
  
  d3.select("#bubblechart").selectAll("svg").remove();
  show = 1;
  // Set the dimensions of the canvas / graph
  var margin = {top: 30, right: 30, bottom: 80, left: 55},
      width = 590 - margin.left - margin.right,
      height = 300 - margin.top - margin.bottom;

  // Set the ranges
  var x = d3.scaleBand().range([0, width])
                        .padding(1);
  var y = d3.scaleLinear().range([height, 0]);  


  // Adds the svg canvas
  var svg = d3.select("#bubblechart")
      .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
      .append("g")
          .attr("transform", 
                "translate(" + margin.left + "," + margin.top + ")");

  var div = d3.select("body").append("div")
    .attr("class", "tooltip10")
    .style("opacity", 0);

  // Get the data
  d3.json("data/bubblechart.json", function(error, data) {

      data.forEach(function(d) {
          d.Tournament = d.Tournament;
          d.NAME = d.NAME;
          d.Rating = +d.Rating;
          d.Prize = d.Prize;
      });

      var vector = [];
      for(i=0;i<data.length;i++){
        if(data[i].Tournament == id_Tournament){
          vector.push(data[i]);
        }
      }

      data = vector;
      $(".dataInput").val(JSON.stringify(data));
      waitForElement();

      x.domain(data.map(function(d) { return d.NAME; }));
      y.domain([0, d3.max(data, function(d) { return d.Rating; })+1]);
      var maxPrize = d3.max(data, function(d) { return d.Prize; })

      var yAxis = d3.axisLeft()
                    .ticks(4)
                    .scale(y);                  

      var xAxis = d3.axisBottom()
                .scale(x);
    
      // Add the scatterplot
      svg.selectAll("circle")
          .data(data)
        .enter().append("circle")
          .attr("r", function(d) { 
            if(d.Prize==0){ 
              return 4;
            }else if(d.Ranking == 1){
              return 14;
            }else if(d.Ranking == 2){
              return 10;
            }else if(d.Ranking == 3){
              return 6;
            }else{
              return 4;
            }


          })
          .attr("fill", function(d){
            if(d.Ranking==1){
               $(".Teamlabel").html(d.NAME);
               $("#nameofteam").val(d.NAME);
             var widthBox = parseFloat($(".Teamlabel").css("width"));
             $(".Teamlabel").css("left", "30%");
            $(".Teamlabel").css("margin-left", -(widthBox/2));
            $("#legenda1").html(d.NAME.substring(0,7));
              return "#41848b";

            }else if(d.Ranking==2){
              return "#52a6af";
            }else if(d.Ranking==3){
              return "#71e7f4";
            }else{
              return "black;"
            }
          }) 
          .attr("stroke","#eee")
          .attr("stroke-width", 1)
          .attr("cursor","pointer")
          .attr("class","bubblechartBall")
          .attr("cx", function(d) { return x(d.NAME); })
          .attr("cy", function(d) { return y(d.Rating); })
          .attr("title", function(d) {return d.NAME;})
          .on("click", function(d) {
            dispatch4.call("BallClick", d, d);
          })
          .on("mouseover", function(d){
            var PrizeMoney;
            if(maxPrize == 0){
              PrizeMoney = "Tournament without Prize";
            }else{
              PrizeMoney = d.Prize + " €";
            }
        div.transition()
            .duration(200)
            .style("opacity", .9);
        div.html("<strong>Team:</strong> <span style='color:white'>" + d.NAME + "</span><br>" + 
                 "<strong>Rating:</strong> <span style='color:white'>" + d.Rating + "</span><br>" + 
                 "<strong>Rank:</strong> <span style='color:white'>" + d.Ranking + "</span><br>" + 
                 "<strong>Prize:</strong> <span style='color:white'>" + PrizeMoney + "</span>")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 68) + "px");

            if(BallClick==1){
              if(clickedBall != d.NAME){
                $(".Teamlabel").html(clickedBall + " VS " + d.NAME);
                var widthBox = parseFloat($(".Teamlabel").css("width"));
                $(".Teamlabel").css("left", "30%");
                $(".Teamlabel").css("margin-left", -(widthBox/2));
                $("#legenda1").html(clickedBall.substring(0,7));
                $("#legenda2").html(d.NAME.substring(0,7));
                $("#nameofteam").val(d.NAME);
                gen_radarchart(idTournament); 
                gen_barchart(idTournament);
              }else{
                $(".Teamlabel").html(d.NAME);
                var widthBox = parseFloat($(".Teamlabel").css("width"));
                $(".Teamlabel").css("left", "30%");
                $(".Teamlabel").css("margin-left", -(widthBox/2));
                $("#legenda1").html(d.NAME.substring(0,7));
                $("#nameofteam").val(d.NAME);
                gen_radarchart(idTournament);
                gen_barchart(idTournament);
              }
            }else if(BallClick == 0){
              $(".Teamlabel").html(d.NAME);
              var widthBox = parseFloat($(".Teamlabel").css("width"));
              $(".Teamlabel").css("left", "30%");
              $(".Teamlabel").css("margin-left", -(widthBox/2));
              $("#legenda1").html(d.NAME.substring(0,7));
              $("#nameofteam").val(d.NAME);
              gen_radarchart(idTournament);
              gen_barchart(idTournament);
            }
      })
      .on("mouseleave", function(d){
        div.transition()
           .duration(500)
           .style("opacity", 0);
      });

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", function(d) {
                return "rotate(-35)" 
                });

      svg.append("text")             
      .attr("transform", "translate(" + (width/2) + " ," + (height + margin.top + 5) + ")")
      .style("text-anchor", "middle")
      .text("Teams")
      .attr("dx", "18em")
      .attr("dy", "-0.5em")

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
      .text(function(d){ return "Rating"});      


  });
}
