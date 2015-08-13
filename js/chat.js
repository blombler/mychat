$(function() {
  var getMessages = function() {
    $.ajax({
      type:"GET",
      url:"retrieve/",
      dataType : "json",
      success: function(data) {
        console.log("retrieve", data);
        if (data && data.messages) {
          var chatArea = $("#chat_area");
          chatArea.html("");
          for (var i = 0; i < data.messages.length; i++) {
            var message = data.messages[i];
            var messageTime = new Date(data.messageTime[i]);
            var hours = messageTime.getHours();
            var minutes = messageTime.getMinutes();
            var seconds = messageTime.getSeconds();
            minutes = pad(minutes,2,"0");
            seconds = pad(seconds,2,"0");
            var timeString = " [" + hours + ":" + minutes + ":" + seconds + "] ";
            chatArea.append("<li>" + timeString + message +"</li>");
          }
        }
      },
      error: function() {
        //alert("error");
        console.log("Error occurred.");
      }
    })
  };

  function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  setInterval(getMessages, 1000);

  var chatInput = $("#chat_input");
  chatInput.keypress(function(event) {
    if (event.which == 13) {
      sendInputToServer();
    }
  });

  var sendInputToServer = function() {
    var inputValue = $("#chat_input").val();

    if(!inputValue) {
      return;
    }

    $.ajax({
      type:"GET",
      url:"message/"+inputValue,
      dataType: "text",
      success: function() {
        chatInput.val("");
      },
      error: function() {
        alert("error");
      }
    })
  };

  $("#send_button").click(sendInputToServer);

});
