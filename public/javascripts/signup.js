// signup.js

/* global $ */



$('#signup-btn').on('click', function(){
  event.preventDefault();
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
//$("#userVal").html(userVal);
});
