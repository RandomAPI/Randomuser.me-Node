(function() {
  domready(function() {
    if (window.location.href.indexOf('stats') !== -1) {
      var result = pegasus('getStats');
      result.then(function(data) {
        var dates = data.map(function(date) {
          return date.date;
        });
        var values = data.map(function(date) {
          return Number(date.total);
        });
        var bandwidth = data.map(function(date) {
          return Math.round(date.bandwidth/1024/1024*100)/100;
        });
        Highcharts.setOptions({
          lang: {
            thousandsSep: ","
          }
        });
        new Highcharts.Chart({
          chart: {
            renderTo: document.getElementById("charts")
          },
          title: {
            text: '',
          },
          xAxis: {
            title: {
              text: 'Date'
            },
            categories: dates
          },
          yAxis: [{
            minPadding: 0.2,
            maxPadding: 0.2,
            labels: {
              style: {
                color: '#93B1C6'
              }
            },
            title: {
              text: 'Users'
            },
            opposite: true
          }, {
            labels: {
              format: '{value} MB',
              style: {
                color: '#FF7148'
              }
            },
            title: {
              text: 'Bandwidth'
            }
          }],
          series: [{
            name: 'Bandwidth',
            yAxis: 1,
            color: '#FF7148',
            data: bandwidth
          }, {
            name: 'Users',
            data: values,
            color: '#93B1C6'
          }],
          tooltip: {
            shared: true
          }
        });
      })
    }
  });
})();
