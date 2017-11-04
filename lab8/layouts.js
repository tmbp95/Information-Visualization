function treemap(){

  var width = 800,
      height = 600;
      
  var treemap = d3.treemap()
      .size([width, height])
      .padding(1);

  var format = d3.format(",d");

  var stratify = d3.stratify()
      .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  d3.csv("flare.csv", type, function(error, data) {
    if (error) throw error;

    var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

    treemap(root);
    
  });
  

  function type(d) {
    d.value = +d.value;
    return d;
  }
}

function pack(){
    var width = 800,
      height = 600;
      
  var svg = d3.select("svg"),
      width = width
      height = height

  var format = d3.format(",d");

  
  var stratify = d3.stratify()
      .parentId(function(d) { return d.id.substring(0, d.id.lastIndexOf(".")); });

  var pack = d3.pack()
      .size([width - 2, height - 2])
      .padding(3);

  d3.csv("flare.csv", function(error, data) {
    if (error) throw error;

    var root = stratify(data)
        .sum(function(d) { return d.value; })
        .sort(function(a, b) { return b.value - a.value; });

    pack(root);


    
  });

  
}