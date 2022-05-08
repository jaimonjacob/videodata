var xhr = new XMLHttpRequest();
xhr.addEventListener('load', function () {
  if (this.status == 200) {
    var response = JSON.parse(this.responseText);
    var statements = response.statements;
    var validStatements = statements.filter(function (el) {
      return el.verb.id ==="https://w3id.org/xapi/video/verbs/paused" ;
    })
    var refinedStatements = validStatements.filter(function (el) {
      return el.actor.name
    })
    console.log("refinedStatements before");
    console.log(refinedStatements);
    var refinedData=[];
    refinedStatements.forEach(function (statement) {
         
         let pausedTimes = Object.values(statement.result.extensions)[1]

         console.log(pausedTimes)
         refinedData.push([statement.actor.name, statement.object.name, pausedTimes]);
      
      })
    //console.log("summativeData after");  
    //console.log(refinedData);
    var sum = {}, summativeData;
    for (var i = 0, c; c = refinedData[i]; ++i) {
      if (undefined === sum[c[0]]) {
        sum[c[0]] = c;
      }
      else {
        sum[c[0]][2] += c[2];
      }
    }
    summativeData = Object.keys(sum).map(function (val) { return sum[val] });

    var sortedArray = summativeData.sort(function(a, b) {
    return b[2] - a[2];
    });

    //console.log("sortedArray");
    //console.log(sortedArray);
  
    var xValues = sortedArray.map(function(x){
    return x[0];
    })

    var yValues = sortedArray.map(function(x){
      return x[2];
    })
    //console.log(xValues);
    //console.log(yValues);
     var myChart = document.getElementById('myChart').getContext('2d')
    var barChart = new Chart(myChart, {
      type: 'bar',
      data: {
        labels: xValues,
        datasets: [
          {
            label: 'Paused time',
            data: yValues,
            backgroundColor: '#009A44',
            borderWidth: 1,
            borderColor: '#43B02A',
            hoverBorderWidth: 2,
            hoverBorderColor: '#EAAA00',
          },
        ],
      },
      options: {
       /*  title: {
          display: false,
          text: 'score dashboard',
          fontColor: '#E5E2E8',
          fontSize: 25,
        }, */
        legend: {
          position: 'right',
          labels: {
            fontColor: 'white',
          },
        },
        layout: {
          padding: 20,
        },
        tooltips: {
          enabled: true,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                steps: 5,
                stepValue: 10, 
                max: 50,       
                min: 0,
                fontColor: '#E5E2E8',
              },
            },
          ],

          xAxes: [
            {
              ticks: {                
                fontColor: '#E5E2E8',
              },
            },
          ],
        },
      },
  })
}})
xhr.open('GET', 'https://watershedlrs.com/api/organizations/19151/lrs/statements');
xhr.setRequestHeader("x-experience-api-version", "1.0.3");
xhr.setRequestHeader("authorization", "Basic ZjczYTgxYzUzYjJmN2Q6MDE4MDBmMzRjNjdkMjc=");
xhr.send(); 