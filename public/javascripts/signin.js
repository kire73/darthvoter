// signin.js
/* global $ */

$('#signin-btn').on('click', function(){
 $.ajax({
    url: '/api/signin',
    type: 'POST',
    dataType: 'JSON',
    data: {
      password: $('#pass').val(),
      user: $('#usr').val(),
    },
    err: function (err) {
      if (err){
        console.log(err + "<--error");
        alert("Error: " + err);
      }
    }
  });
  
  $.getJSON('/?', function(res, callback) {
    var hold = res.getElementById('userVal');
    $('#userVal').html(res);
    console.log('updated alert for: ' + res + hold);
    callback(res);
  });
});

