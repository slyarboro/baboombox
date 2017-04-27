var albumBenFolds = {
    title: 'Whatever and Ever Amen',
    artist: 'Ben Folds Five',
    label: '550 Music',
    year: '1997',
    albumArtUrl: 'assets/images/album_covers/04.png',
    songs: [
      {title: 'Brick', duration: '4:53'},
      {title: 'Battle of Who Could Care Less', duration: '3:16'},
      {title: 'Kate', duration: '3:13'},
      {title: 'One Angry Dwarf And 200 Solemn Faces', duration: '3:52'},
      {title: 'Steven\'s Last Night In Town', duration: '3:27'}
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
      {title: 'Wrong phone number', duration: '2:15'}
    ]
};

var albumFresh = {
    title: 'World\'s Greatest Entertainer',
    artist: 'Doug E. Fresh and The Get Fresh Crew',
    label: 'Reality',
    year: '1988',
    albumArtUrl: 'assets/images/album_covers/10.png',
    songs: [
      {title: 'Guess Who?', duration: '4:24'},
      {title: 'D.E.F. = Doug E. Fresh', duration: '4:11'},
      {title: 'Greatest Entertainer', duration: '4:40'},
      {title: 'Ev\'ry Body Loves a Star', duration: '3:55'},
      {title: 'Keep Risin\' to the Top', duration: '3:48'}
    ]
};

// must declare objects beforehand since createSongRow function uses the information stored in those album objects
// createSongRow assigns previously static song row template to *template*(variable) and returns it
// rather than statically declaring number/name/length, function takes them as arguments => populating song row tempate accordingly

var createSongRow = function(songNumber, songName, songLength) {
    var template =
      '<tr class="album-view-song-item">'
     + '   <td class="song-item-number">' + songNumber + '</td>'
     + '   <td class="song-item-title">' + songName + '</td>'
     + '   <td class="song-item-duration">' + songLength + '</td>'
     + '</tr>'
     ;

     return template;
};

// select all HTML elements required to display on album page
// assign corresponding values (album objects' properties) to HTML elements, populating elements with information
var albumTitle = document.getElementsByClassName('album-view-title')[0];
var albumArtist = document.getElementsByClassName('album-view-artist')[0];
var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
var albumImage = document.getElementsByClassName('album-cover-art')[0];
var albumSongList = document.getElementsByClassName('album-view-song-list')[0];

var setCurrentAlbum = function(album) {

    albumTitle.firstChild.nodeValue = album.title;
    albumArtist.firstChild.nodeValue = album.artist;
    albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
    albumImage.setAttribute('src', album.albumArtUrl);

// prevent interfering elements, setting parent to empty string
    albumSongList.innerHTML = '';

// function *createSongRow* called at each loop, passing in info stored on object
    for (var i = 0; i < album.songs.length; i++) {
      albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
    }
};

window.onload = function() {
    setCurrentAlbum(albumBenFolds);

    var albumTrio = [albumBenFolds, albumMarconi, albumFresh];
    var index = 2;

    albumImage.addEventListener('click', function(event) {
      setCurrentAlbum(albumTrio[index]);
      index ++;

      if (index === albumTrio.length) {
        index = 0;
      }
    });

 };
