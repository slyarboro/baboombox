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

     return $(template);
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

// checkpoint 27 => in regards to 4 relationships of clicked element to table cell song number (only child play icons & num itself acquirable via in-DOM functions) => findParentByClassName function traverses DOM upward until respective parent (per class name) found
var findParentByClassName = function(element, targetClass) {
  if (element) {
    var thisParent = element.parentElement;
    while (thisParent.className != targetClass) {
        thisParent = thisParent.parentElement;
    }
    return thisParent;
  }
};

// checkpoint 27 => *getSongItem* should take element, based on element's class, should use *switch* statement returning element with *song-item-number* class
var getSongItem = function(element) {
    switch (element.className) {
      case 'album-song-button':
      case 'ion-play':
      case 'ion-pause':
        return findParentByClassName(element, 'song-item-number');
      case 'album-view-song-item':
        return element.querySelector('.song-item-number');
      case 'song-item-title':
      case 'song-item-duration':
        return findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
      case 'song-item-number':
        return element;
      default:
        return;
      }
};

//  checkpoint 27 => create click handler function that takes one target element argument
// store item number element using getSongItem function
var clickHandler = function(targetElement) {
  var songItem = getSongItem(targetElement);

    // create conditional that checks if currentlyPlayingSong is null and/or currently active => should set songItem content acccordingly (whether play or pause or item number default)
    if (currentlyPlayingSong === null) {
      songItem.innerHTML = pauseButtonTemplate;
      currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
      songItem.innerHTML = playButtonTemplate;
      currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
      var currentlyPlayingSongElement = document.querySelector('[data-song-number="' + currentlyPlayingSong + '"]');
      currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
      songItem.innerHTML = pauseButtonTemplate;
      currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

// checkpoint 26 => the console output will show moused-over elements fire event which eventually registers with the table's event listener
var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');

// Album button templates
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';

// state of playing song; set to null so there is no song identified as playing until a click registers song selection, changing value of currentlyPlayingSong
var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumBenFolds);

    songListContainer.addEventListener('mouseover', function(event) {

      // checkpoint 27 => update mouseover event with conditional that only changes innerHTML of table cell when element does not belong to currently playing song
      // only target individual song during event delegation; i.e. action only possible one table row/song at a time
      if (event.target.parentElement.className === 'album-view-song-item') {

        // play button HTML replaces item number of current song
        event.target.parentElement.querySelector('.song-item-number').innerHTML = playButtonTemplate;

        // pause button remains active as long as respective song is playing
        var songItem = getSongItem(event.target);

        if (songItem.getAttribute('data-song-number') === currentlyPlayingSong) {
          songItem.innerHTML = pauseButtonTemplate;
        }
        // if (songItem.getAttribute('data-song-number') !== currentlyPlayingSong) {
        //   songItem.innerHTML = playButtonTemplate;
        // }
      }
    });

    // checkpoint 27 => used this.children[0] to change HTML of table cell; now helper getSongItem() function manages/specifies element for us
    // must update mouseleave listener => removing this.children[0] references, adding conditional to ensure row exit does not affect/interrupt/prematurely stop song currently playing
    for (var i = 0; i < songRows.length; i++) {
      songRows[i].addEventListener('mouseleave', function(event) {

        // cache song item in variable; (preventing redundancy) for better performance; likewise with song number
        var songItem = getSongItem(event.target);
        var songItemNumber = songItem.getAttribute('data-song-number');

        // conditional added to ensure mouseleave doesn't affect song currently being played
        if (songItemNumber !== currentlyPlayingSong) {
          songItem.innerHTML = songItemNumber;
        }
      });

      // checkpoint 27; add event listener for 'click' event; enabling value change of song currently playing
      songRows[i].addEventListener('click', function(event) {
        clickHandler(event.target);
      });
    }
};
