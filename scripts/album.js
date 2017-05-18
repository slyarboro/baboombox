var createSongRow = function(songNumber, songName, songLength) {
  var template =
  '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '   <td class="song-item-title">' + songName + '</td>'
  + '   <td class="song-item-duration">' + songLength + '</td>'
  + '</tr>'
  ;

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      var nowPlaying = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
      nowPlaying.html(currentlyPlayingSongNumber);
    }
    //  };

    if (currentlyPlayingSongNumber !== songNumber) {
      $(this).html(pauseButtonTemplate);
      currentlyPlayingSongNumber = songNumber;
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updatePlayerBarSong();
    }  else if (currentlyPlayingSongNumber === songNumber) {
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      currentlyPlayingSongNumber = null;
      currentSongFromAlbum = null;
    }
  };

  var onHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if (songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(playButtonTemplate);
    }
  };

  var offHover = function(event) {
    var songNumberCell = $(this).find('.song-item-number');
    var songNumber = parseInt(songNumberCell.attr('data-song-number'));

    if(songNumber !== currentlyPlayingSongNumber) {
      songNumberCell.html(songNumber);
    }
  };

  $row.find('.song-item-number').click(clickHandler);
  // hover() event listener combines mouseover/mouseleave
  $row.hover(onHover, offHover);
  // $row returns with event listeners attached
  return $row;
};

// album object taken as argument => plug object's stored information into template
var setCurrentAlbum = function(album) {
  currentAlbum = album;

  // select all HTML elements required to display on album page
  // assign corresponding values (album object properties) to HTML elements, populating elements with information
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

var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('main-controls .play-pause').html(playerBarPauseButton);
};

// Album button templates
// match nowPlaying object with corresponding index in song array
// helper method; two arguments (album, song); returning index of album's song array
var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// calling next/previous functions, should increment/decrement song index value in array, respectively
// consecutive play order with wrap around, track index to increment value accordingly; shift in index to set nowPlaying as currentSongFromAlbum
// update player bar to show corresponding song name/info; update HTML of .song-item-number elements to maintain number->play->pause accuracy
var nextSong = function() {
  var getLastSongNumber = function(index) {
    return index == 0 ? currentAlbum.songs.length : index;
  };

  var nowPlayingIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  // playing next song in queue
  nowPlayingIndex++;

  if (nowPlayingIndex >= currentAlbum.songs.length) {
    nowPlayingIndex = 0;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
  //
  currentlyPlayingSongNumber = nowPlayingIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[nowPlayingIndex];

  // $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  // $('.currently-playing .artist-name').text(currentAlbum.artist);
  // $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  // $('.main-controls .play-pause').html(playerBarPauseButton);

  updatePlayerBarSong();

  var lastSongNumber = getLastSongNumber(nowPlayingIndex);
  var $nextSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var previousSong = function() {
  var nowPlayingIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  nowPlayingIndex--;

  if (nowPlayingIndex < 0) {
    nowPlayingIndex = currentAlbum.songs.length - 1;
  }

  var getLastSongNumber = function(index) {
      return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
  };

  currentlyPlayingSongNumber = nowPlayingIndex + 1;
  currentSongFromAlbum = currentAlbum.songs[nowPlayingIndex];

  updatePlayerBarSong();
  //
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(nowPlayingIndex);
  var $previousSongNumberCell = $('.song-item-number[data-song-number="' + currentlyPlayingSongNumber + '"]');
  var $lastSongNumberCell = $('.song-item-number[data-song-number="' + lastSongNumber + '"]');

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};

var updatePlayerBarSong = function() {

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

// now have set of variables in global scope that hold current song and album information
// data contributions necessary for proper song tracking and functionalities of the sort

// follow up by assigning variable to the *album* argument in setCurrentAlbum() function
var currentAlbum = null;

// currentlyPlayingSong renamed to a more specific *var currentlyPlayingSongNumber* => same, tracking current song info; set to null to indicate no song play => value changes once click of a song selection has registered
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumBenFolds);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
