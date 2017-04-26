var albumBenFolds = {
  title: 'Whatever and Ever Amen',
  artist: 'Ben Folds Five',
  label: '550 Music',
  year: '1997',
  albumArtUrl: 'assets/images/album_covers/01.png',
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
   + '   <td class="song-item-number">' + songNumber + '</td>'
   + '   <td class="song-item-number">' + songName + '</td>'
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

window.onload = function() {
  setCurrentAlbum(albumBenFolds);
};
