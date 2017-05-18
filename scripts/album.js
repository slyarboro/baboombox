// Assignment 32
// Create a setSong function that takes one argument, songNumber, and assigns currentlyPlayingSongNumber and currentSongFromAlbum a new value based on the new song number.
var setSong = function(songNumber) {
  currentlyPlayingSongNumber = parsInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
};
// Replace all instances where we manually assign values to these functions with a call to setSong().

// Write a function named getSongNumberCell that takes one argument, number, and returns the song number element that corresponds to that song number.
var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]')
};
// Replace all instances where we use the selector with a getSongNumberCell() call.

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
      var nowPlaying = getSongNumberCell(currentlyPlayingSongNumber);
      nowPlaying.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updatePlayerBarSong();
    }  else if (currentlyPlayingSongNumber === songNumber) {
      $(this).html(playButtonTemplate);
      $('.main-controls .play-pause').html(playerBarPlayButton);
      setSong(null);
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
  // $row returns with event listeners attached
  $row.hover(onHover, offHover);
  return $row;
};


// taking album/object as argument, its info can be plugged into template
var setCurrentAlbum = function(album) {
  currentAlbum = album;

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
//.
var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
  $('main-controls .play-pause').html(playerBarPauseButton);
};

var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};

// per index increment/decrement, nowPlaying set as currentSongFromAlbum
// .song-item-number HTML ensures number->play->pause accuracy
var nextSong = function() {
  var getLastSongNumber = function(index) {
    return index == 0 ? currentAlbum.songs.length : index;
  };

  var nowPlayingIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  nowPlayingIndex++;

  if (nowPlayingIndex >= currentAlbum.songs.length) {
    nowPlayingIndex = 0;
  }

  var lastSongNumber = currentlyPlayingSongNumber;
  setSong(nowPlayingIndex + 1);

  //
  updatePlayerBarSong();

  var lastSongNumber = getLastSongNumber(nowPlayingIndex);
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

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

  setSong(nowPlayingIndex + 1);

  //
  updatePlayerBarSong();

  $('.currently-playing .song-name').text(currentSongFromAlbum.title);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.title);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(nowPlayingIndex);
  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};
//.
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

// following variables hold current song/album information in global scope
// currentlyPlayingSongNumber: tracks nowPlaying info; *null* when no song is playing; value will change once click/event registers
var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

$(document).ready(function() {
  setCurrentAlbum(albumBenFolds);
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
});
