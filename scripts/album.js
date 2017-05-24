var getSongNumberCell = function(number) {
  return $('.song-item-number[data-song-number="' + number + '"]');
};


var createSongRow = function(songNumber, songName, songLength) {
  var template =
  '<tr class="album-view-song-item">'
  + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
  + '  <td class="song-item-title">' + songName + '</td>'
  + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
  + '</tr>';

  var $row = $(template);

  var clickHandler = function() {
    var songNumber = parseInt($(this).attr('data-song-number'));

    if (currentlyPlayingSongNumber !== null) {
      var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
      currentlyPlayingCell.html(currentlyPlayingSongNumber);
    }

    if (currentlyPlayingSongNumber !== songNumber) {
      $(this).html(pauseButtonTemplate);
      setSong(songNumber);
      currentSoundFile.play();
      currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
      updateSeekBarWhileSongPlays();
      updatePlayerBarSong();

      var $volumeFill = $('.volume .fill');
      var $volumeThumb = $('.volume .thumb');
      $volumeFill.width(currentVolume + '%');
      $volumeThumb.css({left: currentVolume + '%'});

    } else if (currentlyPlayingSongNumber === songNumber) {
      if (currentSoundFile.isPaused()) {
        $(this).html(pauseButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        currentSoundFile.play();
        updateSeekBarWhileSongPlays();
      } else {
        $(this).html(playButtonTemplate);
        $('.main-controls .play-pause').html(playerBarPlayButton);
        currentSoundFile.pause();
      }
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
  $row.hover(onHover, offHover);
  return $row;
};


var setSong = function(songNumber) {
  if (currentSoundFile) {
    currentSoundFile.stop();
  }

  currentlyPlayingSongNumber = parseInt(songNumber);
  currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
  currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
    formats: ['mp3'],
    preload: true
  });

  setVolume(currentVolume);
};


// seek() uses Buzz setTime method to change position in song to specified time
var seek = function(time) {
  if (currentSoundFile) {
    currentSoundFile.setTime(time);
  }
};


var setVolume = function(volume) {
  if (currentSoundFile) {
    currentSoundFile.setVolume(volume);
  }
};


var setCurrentAlbum = function(album) {
  currentAlbum = album;

  var $albumTitle = $('.album-view-title');
  var $albumArtist = $('.album-view-artist');
  var $albumReleaseInfo = $('.album-view-release-info');
  var $albumImage = $('.album-cover-art');
  var $albumSongList = $('.album-view-song-list');

  $albumTitle.text(album.name);
  $albumArtist.text(album.artist);
  $albumReleaseInfo.text(album.year + ' ' + album.label);
  $albumImage.attr('src', album.albumArtUrl);

  $albumSongList.empty();

  for (var i = 0; i < album.songs.length; i++) {
    var $newRow = createSongRow(i + 1, album.songs[i].name, album.songs[i].length);
    $albumSongList.append($newRow);
  }
};


var updateSeekBarWhileSongPlays = function() {
  if (currentSoundFile) {

    // timeupdate: custom Buzz event, fires repeatedly during song playback
    // binding timeupdate event with currentSoundFile
    currentSoundFile.bind('timeupdate', function(event) {

      // getTime() method gets current time of song
      // getDuration() gets total length of song
      // used in calculating the seekBarFillRatio; both values return time in seconds
      var currentTime = this.getTime();
      var songLength = this.getDuration();
      var seekBarFillRatio = currentTime / songLength;
      var $seekBar = $('.seek-control .seek-bar');
      updateSeekPercentage($seekBar, seekBarFillRatio);
      setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
    });
  }
};


// determined percentage, multiply ratio *10
var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
  var offsetXPercent = seekBarFillRatio * 100;

  // Math.max() and Math.min() functions to make sure percentage is no higher/lower than 100
  offsetXPercent = Math.max(0, offsetXPercent);
  offsetXPercent = Math.min(100, offsetXPercent);

  // convert percentage to string, adding => %
  // when setting *width* of *.fill* class & *left* value of *.thumb* class =>  CSS interprets value as percent (instead of number 0-100)
  var percentageString = offsetXPercent + '%';
  $seekBar.find('.fill').width(percentageString);
  $seekBar.find('.thumb').css({left: percentageString});
};


var setupSeekBars = function() {
  // using jQuery to find all elements in DOM with *seek-har* class contained within *player-bar* class
  // returns jQuery wrapped array containing both song seek control and volume control
  var $seekBars = $('.player-bar .seek-bar');

  $seekBars.click(function(event) {
    // new jQuery property on event object (pageX) holds horizontal(X) coordinate where event occurred
    // subtracting offset() from seek bar, value remaining is now a seek barred proportion
    var offsetX = event.pageX - $(this).offset().left;
    var barWidth = $(this).width();
    // offsetX divided by player-bar width to calculate *seekBarFillRatio*
    var seekBarFillRatio = offsetX / barWidth;

    if ($(this).parent().attr('class') == 'seek-control') {
      seek(seekBarFillRatio * currentSoundFile.getDuration());
    }  else {
      setVolume(seekBarFillRatio * 100);
    }
    // *$(this)* passed as *$seekBar* argument
    // *seekBarFillRatio* passed as *seekBarFillRatio* argument to *updateSeekPercentage()*
    updateSeekPercentage($(this), seekBarFillRatio);
  });

  // searching $seekBars for *thumb* class elements, adding event listener for *mousedown* event
  $seekBars.find('.thumb').mousedown(function(event) {

    // wrapping context of event in jQuery
    // dispatched by either song seek or volume control, *this* is *thumb* node which has been clicked
    // identifying *thumb* ownership using *parent* method
    var $seekBar = $(this).parent();

    // *bind()* takes string of event rather than wrapping event in method
    // event handler inside *bind()* call is identical to *click* behavior
    // attaching mousemove to document allows thumb to be dragged continuously
    $(document).bind('mousemove.thumb', function(event) {
      var offsetX = event.pageX - $seekBar.offset().left;
      var barWidth = $seekBar.width();
      var seekBarFillRatio = offsetX / barWidth;

      if ($seekBar.parent().attr('class') == 'seek-control') {
        seek(seekBarFillRatio * currentSoundFile.getDuration());
      } else {
        setVolume(seekBarFillRatio);
      }

      updateSeekPercentage($seekBar, seekBarFillRatio);
    });

    // binds *mouseup* event with *.thumb* namespace
    // unbind() event method rmeoves prior listeners; failure to unbind causes continuous movement, even after mouse has been released
    $(document).bind('mouseup.thumb', function() {
      $(document).unbind('mousemove.thumb');
      $(document).unbind('mouseup.thumb');
    });
  });
};


var updatePlayerBarSong = function() {
  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.artist);
  $('.main-controls .play-pause').html(playerBarPauseButton);
  setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.length));
};


var trackIndex = function(album, song) {
  return album.songs.indexOf(song);
};


var nextSong = function() {
  var getLastSongNumber = function(index) {
    return index == 0 ? currentAlbum.songs.length : index;
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex++;

  if (currentSongIndex >= currentAlbum.songs.length) {
    currentSongIndex = 0;
  }

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $nextSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};


var previousSong = function() {
  var getLastSongNumber = function(index) {
    return index == (currentAlbum.songs.length - 1) ? 1 : index + 2;
  };

  var currentSongIndex = trackIndex(currentAlbum, currentSongFromAlbum);
  currentSongIndex--;

  if (currentSongIndex < 0) {
    currentSongIndex = currentAlbum.songs.length - 1;
  }

  setSong(currentSongIndex + 1);
  currentSoundFile.play();
  updateSeekBarWhileSongPlays();
  currentSongFromAlbum = currentAlbum.songs[currentSongIndex];

  $('.currently-playing .song-name').text(currentSongFromAlbum.name);
  $('.currently-playing .artist-name').text(currentAlbum.artist);
  $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.name + " - " + currentAlbum.name);
  $('.main-controls .play-pause').html(playerBarPauseButton);

  var lastSongNumber = getLastSongNumber(currentSongIndex);
  var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
  var $lastSongNumberCell = getSongNumberCell(lastSongNumber);

  $previousSongNumberCell.html(pauseButtonTemplate);
  $lastSongNumberCell.html(lastSongNumber);
};


// gives user play/pause song control from player bar
var togglePlayFromPlayerBar = function() {
  var $currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);

  if (currentSoundFile.isPaused()) {
    $(currentlyPlayingCell).html(pauseButtonTemplate);
    $(this).html(playerBarPauseButton);

    // $('.main-controls .play-pause').html(playerBarPauseButton);
    currentSoundFile.play();
  } else if (currentSoundFile) {
    $currentlyPlayingCell.html(playButtonTemplate);
    // $('.main-controls .play-pause').html(playerBarPlayButton);
    $(this).html(playerBarPlayButton);
    currentSoundFile.pause();
  }
};

var setCurrentTimeInPlayerBar = function(currentTime) {
  var $currentTimeElement = $('.seek-control .current-time');
  $currentTimeElement.text(currentTime);
  // $('.currently-playing .current-time').text(filterTimeCode(current-time));
};

var setTotalTimeInPlayerBar = function(totalTime) {
  var $totalTimeElement = $('.seek-control .total-time');
  $totalTimeElement.text(totalTime);
  // $('.currently-playing .total-time').text(filterTimeCode(totalTime));
};

var filterTimeCode = function(timeInSeconds) {
  var seconds = Number.parseFloat(timeInSeconds);
  var secondsRounded = Math.floor(seconds);
  var minutes = Math.floor(seconds / 60);
  var secondsUntilSongEnds = secondsRounded % 60;
  var output = minutes + ':';

  if(secondsUntilSongEnds < 10) {
    output += '0';
  }
  output += secondsUntilSongEnds;
  return output;
};

var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 65;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
// play/pause from player bar; variable holding $(.main-controls .play-pause') selector
var $playerBarPlayToggle = $('.main-controls .play-pause');

$(document).ready(function() {
  // setCurrentAlbum(albumBenFolds);
  setCurrentAlbum(albumPicasso);
  // setCurrentAlbum(albumMarconi);
  setupSeekBars();
  $previousButton.click(previousSong);
  $nextButton.click(nextSong);
  // play/pause from player bar; click event with togglePlayFromPlayerBar() as handler
  $playerBarPlayToggle.click(togglePlayFromPlayerBar);
});
