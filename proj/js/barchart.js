
var dataset, full_dataset;
var dispatch = d3.dispatch("movieEnter", "movieOut");
var selectedBar;

dispatch.on("movieEnter.bars", function(movie){
  selectedBar = d3.select("rect[Letter=\'"+movie.Letter+"\'");
  selectedBar.attr("fill","red");
})

dispatch.on("movieOut.bars", function(movie){
  selectedBar = d3.select("rect[Letter=\'"+movie.Letter+"\'");
  selectedBar.attr("fill","purple");
})

function sortByProperty(objArray, prop, direction){
    if (arguments.length<2) throw new Error("ARRAY, AND OBJECT PROPERTY MINIMUM ARGUMENTS, OPTIONAL DIRECTION");
    if (!Array.isArray(objArray)) throw new Error("FIRST ARGUMENT NOT AN ARRAY");
    const clone = objArray.slice(0);
    const direct = arguments.length>2 ? arguments[2] : 1; //Default to ascending
    const propPath = (prop.constructor===Array) ? prop : prop.split(".");
    clone.sort(function(a,b){
        for (let p in propPath){
                if (a[propPath[p]] && b[propPath[p]]){
                    a = a[propPath[p]];
                    b = b[propPath[p]];
                }
        }
        return ( (a < b) ? -1*direct : ((a > b) ? 1*direct : 0) );
    });
    return clone;
}




d3.json("js/data.json", function (data) {
    data.forEach(function(d) {
        d.Letter = d.Letter;
        d.Freq = +d.Freq;
    });
    full_dataset = data;    
    dataset = sortByProperty(full_dataset, 'attributes.Freq', -1).slice(0,5);
    gen_bars();
});
  


function gen_bars() {
    var w = 300;
    var h = 200;

    var svg = d3.select("#the_chart")
                .append("svg")
                .attr("width",w)
                .attr("height",h);
      

    var padding = 30;
    var bar_w = 1;

    var margin = {top: 20, right: 20, bottom: 70, left: 40},
    width = 600 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;


    var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);

    var y = d3.scale.linear().range([height, 0]);

    x.domain(dataset.map(function(d) { return d.Letter; }));
    y.domain([0, d3.max(dataset, function(d) { return d.Freq; })]);



  
    var yaxis = d3.axisLeft()
                  .scale(y);                  

    var xaxis = d3.axisBottom()
              .scale(d3.scaleLinear()
              .domain([dataset[0].Letter,dataset[dataset.length-1].Letter])
              .range([padding+bar_w/2,w-padding-bar_w/2]))
              .tickFormat(d3.format("d"))
              .ticks(dataset.length/4);
              //.ticks(20);

    svg.append("g")
    .attr("transform","translate(30,0)")  
  .attr("class","y axis")
  .call(yaxis);

    svg.append("g")
    .attr("transform","translate(0," + (h-padding) + ")")
  .call(xaxis);

 
    svg.selectAll("rect")
    .data(dataset)
    .enter().append("rect")
    .on("mouseover", function(d){
      dispatch.call("movieEnter", d, d);
    })
    .on("mouseleave", function(d){
      dispatch.call("movieOut", d, d);
    })
    .attr("width",Math.floor((w-padding*4)/dataset.length)-1)
    .attr("height",function(d) {
                          return h-padding-y(d.Freq);
                   })
     .attr("fill","purple")     
     .attr("x",function(d, i) {
                          return x(i);
                   })
     .attr("y",function(d) {
                   return y(d.Freq);
                   })
     .attr("Letter", function(d) {return d.Letter;});

}
