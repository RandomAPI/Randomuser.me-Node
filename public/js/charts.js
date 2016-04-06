(function() {
  domready(function() {
    if (window.location.href.indexOf('stats') !== -1) {
      new Highcharts.Chart({
        chart: {
          renderTo: document.getElementById("charts")
        },
        title: {
          text: '30 days',
          x: -20 //center
        },
        xAxis: {
          title: {
            text: 'Date'
          },
          categories: ["3.07", "3.08", "3.09", "3.10", "3.11", "3.12", "3.13", "3.14", "3.15", "3.16", "3.17", "3.18", "3.19", "3.20", "3.21", "3.22", "3.23", "3.24", "3.25", "3.26", "3.27", "3.28", "3.29", "3.30", "3.31", "4.01", "4.02", "4.03", "4.04"]},
        yAxis: [{
          min: 0,
          title: {
            text: 'Values'
          },
          plotLines: [{
            value: 0,
            width: 1,
            color: '#808080'
          }]
        }],
        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          borderWidth: 0
        },
        series: [{
          name: 'Total',
          data: [1279674, 1372594, 2946605, 2621451, 1972811, 1649625, 2038890, 1774476, 1735823, 1709348, 1406762, 1633831, 2662855, 1589869, 1599016, 1003070, 944028, 884739, 4232470, 6826524, 2572823, 5721567, 2655161, 788038, 633055, 566234, 254669, 290714, 371588],
          color: '#0F0'
        }],
        tooltip: {
          shared: true
        }
      });
    }
  });
})();