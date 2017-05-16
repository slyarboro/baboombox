var albumBenFolds = {
    title: 'Whatever and Ever Amen',
    artist: 'Ben Folds Five',
    label: '| 550 Music',
    year: '1997',
    albumArtUrl: 'assets/images/album_covers/04.png',
    songs: [
      {title: 'Brick', duration: '4:53'},
      {title: 'Battle of Who Could Care Less', duration: '3:16'},
      {title: 'Kate', duration: '3:13'},
      {title: 'One Angry Dwarf And 200 Solemn Faces', duration: '3:52'},
      {title: 'Steven\'s Last Night In Town', duration: '3:27'},
    ]
};

var albumMarconi = {
    title: 'The Telephone',
    artist: 'Guglielmo Marconi',
    label: 'EM',
    year: '1909',
    albumArtUrl: 'assets/images/album_covers/20.png',
    songs: [
      {title: 'Hello, Operator?', duration: '1:01'},
      {title: 'Ring, ring, ring', duration: '5:01'},
      {title: 'Fits in your pocket', duration: '3:21'},
      {title: 'Can you hear me now?', duration: '3:14'},
      {title: 'Wrong phone number', duration: '2:15'},
    ]
};

// must declare objects beforehand since createSongRow function uses the information stored in those album objects
// createSongRow assigns previously static song row template to *template*(variable) and returns it
// rather than statically declaring number/name/length, function takes them as arguments => populating song row tempate accordingly

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

       if (currentlyPlayingSong !== null) {
         var songRequest = $('.song-item-number[data-song-number="' + currentlyPlayingSong + '"]');
         songRequest.html(currentlyPlayingSong);
       }

       if (currentlyPlayingSong !== songNumber) {
         $(this).html(pauseButtonTemplate);
         currentlyPlayingSong = songNumber;
       }  else if (currentlyPlayingSong === songNumber) {
         $(this).html(playButtonTemplate);
         currentlyPlayingSong = null;
       }
     };

     var onHover = function(event) {
       var songRequest = $(this).find('.song-item-number');
       var songNumber = songRequest.attr('data-song-number');

       if (songNumber !== currentlyPlayingSong) {
         songRequest.html(playButtonTemplate);
       }
     };

     var offHover = function(event) {
       var songRequest = $(this).find('.song-item-number');
       var songNumber = songRequest.attr('data-song-number');

       if(songNumber !== currentlyPlayingSong) {
         songRequest.html(songNumber);
       }
     };

     // call find() for element; song number (class) of row clicked
     // *click* event listener executes (callback) once target is clicked
     $row.find('.song-item-number').click(clickHandler);

     // hover() event listener combines mouseover/mouseleave functions
     // first argument: executes as user hovers/mouses over *row*(element)
     // second argument: executes once mouse leaves respective row
     $row.hover(onHover, offHover);

     // the $row created returns with event listeners attached
     return $row;
};

// create setCurrentAlbum function for program to call once window loads
// will take album object as argument, using object's stored information by plugging into template
var setCurrentAlbum = function(album) {

    // select all HTML elements required to display on album page
    // assign corresponding values (album objects' properties) to HTML elements, populating elements with information
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');


    // checkpoint 30
    // instead of setting firstChild.nodeValue => call jQuery's text() method to set content of text nodes
    // replace setAttribute() method with => jQuery's attr() method (changes element attribute using same arguments)
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);

    // when jQuery selector returns single element, can access it without array-index syntax
    // can call jQuery method directly on selector without recovering first (read: only) item in array

    // refactor using jQuery methods => .empty() remove child nodes; .append() insert content to end of element(s)
    $albumSongList.empty();

    // can call jQuery method directly on selector without recovering first (read: only) item in array
    for (var i = 0; i < album.songs.length; i++) {
      var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
      $albumSongList.append($newRow);
    }
};

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// state of playing song; set to null so there is no song identified as playing until a click registers song selection, changing value of currentlyPlayingSong
var currentlyPlayingSong = null;

$(document).ready(function() {
    setCurrentAlbum(albumBenFolds);

});
