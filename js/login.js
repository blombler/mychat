var handler = function() {
    $("#login_button").click(sendUsername);
    $("#username_input").keypress(function(event){
      if (event.which == 13) {
        sendUsername();
      }
    });
};
var sendUsername = function() {
    var username =  $("#username_input").val();
    if (!username) {
      return;
    }
    $.ajax({
      type:"GET",
      url:"login/" + username,
      success: function(data) {
        document.location.reload(true);
      },
      error: function() {
        console.log("Error occurred.");
      }
    });
};

$(handler);
