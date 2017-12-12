function gen_radarchart() {
  console.log(killsinput, deathsinput, lossesinput, winsinput)
  d3.select("#radarchart").selectAll("svg").remove();
var width = 120,
    height = 120;

// Config for the Radar chart
var config = {
    w: width,
    h: height,
    maxValue: 100,
    levels: 5,
    ExtraWidthX: 150
}

//Call function to draw the Radar chart
d3.json("data/teste2.json", function(error, data) {
    if (error) throw error;
    console.log(data);
    var arrayAxis = [];
    var arrayAxis2 = [];
    for(i=0;i<data[0].length;i++){
      console.log(data[0][i].area)
      if(data[0][i].area == "Kills" && killsinput===true){
        arrayAxis2.push(data[0][i]);
      }
      if(data[0][i].area == "Deaths" && deathsinput===true){
        arrayAxis2.push(data[0][i]);
      }
      if(data[0][i].area == "Losses" && lossesinput===true){
        arrayAxis2.push(data[0][i]);
      }
      if(data[0][i].area == "Wins" && winsinput===true){
        arrayAxis2.push(data[0][i]);
      }
    }
    arrayAxis.push(arrayAxis2);
    console.log(arrayAxis)
    RadarChart.draw("#radarchart", arrayAxis, config);
});

var svg = d3.select('body')
  .selectAll('svg')
  .append('svg')
  .attr("width", width)
  .attr("height", height);

var RadarChart = {
  draw: function(id, d, options){
    var cfg = {
     radius: 5,
     w: 150,
     h: 150,
     factor: 1,
     factorLegend: .85,
     levels: 3,
     maxValue: 0,
     radians: 2 * Math.PI,
     opacityArea: 0.5,
     ToRight: 5,
     TranslateX: 70,
     TranslateY: 30,
     ExtraWidthX: 100,
     ExtraWidthY: 80,
     color: d3.scaleOrdinal().range(["#52a6af", "#CA0D59"])
    };
	
    if('undefined' !== typeof options){
      for(var i in options){
      if('undefined' !== typeof options[i]){
        cfg[i] = options[i];
      }
      }
    }
    
    cfg.maxValue = 100;
    
    var allAxis = (d[0].map(function(i, j){return i.area}));
  
    var total = allAxis.length;
    var radius = cfg.factor*Math.min(cfg.w/2, cfg.h/2);
    var Format = d3.format('%');
    d3.select(id).select("svg").remove();

    var g = d3.select(id)
        .append("svg")
        .attr("width", cfg.w+cfg.ExtraWidthX)
        .attr("height", cfg.h+cfg.ExtraWidthY)
        .append("g")
        .attr("transform", "translate(" + cfg.TranslateX + "," + cfg.TranslateY + ")");

		var tooltip;
	
    //Circular segments
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data(allAxis)
       .enter()
       .append("svg:line")
       .attr("x1", function(d, i){return levelFactor*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
       .attr("y1", function(d, i){return levelFactor*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
       .attr("x2", function(d, i){return levelFactor*(1-cfg.factor*Math.sin((i+1)*cfg.radians/total));})
       .attr("y2", function(d, i){return levelFactor*(1-cfg.factor*Math.cos((i+1)*cfg.radians/total));})
       .attr("class", "line")
       .style("stroke", "grey")
       .style("stroke-opacity", "0.75")
       .style("stroke-width", "0.3px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor) + ", " + (cfg.h/2-levelFactor) + ")");
    }

    //Text indicating at what % each level is
    for(var j=0; j<cfg.levels; j++){
      var levelFactor = cfg.factor*radius*((j+1)/cfg.levels);
      g.selectAll(".levels")
       .data([1]) //dummy data
       .enter()
       .append("svg:text")
       .attr("x", function(d){return levelFactor*(1-cfg.factor*Math.sin(0));})
       .attr("y", function(d){return levelFactor*(1-cfg.factor*Math.cos(0));})
       .attr("class", "legend")
       .style("font-family", "sans-serif")
       .style("font-size", "10px")
       .attr("transform", "translate(" + (cfg.w/2-levelFactor + cfg.ToRight) + ", " + (cfg.h/2-levelFactor) + ")")
       .attr("fill", "#737373")
       .text((j+1)*100/cfg.levels);
    }

    series = 0;

    var axis = g.selectAll(".axis")
        .data(allAxis)
        .enter()
        .append("g")
        .attr("class", "axis");

    axis.append("line")
      .attr("x1", cfg.w/2)
      .attr("y1", cfg.h/2)
      .attr("x2", function(d, i){return cfg.w/2*(1-cfg.factor*Math.sin(i*cfg.radians/total));})
      .attr("y2", function(d, i){return cfg.h/2*(1-cfg.factor*Math.cos(i*cfg.radians/total));})
      .attr("class", "line")
      .style("stroke", "grey")
      .style("stroke-width", "1px");

    axis.append("text")
      .attr("class", "legend")
      .text(function(d){return d})
      .style("font-family", "sans-serif")
      .style("font-size", "11px")
      .attr("text-anchor", "middle")
      .attr("dy", "1.5em")
      .attr("transform", function(d, i){return "translate(0, -10)"})
      .attr("x", function(d, i){return cfg.w/2*(1-cfg.factorLegend*Math.sin(i*cfg.radians/total))-60*Math.sin(i*cfg.radians/total);})
      .attr("y", function(d, i){return cfg.h/2*(1-Math.cos(i*cfg.radians/total))-20*Math.cos(i*cfg.radians/total);});

 
    d.forEach(function(y, x){
      dataValues = [];
      g.selectAll(".nodes")
      .data(y, function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
        ]);
      });
      dataValues.push(dataValues[0]);
      g.selectAll(".area")
             .data([dataValues])
             .enter()
             .append("polygon")
             .attr("class", "radar-chart-serie"+series)
             .style("stroke-width", "2px")
             .style("stroke", function(){
              if(BallClick==1){
                return "orange";
              }else{
                return cfg.color(series);
              }
              })
             .attr("points",function(d) {
               var str="";
               for(var pti=0;pti<d.length;pti++){
                 str=str+d[pti][0]+","+d[pti][1]+" ";
               }
               return str;
              })
             .style("fill", function(j, i){
              if(BallClick==1){
                return "orange";
              }else{
                return cfg.color(series)
              }
             
            })
             .style("fill-opacity", cfg.opacityArea)
             .on('mouseover', function (d){
                      z = "polygon."+d3.select(this).attr("class");
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", 0.1); 
                      g.selectAll(z)
                       .transition(200)
                       .style("fill-opacity", .7);
                      })
             .on('mouseout', function(){
                      g.selectAll("polygon")
                       .transition(200)
                       .style("fill-opacity", cfg.opacityArea);
             });
      series++;
    });
    series=0;


var tooltip = d3.select("body").append("div").attr("class", "toolTip");
    d.forEach(function(y, x){
      g.selectAll(".nodes")
      .data(y).enter()
      .append("svg:circle")
      .attr("class", "radar-chart-serie"+series)
      .attr('r', cfg.radius)
      .attr("alt", function(j){return Math.max(j.value, 0)})
      .attr("cx", function(j, i){
        dataValues.push([
        cfg.w/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total)), 
        cfg.h/2*(1-(parseFloat(Math.max(j.value, 0))/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total))
      ]);
      return cfg.w/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.sin(i*cfg.radians/total));
      })
      .attr("cy", function(j, i){
        return cfg.h/2*(1-(Math.max(j.value, 0)/cfg.maxValue)*cfg.factor*Math.cos(i*cfg.radians/total));
      })
      .attr("data-id", function(j){return j.area})
      .style("fill", "#fff")
      .style("stroke-width", "2px")
      .style("stroke", function(){
        if(BallClick==1){
                return "orange";
              }else{
                return cfg.color(series)
              }
      })
      .style("fill-opacity", .9)
      .on('mouseover', function (d){
            tooltip
              .style("left", d3.event.pageX - 40 + "px")
              .style("top", d3.event.pageY - 80 + "px")
              .style("display", "inline-block")
      				.html((d.area) + "<br><span>" + (d.value) + "</span>");
            })
    		.on("mouseout", function(d){ tooltip.style("display", "none");});

      series++;
    });
    }
};
}
var killsinput = $("#killsinput").prop('checked');
var deathsinput = $("#deathsinput").prop('checked');
var lossesinput = $("#lossesinput").prop('checked');
var winsinput = $("#winsinput").prop('checked');
gen_radarchart();

$("#killsinput").change(function () {
  killsinput = $("#killsinput").prop('checked');
  gen_radarchart();
})
$("#deathsinput").on("change", function(){
  deathsinput = $("#deathsinput").prop('checked');
  gen_radarchart();
})
$("#lossesinput").on("change", function(){
  lossesinput = $("#lossesinput").prop('checked');
  gen_radarchart();
})
$("#winsinput").on("change", function(){
  winsinput = $("#winsinput").prop('checked');
  gen_radarchart();
})

console.log(killsinput, deathsinput, lossesinput, winsinput)

