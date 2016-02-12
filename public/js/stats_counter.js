function getStatsData(){
  $.ajax({
    url: 'https://randomuser.me/stats_json.php',
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
  $('#stat_total').html(data['Total Users']);
  $('#stat_today').html(data['Today']);
  $('#stat_thirty_avg').html(data['Avg Users 30']);
  $('#stat_ps_cs6').html(data['CS6']);
  $('#stat_ps_cc').html(data['CC']);
  $('#stat_ps').html(data['CC2.0.0']);
  //$('#uptime').html(data['Uptime']);
  $('#capacity').html(data['Cap']);
}, 1000);
