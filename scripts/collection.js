// action-oriented function names begin with a verb => *build*CollectionItemTemplate
var buildCollectionItemTemplate = function() {
  var template =
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

   // checkpoint 30
   // variable-name change to *template*; no jQuery methods as of now, but potentially later
   // to support said potential, wrap *template* in jQuery object (to future-proof it)
  return $(template);

  // template wrapped in function => returns markup string as jQuery object (aka "jQuery template")
};

// change *window.onload* to its jQuery equivalent
$(window).load(function() {

    // substitute DOM selection with shorter jQuery alternative
    // when element section becomes jQuery object, variable name *collectionContainer* prefixed with $ (identifying jQuery-related variables)
     var $collectionContainer = $('.album-covers');

     // replaced *innerHTML* property with empty() method
     // removing vanilla DOM scripting from property
     // empty() method: empties/removes any text or other elements (from the element(s) it's called on)
     $collectionContainer.empty();

     for (var i = 0; i < 12; i++) {
       var $newThumbnail = buildCollectionItemTemplate();

       // replacing += in the *for loop* using append() method
       // with each loop, template content appended to collection container
       $collectionContainer.append($newThumbnail);
     }
});
