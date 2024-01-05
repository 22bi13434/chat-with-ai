// Function to handle scroll event
function handleScroll() {
    var scrollButton = document.getElementById('scrollButton');
    var scrollPosition = window.innerHeight + window.pageYOffset + 150;
    var bodyHeight = document.body.offsetHeight;
  
    if (scrollPosition >= bodyHeight) {
      scrollButton.style.display = 'none';
    } else {
      scrollButton.style.display = 'block';
    }
  }
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  
  // Function to scroll to the bottom of the page
  function scrollToBottom() {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth'
    });
  }
  
  // Add click event listener to the scroll button
  var scrollButton = document.getElementById('scrollButton');
  scrollButton.addEventListener('click', scrollToBottom);
  
  // Add to HTML file
  const alertPlaceholder = document.getElementById('liveAlertPlaceholder')
  const appendAlert = (message, type) => {
    const wrapper = document.createElement('div')
    wrapper.innerHTML = [
      `<br><div class="alert alert-${type} alert-dismissible d-flex justify-content-center " role="alert">`,
      `   <div>${message}<a href="/" style="color: #0a3622;"> refresh</a> the page!</div>`,
      '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
      '</div>'
    ].join('')
  
    alertPlaceholder.append(wrapper)
  }
  // Function to handle button click event
  var inputForm = document.querySelector('.input');
  var messagesDiv = document.querySelector('.chatbox');
  function handleClick() {
    $.ajax({
      type: "GET",
      url: "/delete-conversation",  // Route that triggers Flask app
    });
  
    appendAlert('Delete sucessfully, please ', 'success')
    inputForm.style.display = 'none';
    messagesDiv.style.display = 'none'
  }
  
  // Attach click event listener to the button
  document.getElementById("delete-conversation").addEventListener("click", handleClick);
  
  
  
  var messageInput = document.getElementById('message-input');
  function sendMessage() {
  var introMobile = document.querySelector('.intro-mobile');
  introMobile.style.display = 'none';
  var introDesktop = document.querySelector('.intro-desktop');
  introDesktop.style.display = 'none';
  var chatbox = document.querySelector('.chatbox');
  chatbox.style.display = 'block';
  var messageContainer = document.querySelector('.chatbox');
  var message = messageInput.value;
  var messagesDiv = document.querySelector('.messages');
  var messageElement = document.createElement('div');
  messageElement.classList.add('message');
  messageElement.innerHTML = '<div class="you"><b>You</b>:&nbsp;' + message + '</div><div class="ai"><b>AI</b>:&nbsp;<div class="loader"><i class="fa-solid fa-spinner"></i></div></div>';
  messagesDiv.appendChild(messageElement);
  messageInput.value = '';
  messageContainer.scrollTop = messageContainer.scrollHeight;
  messageContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
  
  fetch('/api/message?message=' + encodeURIComponent(message))
    .then(response => response.json())
    .then(data => {
      const responseHTML = '<b>AI</b>:&nbsp;' + data.response + '<span class="reload-icon"><i class="fas fa-sync-alt"></i></span>';
      messageElement.querySelector('.ai').innerHTML = responseHTML;
      messageContainer.scrollTop = messageContainer.scrollHeight;
      messageContainer.scrollIntoView({ behavior: 'smooth', block: 'end' });
  
      // Define a function to attach the event listener to the reload icon
      const attachReloadListener = () => {
        const reloadIcon = messageElement.querySelector('.reload-icon');
        reloadIcon.addEventListener('click', () => {
          reloadIcon.classList.add('rotating'); // Apply rotating animation to the reload icon
          // Fetch a new response from the AI
          fetch('/api/message?message=' + encodeURIComponent(message))
            .then(response => response.json())
            .then(newData => {
              const newResponseHTML = '<b>AI</b>:&nbsp;' + newData.response + '<span class="reload-icon"><i class="fas fa-sync-alt"></i></span>';
              messageElement.querySelector('.ai').innerHTML = newResponseHTML;
              reloadIcon.classList.remove('rotating'); // Remove rotating animation from the reload icon
              attachReloadListener(); // Reattach the event listener to the new reload icon
            })
        });
      };
      attachReloadListener(); // Attach the event listener to the initial reload icon
    })
  }