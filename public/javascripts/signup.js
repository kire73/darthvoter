// signup.js
/* global $ */

$('#signup-btn').on('click', function(){
  // AJAX call to /api/signup
  $.ajax({
    url: '/api/signup',
    type: 'POST',
    dataType: 'JSON',
    data: {
      password: $('#pass').val(),
      user: $('#usr').val(),
    },
    err: function (err) {
      if (err.responseText == "showAlert"){
        alert("Incorrect login Information");
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
