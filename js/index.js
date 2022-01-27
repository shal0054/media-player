const CODES = {
  status: {
    0: 'MEDIA_NONE',
    1: 'MEDIA_STARTING',
    2: 'MEDIA_RUNNING',
    3: 'MEDIA_PAUSED',
    4: 'MEDIA_STOPPED',
  },
  error: {
    1: 'MEDIA_ERR_ABORTED',
    2: 'MEDIA_ERR_NETWORK',
    3: 'MEDIA_ERR_DECODE',
    4: 'MEDIA_ERR_NONE_SUPPORTED',
  },
};

const app = {
  media: null,

  tracks: [
    {
      id: 0,
      artist: '2pac ft. Amr Diab',
      album: 'Remix',
      track: "Baby Don't Cry",
      length: '4:12',
      path: '/media/songs/2Pac-ft-Amr-Diab-Baby-Dont-Cry-Arabic.mp3',
      img: '/media/img/2pac.jpg',
    },
    {
      id: 1,
      artist: 'Elissa',
      album: 'Remix',
      track: 'Ahla Donia',
      length: '3:58',
      path: 'media/songs/2pac-Elissa-Arabic-Remix-Ahla-Donia.mp3',
      img: 'media/img/Alleyezonme.jpeg',
    },
    {
      id: 2,
      artist: 'Outlandish',
      album: 'Single',
      track: 'Aicha',
      length: '4:39',
      path: '/media/songs/Aisha-Outlandish.mp3',
      img: '/media/img/outlandish.jpg',
    },
    {
      id: 3,
      artist: 'Phil Collins',
      album: 'Instrumental Mix',
      track: 'In The Air Tonight',
      length: '3:20',
      path: '/media/songs/In-The-Air-Tonight-Instrumental-Mix.mp3',
      img: '/media/img/phil.jpg',
    },
    {
      id: 4,
      artist: 'Nelly ft. Paul Wall',
      album: 'Sweatsuit',
      track: 'Grillz',
      length: '4:32',
      path: '/media/songs/Nelly-Grillz.mp3',
      img: '/media/img/nelly.jpeg',
    },
  ],

  currentTrackId: 0,

  init() {
    app.addEventListeners();
    app.buildListScreen();
  },

  addEventListeners() {
    document
      .getElementById('play_pause_btn')
      .addEventListener('click', app.playPause);
    document
      .getElementById('volume_slider')
      .addEventListener('change', app.updateVolume);
    document
      .getElementById('mute_icon')
      .addEventListener('click', app.toggleMute);
    document
      .getElementById('slider')
      .addEventListener('change', app.updatePosition);
    document
      .querySelector('.playlist')
      .addEventListener('click', app.startSong);
    document.getElementById('next').addEventListener('click', app.next);
    document.getElementById('previous').addEventListener('click', app.prev);
  },

  mountMedia(songId) {
    let src = null;
    let song = app.tracks.findIndex((s) => s.id === songId);
    let path = app.tracks[song].path;
    if (device.platform == 'Android') {
      src = `file:///android_asset/www${path}`;
    } else {
      src = `.${path}`;
    }
    // stop current media
    if (app.media) {
      app.media.pause();
    }
    // Mount new media object
    app.media = new Media(
      src,
      app.handleMediaSuccess,
      app.handleMediaError,
      app.handleMediaStatusChange
    );

    app.songTimer();

    let playPauseIcon = document.getElementById('play_pause_icon');
    app.media.play();
    playPauseIcon.className = '';
    playPauseIcon.classList.add('bx');
    playPauseIcon.classList.add('bx-pause');
  },

  handleMediaSuccess() {
    // successfully created the media object AND playing, stopping or recording
    console.log('Successfully completed the media task.');
    if (app.currentTrackId !== app.tracks.length - 1) app.next();
  },

  // Destructure the error object => {code, message}
  handleMediaError({ code, message }) {
    console.log(CODES.error[code], message);
  },

  handleMediaStatusChange(statusCode) {
    console.log(`media status is now ${CODES.status[statusCode]}`);
  },

  buildListScreen() {
    // get all song cards
    let songList = document.querySelectorAll('.song_card');

    songList.forEach((song) => {
      let id = song.getAttribute('id');
      let songObj = app.tracks[parseInt(id)];
      let imgSrc;
      let path = songObj.img;

      if (device.platform === 'Android') {
        imgSrc = `file:///android_asset/www${path}`;
      } else {
        imgSrc = `.${path}`;
      }

      song.querySelector('img').src = imgSrc;
      song.querySelector('#p_title').innerHTML = songObj.track;
      song.querySelector('#p_artist').innerHTML = songObj.artist;
    });
  },

  playPause() {
    let playPauseBtn = document.getElementById('play_pause_btn');
    let playPauseIcon = document.getElementById('play_pause_icon');
    if (playPauseIcon.classList.contains('bx-pause')) {
      app.media.pause();
      playPauseBtn.className = '';
      playPauseIcon.className = '';
      playPauseIcon.classList.add('bx');
      playPauseIcon.classList.add('bx-play');
    } else {
      app.media.play();
      playPauseBtn.classList.add('playing');
      playPauseIcon.className = '';
      playPauseIcon.classList.add('bx');
      playPauseIcon.classList.add('bx-pause');
    }
  },

  next() {
    let id = app.currentTrackId;
    if (id === app.tracks.length - 1) {
      id = 0;
    } else {
      id += 1;
    }
    document.getElementById(id.toString()).click();
  },

  prev() {
    let id = app.currentTrackId;
    if (id === 0) {
      id = app.tracks.length - 1;
    } else {
      id -= 1;
    }
    document.getElementById(id.toString()).click();
  },

  buildPlayerScreen(songId = 0) {
    app.currentTrackId = songId;

    let id = app.tracks.findIndex((s) => s.id === songId);
    let song = app.tracks[id];

    let songTitle = document.getElementById('song_title');
    songTitle.innerHTML = song.track;

    let artist = document.getElementById('artist');
    artist.innerHTML = song.artist;

    let length = document.getElementById('song_length');
    length.innerHTML = song.length;

    let pImg = document.getElementById('p_img');
    let imgSrc = null;
    let path = song.img;

    if (device.platform === 'Android') {
      imgSrc = `file:///android_asset/www${path}`;
    } else {
      imgSrc = `.${path}`;
    }
    pImg.src = imgSrc;
  },

  startSong(ev) {
    // get all song cards
    let songList = document.querySelectorAll('.song_card');

    // remove playing class from all of them if any
    songList.forEach((song) => {
      if (song.classList.contains('playing')) {
        song.classList.remove('playing');
      }
    });
    // get clicked card and add playing class
    let clickedSong = ev.target.closest('.song_card');
    clickedSong.classList.add('playing');

    // get id of clicked card as an int
    let songId = parseInt(clickedSong.getAttribute('id'));

    // mount clicked song
    app.mountMedia(songId);

    // build player screen of clicked song
    app.buildPlayerScreen(songId);
  },

  updatePosition(ev) {
    let pos = ev.target.value;
    let newPos = app.media.getDuration() * (pos / 100);
    console.log(newPos);
    app.media.seekTo(newPos * 1000);
  },

  updateVolume(vol) {
    let volumeLevel = document.getElementById('volume_level');
    let muteIcon = document.getElementById('mute_icon');
    let volume = vol.target.value;

    volumeLevel.innerHTML = `${volume}%`;
    app.media.setVolume(volume / 100);
    muteIcon.setAttribute('data-vol', volume);
    muteIcon.style.color = 'white';
  },

  toggleMute(ev) {
    let muteIcon = ev.target;
    let volume = muteIcon.getAttribute('data-vol') / 100;
    let isMuted = muteIcon.classList.contains('muted');
    let volumeLevel = document.getElementById('volume_level');
    if (isMuted) {
      app.media.setVolume(volume);
      muteIcon.style.color = 'white';
      volumeLevel.innerHTML = `${volume * 100}%`;
    } else {
      app.media.setVolume(0);
      muteIcon.style.color = '#ff5722';
      volumeLevel.innerHTML = '0%';
    }
    muteIcon.classList.toggle('muted');
  },

  songTimer() {
    let timer = document.getElementById('timer');
    let slider = document.getElementById('slider');

    slider.value = 0;

    setInterval(() => {
      app.media.getCurrentPosition(
        function (position) {
          if (position > -1) {
            timer.innerHTML = app.formatTime(Math.floor(position));
            slider.value = position * (100 / app.media.getDuration());
          }
        },
        function (err) {
          console.log('Error getting pos = ', err);
        }
      );
    }, 500);
  },

  formatTime(seconds) {
    const SECONDS_PER_HOUR = 3600;
    const SECONDS_PER_MINUTE = 60;

    let hours = Math.floor(seconds / SECONDS_PER_HOUR);
    let minutes = Math.floor(
      (seconds - hours * SECONDS_PER_HOUR) / SECONDS_PER_MINUTE
    );
    let sec = seconds - minutes * SECONDS_PER_MINUTE - hours * SECONDS_PER_HOUR;

    minutes = minutes.toString().padStart(2, '0');
    sec = sec.toString().padStart(2, '0');

    return `${minutes}:${sec}`;
  },
};

const ready = 'cordova' in window ? 'deviceready' : 'DOMContentLoaded';
document.addEventListener(ready, app.init, false);
