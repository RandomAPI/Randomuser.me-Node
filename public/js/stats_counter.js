(function() {
  domready(function() {
    socket = io(document.getElementsByTagName('server')[0].innerHTML);
    socket.on('statsResults', function(data) {
      document.getElementById('stat_total_users').innerHTML = data.all.total;
      document.getElementById('stat_total_bandwidth').innerHTML = data.all.bandwidth;
      document.getElementById('stat_today').innerHTML = data.today.total;
      document.getElementById('stat_thirty_avg').innerHTML = data[30].total;
      document.getElementById('stat_today_bandwidth').innerHTML = data.today.bandwidth;
      document.getElementById('stat_loadavg').innerHTML = data.load;
    });
    if (window.location.href.indexOf('stats') !== -1) {
      setInterval(function() {
        socket.emit('stats')
      }, 250);
    }
  });
})();
