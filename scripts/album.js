var albumBenFolds = {
    title: 'Whatever and Ever Amen',
    artist: 'Ben Folds Five',
    label: '550 Music',
    year: '1997',
    albumArtUrl: 'assets/images/album_covers/04.png',
    songs: [
      {title: 'Brick', duration: '4:53'},
      {title: 'Battle of Who Could Care Less)', duration: '3:16'},
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

     return template;
};

// create setCurrentAlbum function for program to call once window loads
// will take album object as argument, using object's stored information by plugging into template
var setCurrentAlbum = function(album) {

// select all HTML elements required to display on album page
// assign corresponding values (album objects' properties) to HTML elements, populating elements with information
    var albumTitle = document.getElementsByClassName('album-view-title')[0];
    var albumArtist = document.getElementsByClassName('album-view-artist')[0];
    var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
    var albumImage = document.getElementsByClassName('album-cover-art')[0];
    var albumSongList = document.getElementsByClassName('album-view-song-list')[0];


// with *firstChild* *nodeValue* properties together on element *albumTitle*, text node value set to *album.title*
// set value to empty string to ensure clean before populating albums in Collection view
    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

// prevent interfering elements, setting parent to empty string
    albumSongList.innerHTML = '';

// *for* loop through songs of specified, insert into HTML
// function *createSongRow* called at each loop, passing in info stored on object
    for (var i = 0; i < album.songs.length; i++) {
      albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};


var findParentByClassName = function(element, targetClass) {
    if (element.parentElement === null) {
      // element, you are not the father
      alert("No parent found");
    } else {
      var thisParent = element.parentElement;
      while (thisParent.className !== targetClass && thisParent.className !== null) {
        thisParent = thisParent.parentElement;
      }

      if (thisParent.className === null) {
        // elements with given class name, none of you are the father
        alert("No parent found with that class name");
      } else {
        return thisParent;
      }
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
