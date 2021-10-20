const $canvas = document.querySelector('canvas');
const $source = document.querySelector('.canvas-img > img');
const $upload = document.querySelector('.upload');
const $download = document.querySelector('.download');

$upload.onchange = e => {
  if (!e.target.matches('input')) return;

  const reader = new FileReader();

  reader.onload = () => {
    $source.setAttribute('src', reader.result);
  };

  reader.readAsDataURL(e.target.files[0]);
};

$source.onload = () => {
  if ($source.naturalWidth > 1919 || $source.naturalHeight > 1919) {
    alert('please small size image');
    return;
  }
  document.querySelector('.spinner').removeAttribute('hidden');

  setTimeout(() => {
    const context = $canvas.getContext('2d');
    context.drawImage($source, 0, 0);
    document.querySelector('.spinner').setAttribute('hidden', '');
  }, 500);
};

$download.onclick = e => {
  e.target.href = $canvas.toDataURL();
};

// function getCookie(name) {
//   var parts = document.cookie.split(name + '=');
//   console.log(parts);
//   if (parts.length == 2) return parts.pop().split(';').shift();
// }

// function expireCookie(cName) {
//   document.cookie = encodeURIComponent(cName) + '=deleted; expires=' + new Date(0).toUTCString();
// }

// //   function setCursor( docStyle, buttonStyle ) {
// //       document.getElementById( "doc" ).style.cursor = docStyle;
// //       document.getElementById( "button-id" ).style.cursor = buttonStyle;
// //   }

// function setFormToken() {
//   var downloadToken = new Date().getTime();
//   //   document.getElementById('downloadToken').value = downloadToken;
//   return downloadToken;
// }

// var downloadTimer;
// var attempts = 30;

// // Prevents double-submits by waiting for a cookie from the server.
// function blockResubmit() {
//   var downloadToken = setFormToken();
//   console.log(downloadToken);
//   //   setCursor( "wait", "wait" );

//   downloadTimer = window.setInterval(function () {
//     var token = getCookie('downloadToken');

//     if (token == downloadToken || attempts == 0) {
//       unblockSubmit();
//     }

//     attempts--;
//   }, 1000);
// }

// function unblockSubmit() {
//   console.log('exit');
//   // setCursor( "auto", "pointer" );
//   window.clearInterval(downloadTimer);
//   expireCookie('downloadToken');
//   attempts = 30;
// }
