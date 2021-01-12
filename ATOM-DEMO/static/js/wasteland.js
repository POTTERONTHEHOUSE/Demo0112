 phase="not started";
 workload=0;
 metric=0;
 x = Math.floor(Math.random() * 1000000000);  
 timestamp=0; 
 init_timestamp=0;
 rocks=0;
 i=0;
 j=0;
//datset



//system
/* if hidetable is called then togglesys will be needed
function togglesys(){
  $("#syscontent").collapse("toggle");
}*/
/*
function hidetables() {
  if(document.getElementById("graphd11").checked == true){
    //hide footprint
              $("#result-table12").hide();
              $("#result-table22").hide();
              $("#result-table11").show();
              $("#result-table21").show();
              document.getElementById("sysresult").innerHTML="GRAPHD";
            }
          else if (document.getElementById("graphd12").checked == true) {
    //hide i/o
            $("#result-table11").hide();
            $("#result-table21").hide();
            $("#result-table12").show();
            $("#result-table22").show();
            document.getElementById("sysresult").innerHTML="PREGELPLUS";
          }
      
}
*/
// for system select&form-control 
function switchtable(value) {  
  var selectedOption=value.options[value.selectedIndex];  
	console.log(selectedOption.value);
	if(selectedOption.value=="graphd"){
    $("#result-table12").hide();
    $("#result-table22").hide();
    $("#result-table11").show();
    $("#result-table21").show();
    
 	}else if(selectedOption.value=="pregelplus"){
    $("#result-table11").hide();
    $("#result-table21").hide();
    $("#result-table12").show();
    $("#result-table22").show();
    
   }   
}


//algorithm
function togglealg(){
  $("#algcontent").collapse("toggle");
}

function showalg1(){
  if(document.getElementById("algo11").checked == true){
    document.getElementById("algresult").innerHTML="MSSP";
  }
}
function showalg2(){
  if (document.getElementById("algo12").checked == true){
    document.getElementById("algresult").innerHTML="PPR";
  }
}

//cluster size
function toggleclusize(){
  var div1 = document.getElementById("clusizecontent");
  if (div1.style.display === "none") {
      div1.style.display = "block";
  } else {
      div1.style.display = "none";
  }
}

function showclusize1(){
  if(document.getElementById("machine11").checked == true){
    document.getElementById("clusizeresult").innerHTML="1";
  }
}
function showclusize2(){
  if (document.getElementById("machine12").checked == true){
    document.getElementById("clusizeresult").innerHTML="2";
  }
}
function showclusize3(){
  if(document.getElementById("machine13").checked == true){
    document.getElementById("clusizeresult").innerHTML="3";
  }
}
function showclusize4(){
  if (document.getElementById("machine14").checked == true){
    document.getElementById("clusizeresult").innerHTML="4";
  }
}
function showclusize5(){
  if(document.getElementById("machine15").checked == true){
    document.getElementById("clusizeresult").innerHTML="5";
  }
}
function showclusize6(){
  if (document.getElementById("machine16").checked == true){
    document.getElementById("clusizeresult").innerHTML="6";
  }
}
function showclusize7(){
  if(document.getElementById("machine17").checked == true){
    document.getElementById("clusizeresult").innerHTML="7";
  }
}
function showclusize8(){
  if (document.getElementById("machine18").checked == true){
    document.getElementById("clusizeresult").innerHTML="8";
  }
}
function showclusize9(){
  if (document.getElementById("machine19").checked == true){
    document.getElementById("clusizeresult").innerHTML=document.getElementById("usermachinenumber").value;
  }
}

//workload
function togglewl(){
  $("#wlcontent").collapse("toggle");
}

//when the "disable atom" is chosen, the block switches to "manual input"; 
// for workload select&form-control 
function switchatom() {  
  var div1 = document.getElementById("toatom");
  var div2 = document.getElementById("tomanual");
  var div3 = document.getElementById("enatom");
  if (div3.value == "Enable") {
      div1.style.display = "block";
      div2.style.display = "none";
  } else {
      div1.style.display = "none";
      div2.style.display = "block";
  } 
}
//then by clicking the spinning icon (with a tooltip) users can switch back to the original.
function switchmanual() {  
  var div1 = document.getElementById("toatom");
  var div2 = document.getElementById("tomanual");
  if (div2.style.display === "none") {
      div2.style.display = "block";
      div1.style.display = "none";
  } else {
      div2.style.display = "none";
      div1.style.display = "block";
  } 
}

function checkworkload(){
  var x = new Number;
  x = Number(document.getElementById("workload").value);
  if (isNaN(x) || x < 1 || x > 40960) {
    window.alert("Illegal workload! Please enter again!");
   } 
   else {
      window.alert("Success");
   }
  document.getElementById("wlresult").innerHTML=document.getElementById("workload").value;
}



// batchnumber input value alert
function checkbatchnumber() {
  var x = new Number;
  x = Number(document.getElementById("userbatchnumber").value);
  if (isNaN(x) || x < 1 || x > document.getElementById("workload").value) {window.alert("Illegal workload! Please enter again!");} else {
      window.alert("Success");
  }
}

// delete the last row for the tables in the rockit function
function deleterow(x) {
    var table = document.getElementById(x);
    console.log("table1",table);
    var rowCount = table.rows.length;

  table.deleteRow(rowCount -1);
  console.log("tabledeleterow",table);
  console.log(rowCount);
  
}

//server interface
function function1(x){
  if (phase=="end"){return;}
  $.ajax({
    url:'http://localhost:80/status_query',
    async:false,//for the return value
    type:'POST',
    contentType: "application/json",
    data:JSON.stringify({
      "uuid":x,
    }),
    success : function(data){
        var count = data.result;   
      
        phase=count[0].phase;
        workload=count[0].workload;
        metric=count[0].metric;
        var newtimestamp=Date.now()/1000;
        
        if (document.getElementById("chsys").value=="pregelplus"&&phase=="training"){
          //count the number of the training batch
          j++;
          var table_body = $("#table-body_pregelplus_tra");
          $("#pending-row").remove();
          var tr = $('<tr>' + '<td>' + '<img src="/static/images/check4.png" style="width:20px;margin-right:10px; float:left;"/>' + ' Batch ' + j + '</td><td>'  + workload + '</td><td>' + metric + '</td><td>'  + metric + '</td><td>' + (newtimestamp-timestamp)  + '</td><td>'+ (newtimestamp-init_timestamp) + '</td></tr>');
        }
        if (document.getElementById("chsys").value=="pregelplus"&&phase!="training"){
          i++;
          table_body= $("#table-body_pregelplus_eval");
          $("#pending-row").remove();
          var tr = $('<tr>' + '<td>' + '<img src="/static/images/check4.png" style="width:20px;margin-right:10px; float:left;"/>' + ' Batch ' + i + '</td><td>'  + workload + '</td><td>' + metric + '</td><td>'  + metric + '</td><td>' + (newtimestamp-timestamp) + '</td><td>'+ (newtimestamp-init_timestamp) + '</td></tr>');
        }
        else if (document.getElementById("chsys").value=="graphd"&&phase=="training"){
          //count the number of the training batch
          j++;
          table_body= $("#table-body_graphd_tra");
          $("#pending-row").remove();
        var tr = $('<tr>' + '<td>' + '<img src="/static/images/check4.png" style="width:20px;margin-right:10px; float:left;"/>' + ' Batch ' + j + '</td><td>'  + workload + '</td><td>' + metric + '</td><td>'+ (newtimestamp-timestamp) + '</td><td>'+ (newtimestamp-init_timestamp) + '</td></tr>');
      }
        else if (document.getElementById("chsys").value=="graphd"&&phase!="training"){
          i++;
          table_body= $("#table-body_graphd_eval");
          $("#pending-row").remove();
        var tr = $('<tr>' + '<td>' + '<img src="/static/images/check4.png" style="width:20px;margin-right:10px; float:left;"/>' + ' Batch ' + i + '</td><td>'  + workload + '</td><td>' + metric + '</td><td>'+ (newtimestamp-timestamp) + '</td><td>'+ (newtimestamp-init_timestamp) + '</td></tr>');
      }
         
        timestamp=newtimestamp;
        table_body.append(tr);
        //and then append the loading icon in the following row
        var trx = $('<tr id="pending-row">' + '<td>' + '<img src="/static/images/load2.gif"/>' +  '</td><td>'  + '</td><td>' +  '</td><td>' +  '</td><td>' +  '</td><td>' + '</td></tr>');
        table_body.append(trx);
          },

  })
}
//ROCK IT
function rockit(){
  //Delete the items in the table created by the last rockit
  if (rocks>0){
    $( "#table-body_pregelplus_tra tr" ).remove();
    $( "#table-body_pregelplus_eval tr" ).remove();
    $( "#table-body_graphd_tra tr" ).remove();
    $( "#table-body_graphd_eval tr" ).remove();
    i = 0;
    j = 0;
    init_timestamp = timestamp;
  }

    //show the loading icon for the first time
    var trx = $('<tr id="pending-row">' + '<td>' + '<img src="/static/images/load2.gif"/>' +  '</td><td>'  + '</td><td>' +  '</td><td>' +  '</td><td>' +  '</td><td>' + '</td></tr>');
    if(document.getElementById("chsys").value=="graphd"){
      $("#table-body_graphd_tra").append(trx);
      //$("#table-body_graphd_tra tr:first").append($('<img src="/static/images/load2.gif"/>'));
      
     }else if(document.getElementById("chsys").value=="pregelplus"){
      //$("#table-body_pregelplus_tra tr:first").append($('<img src="/static/images/load2.gif"/>'));
      $("#table-body_pregelplus_tra").append(trx);
      
     }   
  

  x = Math.floor(Math.random() * 1000000000);   
  //post parameters to the server
     $.ajax({
       
      url:'http://localhost:80/start_task',
      async:false,//for the return value
      type:'POST',
      contentType: "application/json",
      data:JSON.stringify({
        "dataset":document.getElementById("chdataset").value,
        "workload":parseInt(document.getElementById("workload").value),
        "algorithm":document.getElementById("chalg").value,
        "num_of_machines":document.getElementById("clusizeresult").value,
        "system":document.getElementById("chsys").value,
        "uuid":x,
      }),
      
      success : function(data){
            
            if (data.result.status!="Okay"){
              alert(data.result.status);
              return;
            }
            
            var i=1;
            timestamp=Date.now()/1000;
            init_timestamp = timestamp;
            while(phase!="end"){
             // setTimeout(function(){function1(x)},1000*i);
             function1(x)
             i++;
            }
            $("#pending-row").remove();
          },

    })
    phase="not started";
    rocks++;//To count the number of the clicks on rockit; when rocks>=1, rock it has to clear the tables before appending new metric items for new settings.
}
 


      
window.addEventListener('load', (event) => {
 // $('#graphd12').focus();
//   if ("createEvent" in document) {
//     var evt = document.createEvent("HTMLEvents");
//     evt.initEvent("change", false, true);
//     $('#chsys').dispatchEvent(evt);
// }
// else
//     $('#chsys').fireEvent("onchange");
$('#chdataset')[0].selectedIndex = 1;

$('#chsys')[0].selectedIndex = 0;
$('#chsys').trigger('onchange');

$('#chalg')[0].selectedIndex = 1;


$('#clusizeresult')[0].selectedIndex = 3;
$('#clusizeresult').trigger('onchange');


$('#enatom')[0].selectedIndex = 0;
$('#enatom').trigger('onchange');

});