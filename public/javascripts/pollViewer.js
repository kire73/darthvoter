// pollViewer
/* global $ */
$('#toMaker').on('click', function(){
    console.log('from the viewer');
});
$('#createPoll').on('click', function(){
  // AJAX call to /api/signup
  $.ajax({
    url: '/api/newPost',
    type: 'POST',
    dataType: 'JSON',
    data: {
      title: $('#title').val(),
      author: $('#userVal').val(),
      choices: $('#choice').forEach().val(),
      pollSince: $(new Date)
    },
    err: function (err) {
      if (err){
        alert(err);
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
