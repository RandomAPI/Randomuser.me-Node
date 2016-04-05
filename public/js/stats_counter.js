function getStatsData(){
  $.ajax({
    url: 'getStats',
    dataType: 'json',
    async: false,
    success: function(data){
      // results = data['Total Users'];
      if(!data['error']){
        results = data;
      }
    }
  });
  return results;
}

setInterval(function(){
  var data = getStatsData()
  $('#stat_total_users').html(data.all.total);
  $('#stat_total_bandwidth').html(data.all.bandwidth);
  $('#stat_today').html(data.today.total);
  $('#stat_thirty_avg').html(data[30].total);
  $('#stat_today_bandwidth').html(data.today.bandwidth);
  //$('#uptime').html(data['Uptime']);
  $('#stat_loadavg').html(data.load);
}, 1000);
