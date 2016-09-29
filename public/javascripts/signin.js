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
    }
  });

});