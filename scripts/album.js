var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
     + '   <td class="song-item-title">' + songName + '</td>'
     + '   <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

     // checkpoint 31
     // replace return statement with its jQuery equivalent
     // attach the three event listeners provided in checkpoint
     var $row = $(template);

     var clickHandler = function() {
       var songNumber = $(this).attr('data-song-number');

       if (currentlyPlayingSongNumber !== null) {
         var songRequest = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
         songRequest.html(currentlyPlayingSongNumber);
       }

       if (currentlyPlayingSongNumber !== songNumber) {
         $(this).html(pauseButtonTemplate);
         currentlyPlayingSongNumber = songNumber;
         currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
       }  else if (currentlyPlayingSongNumber === songNumber) {
         $(this).html(playButtonTemplate);
         currentlyPlayingSongNumber = null;
         currentSongFromAlbum = null;
       }
     };

     var onHover = function(event) {
       var songRequest = $(this).find('.song-item-number');
       var songNumber = songRequest.attr('data-song-number');

       if (songNumber !== currentlyPlayingSongNumber) {
         songRequest.html(playButtonTemplate);
       }
     };

     var offHover = function(event) {
       var songRequest = $(this).find('.song-item-number');
       var songNumber = songRequest.attr('data-song-number');

       if(songNumber !== currentlyPlayingSongNumber) {
         songRequest.html(songNumber);
       }
     };

     $row.find('.song-item-number').click(clickHandler);

     // hover() event listener combines mouseover/mouseleave
     // execute: arg#1, user hovers over row; arg#2, user/cursor "mouses out" of row
     $row.hover(onHover, offHover);

     // the $row created returns with event listeners attached
     return $row;
};

// will take album object as argument, using object's stored information by plugging into template
var setCurrentAlbum = function(album) {
    currentAlbum = album;

    // select all HTML elements required to display on album page
    // assign corresponding values (album objects' properties) to HTML elements, populating elements with information
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');


    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    // when jQuery selector returns single element, can access it without array-index syntax
    // can call jQuery method directly on selector without recovering first (read: only) item in array
    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// now have set of variables in global scope that hold current song and album information
// data contributions necessary for proper song tracking and functionalities of the sort

// follow up by assigning variable to the *album* argument in setCurrentAlbum() function
var currentAlbum = null;

// currentlyPlayingSong renamed to a more specific *var currentlyPlayingSongNumber* => same, tracking current song info; set to null to indicate no song play => value changes once click of a song selection has registered
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

$(document).ready(function() {
    setCurrentAlbum(albumBenFolds);

});
