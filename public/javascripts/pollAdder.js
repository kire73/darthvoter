// poll adder
/* global $ users userVal */

/* Pulled from newPost */
var howMany = function(){
    event.preventDefault();
    return document.getElementById('choiceNum').value;
  };
  
$('#createPoll').on('click', function(){
  var choices = [];
  event.preventDefault();
  var title = document.getElementById('title').value;
  console.log(title);
  event.preventDefault();
  for (var i = 0; i < howMany(); i++){
    var choice = document.getElementById('choice[' + i + ']').value;
    if (choice){
      var addChoice = users.choice({
        choice: choice,
        votesCast: 0
      });
      addChoice.save(function(err){
        if(err){
          console.log(err);
        }
        console.log('Choice added: ' + choice);
      });
      console.log(choice);
      choices.push(choice);
    }
  }
  console.log('all choices: ' + choices);
  
  var newPoll = users.poll({
    title: title,
    author: userVal,
    pollSince: new Date,
    choices: choices
  });
  
  $.ajax({
    url: '/newPost',
    type: 'POST',
    dataType: 'JSON',
    data: {
      title: $('#title').val(),
      author: $('#userVal').val(),
      choices: choices,
      pollSince: new Date
    },
    err: function (err) {
      if (err){
        console.log(err + "<--error");
        alert("Error: " + err);
      }
    }
  });
});
          
        