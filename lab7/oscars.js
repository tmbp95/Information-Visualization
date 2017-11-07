var dataset, full_dataset;

d3.json("oscar_winners.json", function (data) {
    full_dataset = data;
    dataset	=	full_dataset.slice(0,35);
    gen_vis();
})

function gen_vis() {
	var	w	=	800;					
	var	h	=	400;	
	var	svg	=	d3.select("#the_chart");
	svg = svg.append("svg")																	
				.attr("width",w)																	
				.attr("height",h);
	var padding = 30;
	var hscale = d3.scaleLinear()
							.domain([10,0])
							.range([padding,h-padding]);
	var xscale = d3.scaleLinear()
							.domain([0,dataset.length])
							.range([padding,w-padding]);
	var	yaxis =	d3.axisLeft()	
							.scale(hscale);	
	var bar_w = 15;
	var xaxis = d3.axisBottom()
					.scale(d3.scaleLinear()
							.domain([dataset[0].oscar_year,dataset[dataset.length-1].oscar_year])																	
							.range([padding+bar_w/2,w-padding-bar_w/2]))															
						.tickFormat(d3.format("d"))															
						.ticks(dataset.length/4);																		
	svg.append("g")				
			.attr("transform","translate(30,0)")
			.attr("class","y axis")							
			.call(yaxis);

	svg.append("g")				
			.attr("transform","translate(0,"	+	(h-padding)	+	")")					
			.call(xaxis)
	svg.selectAll("rect").append("title")		
			.data(dataset)								
			.text(function(d)	{	return	d.title;})
		.enter().append("rect")
			.attr("width",Math.floor((w-padding*2)/dataset.length)-1)
			.attr("height",function(d){return h-padding-hscale(d.rating);})								
			.attr("fill","purple")
			.attr("x",function(d,i){return xscale(i);})
			.attr("y",function(d){return hscale(d.rating);});	

	d3.selectAll("#old")			
		.on("click",	function()	{					
			dataset	=	full_dataset.slice(35,70);					
			bar_w	=	Math.floor((w-padding*2)/dataset.length)-1;					
			svg.selectAll("rect")								
				.data(dataset)				
				.transition()								
				.duration(1000)
				.attr("height",function(d)	{																											
					return	h-padding-hscale(d.rating);																				
				})										
				.attr("fill","red")										
				.attr("y",function(d)	{																				
					return	hscale(d.rating);																				
				})										
				.select("title")													
				xaxis.scale(d3.scaleLinear()																
					.domain([dataset[0].oscar_year,dataset[dataset.length-1].oscar_year])																
					.range([padding+bar_w/2,w-padding-bar_w/2]));	
				d3.select(".x.axis")														
				.call(xaxis);		
		})	
}

function gen_vis2() {
	var	w	=	800;					
	var	h	=	400;	
	var	svg	=	d3.select("#the_chart");
	svg = svg.append("svg")																	
				.attr("width",w)																	
				.attr("height",h);
	var padding = 30;
	var hscale = d3.scaleLinear()
							.domain([10,0])
							.range([padding,h-padding]);
	var xscale = d3.scaleLinear()
							.domain([0,dataset.length])
							.range([padding,w-padding]);
	var	yaxis =	d3.axisLeft()	
							.scale(hscale);	
	var bar_w = 15;
	var xaxis = d3.axisBottom()
					.scale(d3.scaleLinear()
							.domain([dataset[0].budget/100000,dataset[dataset.length-1].budget/100000])																	
							.range([w-padding-bar_w/2,padding+bar_w/2]))															
						.tickFormat(d3.format("d"))															
						.ticks(dataset.length/4);																		
	svg.append("g")				
			.attr("transform","translate(30,0)")
			.attr("class","y axis")							
			.call(yaxis);

	svg.append("g")				
			.attr("transform","translate(0,"	+	(h-padding)	+	")")					
			.call(xaxis)

	/*var xscale = d3.scaleLinear()
						.domain([0,d3.max(full_dataset, function(d){
								return d.budget;})/1000000])
						.range([padding,w-padding]); */
	var xscale = d3.scaleLog()
						.domain([0.5,d3.max(full_dataset, function(d){
								return d.budget;})/1000000])
						.range([padding,w-padding]);
	var cscale = d3.scaleLinear()
						.domain([d3.min(full_dataset, function(d){ return d.year;}),
 								 d3.max(full_dataset, function(d){ return d.year;})])
						.range(["red","blue"]);

	var r = 5;
	svg.selectAll("circle")
			.data(full_dataset)
		.enter().append("circle")
			.attr("r",r)
			.attr("fill",function(d,i){ return cscale(d.year); })
			.attr("cx",function(d,i){
							if(d.budget == 0) {return padding;}
							return xscale(d.budget/1000000);
					})
			.attr("cy",function(d){
							return hscale(d.rating);
						})
			.attr("title")
				.text(function(d) {return d.title;});
}