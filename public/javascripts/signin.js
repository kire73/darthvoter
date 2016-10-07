// signin.js
/* global $ */

// add an event listener to the signin button
$('#signin-btn').on('click', function(){
  // AJAX call to /api/signin with the URL that the user entered in the input box
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
 

//  event.preventDefault();
});

