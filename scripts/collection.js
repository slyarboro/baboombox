var collectionItemTemplate =
     '<div class="collection-album-container column fourth">'
   + '  <img src="assets/images/album_covers/01.png"/>'
   + '  <div class="collection-album-info caption">'
   + '    <p>'
   + '      <a class="album-title" href="album.html"> Whatever and Ever Amen </a>'
   + '      <br/>'
   + '      <a href="album.html"> Ben Folds Five </a>'
   + '      <br/>'
   + '      X songs'
   + '      <br/>'
   + '    </p>'
   + '  </div>'
   + '</div>'
   ;

window.onload = function() {
     var collectionContainer = document.getElementsByClassName('album-covers')[0];
     /* ensure clean slate; assign empty string to innerHTML property to clear its content */
     collectionContainer.innerHTML = '';

     for (var i = 0; i < 12; i++) {
       collectionContainer.innerHTML += collectionItemTemplate;
     }
};
