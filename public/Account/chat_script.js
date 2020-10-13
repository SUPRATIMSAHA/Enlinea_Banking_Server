hideChat(0);
var objDiv = document.getElementById("chat_converse");
let newMessage = false;
let open = true;
$(window).focus(function(){
      if($("#chat_converse").is(":visible")){
            if(newMessage || open){
                  newMessage = false;
                  open = false;
                  $.post('/root/message_seen', {username: target_username}, (data)=>{
                        if(data){
                              socket.emit('message-seen', {username: data, other_user: target_username});
                        }
                  })
            }
      }
});


$('#prime').click(function() {
  toggleFab();
  hideChat(1);
});

$('.mess').click(function() {
      if( $('.fabs').is(':visible') ){
            toggleFab();
            hideChat(1);
      } else {
            alert("You need to be a friend in order to send messages");
      }
})


//Toggle chat and links
function toggleFab() {
  $('.prime').toggleClass('zmdi-comment-outline');
  $('.prime').toggleClass('zmdi-close');
  $('.prime').toggleClass('is-active');
  $('.prime').toggleClass('is-visible');
  $('#prime').toggleClass('is-float');
  $('.chat').toggleClass('is-visible');
  $('.fab').toggleClass('is-visible');
  
}

  $('#chat_fullscreen_loader').click(function(e) {
      $('.fullscreen').toggleClass('zmdi-window-maximize');
      $('.fullscreen').toggleClass('zmdi-window-restore');
      $('.chat').toggleClass('chat_fullscreen');
      $('.fab').toggleClass('is-hide');
      $('.header_img').toggleClass('change_img');
      $('.img_container').toggleClass('change_img');
      $('.chat_header').toggleClass('chat_header2');
      $('.fab_field').toggleClass('fab_field2');
      $('.chat_converse').toggleClass('chat_converse2');
      //$('#chat_converse').css('display', 'none');
     // $('#chat_body').css('display', 'none');
     // $('#chat_form').css('display', 'none');
     // $('.chat_login').css('display', 'none');
     // $('#chat_fullscreen').css('display', 'block');
  });

//Here we are only using 0 and 1 case. But we may need other cases in future
function hideChat(hide) {
    switch (hide) {
      case 0:
            $('#chat_converse').css('display', 'none');
            $('#chat_body').css('display', 'none');
            $('#chat_form').css('display', 'none');
            $('.chat_login').css('display', 'block');
            $('.chat_fullscreen_loader').css('display', 'none');
             $('#chat_fullscreen').css('display', 'none');
            break;
      case 1:
            $('#chat_converse').css('display', 'block');
            $('#chat_body').css('display', 'none');
            $('#chat_form').css('display', 'none');
            $('.chat_login').css('display', 'none');
            $('.chat_fullscreen_loader').css('display', 'block');
            objDiv.scrollTop = objDiv.scrollHeight;
            open = true;
            $(window).trigger('focus');
            break;
      case 2:
            $('#chat_converse').css('display', 'none');
            $('#chat_body').css('display', 'block');
            $('#chat_form').css('display', 'none');
            $('.chat_login').css('display', 'none');
            $('.chat_fullscreen_loader').css('display', 'block');
            break;
      case 3:
            $('#chat_converse').css('display', 'none');
            $('#chat_body').css('display', 'none');
            $('#chat_form').css('display', 'block');
            $('.chat_login').css('display', 'none');
            $('.chat_fullscreen_loader').css('display', 'block');
            break;
      case 4:
            $('#chat_converse').css('display', 'none');
            $('#chat_body').css('display', 'none');
            $('#chat_form').css('display', 'none');
            $('.chat_login').css('display', 'none');
            $('.chat_fullscreen_loader').css('display', 'block');
            $('#chat_fullscreen').css('display', 'block');
            break;
    }
}

$("#chatSend").on('keyup', (e)=>{
      var inp = $("#chatSend").val();
      if(inp != ''){
            $(':input[type="submit"]').prop('disabled', false);
      }
      else{
            $(':input[type="submit"]').prop('disabled', true);
      }
})


$("#chat_message").on('submit', (e)=> {
      e.preventDefault();
      msg = e.target.elements.chatSend.value;

      $.get('/root/get/username', (data)=>{
            if(data){
                  socket.emit('chatMessage', {message: msg, username: data, other_user: target_username});
            }
      })

      $.post('/root/chat_message', {username: target_username, msg: msg}, (res)=>{
            if(res){
                  console.log('message sent');
            }
      })

      e.target.elements.chatSend.value = '';
      e.target.elements.chatSend.focus();
})

socket.on('message', ({message, username})=> {
      console.log(username, target_username);
      if(username == target_username){
            var newString = message.replace(/ /g, "&nbsp;");
            newString = newString.replace(/\n/g, "<br />")
            $("#chat_converse").append(`<span class="chat_msg_item chat_msg_item_admin">
                  <div class="chat_avatar">
                  <img src="../uploads/${profile_picture}"/>
                  </div>${newString}
            </span>`);
            objDiv.scrollTop = objDiv.scrollHeight;
            newMessage = true;
            $(window).focus(function(){
                  if($("#chat_converse").is(":visible")){
                        if(newMessage){
                              newMessage = false;
                              $.post('/root/message_seen', {username: target_username}, (data)=>{
                                    if(data){
                                          socket.emit('message-seen', {username: data, other_user: target_username});
                                    }
                              })
                        }
                  }
            });
      }
})

socket.on('myMessage', (message)=> {
      var newString = message.replace(/ /g, "&nbsp;");
      global_size += 1;
      newString = newString.replace(/\n/g, "<br />")
      $("#chat_converse").append(`<span id="${global_size}" class="chat_msg_item chat_msg_item_user">
            ${newString}
      </span>`);
      objDiv.scrollTop = objDiv.scrollHeight;
})

socket.on('isSeen', (username)=>{
      console.log(global_size);
      if(username == target_username){
            $(".seen_avatar").remove();
            $(`<span class="seen_avatar">
                  <img src="../uploads/${profile_picture}" />
            </span>`).insertAfter(`#${global_size}`);
      }
})
