var rec;
var myList = new Array();
var newList = new Array(); 
var emptyList = 0;
var otherList = new Array();

var ratingList = new Array();
var winnersList = new Array();

newList.push("EventID");
for(i=1;i<=138;i++){
	newList.push(i);
}

myList.push(newList);

d3.csv("js/ratingTeamTotalCompleteFinal.csv")
   .get(function(error, rows) {
	rows.forEach(function(d) { 
		ratingList.push(d);
  	});		
	
    d3.csv("js/TeamWinners.csv")
  		.get(function(error, rows) {
		rows.forEach(function(d) { 
			newList = new Array(); 
		    rec = d[1];
		    newList.push(d.id);
		    newList.push(rec);
		    for(i=2;i<=138;i++){
		    	if(d[i] == rec){
		    		if(d[i]==""){
		    			newList.push("null");
		    		}else{
		    			emptyList++;
		    		}
		    	}else{
		    		if(d[i]!=""){
		    			newList.push(d[i]);
		    			rec = d[i];
		    		}else{
		    			newList.push("null");
		    		}
		    	}
		    }
		    for(k=1;k<=emptyList;k++){
		    	newList.push("null");
		    }
		    myList.push(newList);
			winnersList.push(d);
		});
		winnersList = myList;
  		console.log(ratingList);
  		console.log(winnersList);
  		for(i=0;i<ratingList.length;i++){
  			for(j=0;j<winnersList.length;j++){
  				if(ratingList[i].EventID == winnersList[j][0]){
  					for(count=1;count<=138;count++){
  						if(ratingList[i].TeamID == winnersList[j][count]){
  							ratingList[i].Rank = count;
  						}
  					}
  				}
  			}
  		}
  		console.log(ratingList);

		window.onload = function(){
			alasql("SELECT * INTO CSV('ratingRankList.csv') FROM ?",[ratingList]);
		};

	});  	
});		