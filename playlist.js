/* ============ DB PLAY | Playlist (9 tracks) ============
   Audio  -> MUSIC-PLAYLIST/   (01-hes-into-her.mp3 ... 09-closer-you-and-i.mp3)
   Covers -> PLAYLIST-COVERS/  (same file name as the song, .jpg)
   Default cover (no song selected) -> PLAYLIST-COVERS/playlist-photo.jpg
   Both folders must sit in the same folder as playlist.html
   =========================================================== */

const AUDIO_DIR = 'MUSIC-PLAYLIST/';
const COVER_DIR = 'PLAYLIST-COVERS/';
const DEFAULT_COVER = COVER_DIR + 'playlist-photo.jpg';

/* Text shown when no song is selected */
const DEFAULT_EYEBROW = 'DB PLAY ORIGINAL ALBUM';
const DEFAULT_HEADING = ['DonBelle', 'Playlist.'];   // [white line, purple italic line]
const DEFAULT_DESCRIPTION = 'DonBelle songs filled with love, sweet melodies, and unforgettable moments.';

/* Each song:
   title       -> name shown in the track list and player bar
   heading     -> big hero title: [first line (white), second line (purple italic)]
                  leave the first line '' if you want only the purple line
   description -> text under the big title */
const tracks = [
  {title:"He's Into Her", artist:'DonBelle', slug:'01-hes-into-her',
   heading:["He's Into", 'Her.'],
   description:"A sweet and youthful love song about discovering unexpected feelings for someone special. It captures the excitement, butterflies, and little moments that make falling in love feel magical."},

  {title:"He's Into Her (Donny Version)", artist:'DonBelle', slug:'02-hes-into-her-donny-version',
   heading:["He's Into Her", 'Donny Version.'],
   description:"A special version that brings a different feeling to the story of young love. It expresses the excitement of liking someone, the emotions that are hard to hide, and the happiness of having someone who makes your heart beat faster."},

  {title:'Sigurado (Belle)', artist:'DonBelle', slug:'03-sigurado-belle',
   heading:['Sigurado', 'Belle.'],
   description:"A heartfelt song about being certain of your feelings for someone. It captures the comfort of knowing who you love and the courage to trust your heart, even when love comes with challenges."},

  {title:'Sigurado (Duet)', artist:'DonBelle', slug:'04-sigurado-duet',
   heading:['Sigurado', 'Duet.'],
   description:"A romantic duet about two people who share the same feelings and choose to believe in their love. Their voices come together to express trust, commitment, and the beautiful feeling of finding someone who feels the same way."},

  {title:'Wings', artist:'DonBelle', slug:'05-wings',
   heading:['', 'Wings.'],
   description:"A beautiful song about how love can give you the courage to dream bigger and become a better version of yourself. It reflects the feeling of having someone who supports you, inspires you, and makes you believe you can reach new heights."},

  {title:'Huwag Muna Tayong Umuwi', artist:'DonBelle', slug:'06-huwag-muna-tayong-umuwi',
   heading:['Huwag Muna', 'Tayong Umuwi.'],
   description:"A romantic song about wanting to spend more time with someone special. It captures those moments when conversations feel endless, time passes too quickly, and neither person wants the night to end just yet."},

  {title:'Pinadama', artist:'DonBelle', slug:'07-pinadama',
   heading:['', 'Pinadama.'],
   description:"A song about the powerful emotions that come with falling for someone. It reflects how a special person can make you feel things you never expected, turning ordinary moments into unforgettable memories filled with love and affection."},

  {title:'Autumn', artist:'DonBelle', slug:'08-autumn',
   heading:['', 'Autumn.'],
   description:"A song that brings out the feeling of love, memories, and the changes that come with time. Like the autumn season, it carries a warm and emotional atmosphere, reminding us of special moments and the feelings that stay with us even as life changes."},

  {title:'Closer (You and I)', artist:'DonBelle', slug:'09-closer-you-and-i',
   heading:['Closer', 'You and I.'],
   description:"A romantic song about building a stronger connection with someone special. It expresses the joy of getting closer, understanding each other better, and creating moments that make two people feel more connected with every passing day."}
].map(t => ({...t, file: AUDIO_DIR + t.slug + '.mp3', cover: COVER_DIR + t.slug + '.jpg', duration: '0:00'}));

const $ = id => document.getElementById(id);
const list = $('trackList');
const audio = $('audioPlayer');
const record = $('vinylRecord');
const stage = $('recordStage');
const vinylCover = $('vinylCover');
const playerArt = document.querySelector('.now-playing-art');
const heroCopy = $('playlistCopy');
const heroEyebrow = $('heroEyebrow');
const heroTitle = $('heroTitle');
const heroDescription = $('heroDescription');
let activeTrack = -1;
let swapTimer = null;

const prettyTime = s => Number.isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}` : '0:00';
const showMissing = () => { $('nowArtist').textContent = `Add ${tracks[activeTrack].file} to play this track`; };

/* ---------- Hero text (eyebrow + big title + description, with a soft fade) ---------- */
function paintHeading(heading) {
  const [line1, line2] = heading;
  heroTitle.textContent = '';
  if (line1) {
    heroTitle.appendChild(document.createTextNode(line1));
    heroTitle.appendChild(document.createElement('br'));
  }
  const em = document.createElement('em');
  em.textContent = line2;
  heroTitle.appendChild(em);
  // long titles get a smaller size so they fit (see turntable.css)
  const longest = Math.max(line1.length, line2.length);
  heroTitle.classList.toggle('title-long', longest > 10);
  heroTitle.classList.toggle('title-xlong', longest > 13);
}

function setHeroText(eyebrow, heading, description) {
  if (!heroCopy) return;
  clearTimeout(swapTimer);
  heroCopy.classList.add('swap');
  swapTimer = setTimeout(() => {
    heroEyebrow.textContent = eyebrow;
    paintHeading(heading);
    heroDescription.textContent = description;
    heroCopy.classList.remove('swap');
  }, 180);
}

/* ---------- Covers ---------- */
function setCover(url) {
  const css = `url("${url}")`;
  vinylCover.style.backgroundImage = css;
  playerArt.style.backgroundImage = css;
  playerArt.classList.add('has-cover');
}
// Show a track's cover; if the image is missing, fall back to the default one.
function showCover(url) {
  const img = new Image();
  img.onload = () => setCover(url);
  img.onerror = () => setCover(DEFAULT_COVER);
  img.src = url;
}

/* ---------- Track list ---------- */
function paintTracks() {
  list.innerHTML = '';
  tracks.forEach((track, index) => {
    const row = document.createElement('div');
    row.className = 'track-row';
    row.innerHTML = `<span class="track-number">${String(index + 1).padStart(2, '0')}</span><span class="track-cover"></span><span><span class="track-title"></span><span class="track-artist"></span></span><span class="track-duration">${track.duration}</span><button class="track-play" type="button" aria-label="Play ${track.title}"><i class="fa-solid fa-play"></i></button>`;
    row.querySelector('.track-title').textContent = track.title;
    row.querySelector('.track-artist').textContent = track.artist;

    const thumb = document.createElement('img');
    thumb.alt = '';
    thumb.src = track.cover;
    thumb.onerror = () => { thumb.onerror = null; thumb.src = DEFAULT_COVER; };
    row.querySelector('.track-cover').appendChild(thumb);

    row.querySelector('.track-play').addEventListener('click', () => {
      if (index === activeTrack) togglePlay(); else loadTrack(index, true);
    });
    row.addEventListener('dblclick', () => loadTrack(index, true));
    list.appendChild(row);

    // read the real length of each song
    const probe = new Audio();
    probe.preload = 'metadata';
    probe.addEventListener('loadedmetadata', () => {
      track.duration = prettyTime(probe.duration);
      row.querySelector('.track-duration').textContent = track.duration;
      if (index === activeTrack) $('duration').textContent = track.duration;
    });
    probe.src = track.file;
  });
}

function updateUI() {
  const playing = !audio.paused;
  document.querySelectorAll('.track-row').forEach((row, i) => {
    const selected = i === activeTrack;
    row.classList.toggle('selected', selected);
    row.querySelector('.track-play i').className = selected && playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  });
  $('togglePlayback').querySelector('i').className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  $('togglePlayback').setAttribute('aria-label', playing ? 'Pause selected track' : 'Play selected track');
  $('playAllBtn').querySelector('i').className = playing ? 'fa-solid fa-pause' : 'fa-solid fa-play';
  $('playAllLabel').textContent = playing ? 'Pause' : 'Play playlist';
  record.classList.toggle('playing', playing);
  stage.classList.toggle('playing', playing);
  stage.classList.toggle('open', playing);
  stage.classList.toggle('glass-open', playing);
}

function loadTrack(index, autoplay) {
  activeTrack = (index + tracks.length) % tracks.length;
  const track = tracks[activeTrack];
  $('nowTitle').textContent = track.title;
  $('nowArtist').textContent = track.artist;
  audio.src = track.file;
  $('currentTime').textContent = '0:00';
  $('duration').textContent = track.duration;
  $('progressRange').value = 0;
  showCover(track.cover);
  setHeroText(
    `AFTER HOURS  •  TRACK ${String(activeTrack + 1).padStart(2, '0')}`,
    track.heading,
    track.description
  );
  updateUI();
  if (autoplay) audio.play().catch(() => { showMissing(); updateUI(); });
}

function togglePlay() {
  if (activeTrack < 0) { loadTrack(0, true); return; }
  if (audio.paused) audio.play().catch(() => { showMissing(); updateUI(); });
  else audio.pause();
}

/* ---------- Start: default cover + DonBelle Playlist title/description ---------- */
setCover(DEFAULT_COVER);
heroEyebrow.textContent = DEFAULT_EYEBROW;
paintHeading(DEFAULT_HEADING);
heroDescription.textContent = DEFAULT_DESCRIPTION;
paintTracks();

/* ---------- Controls ---------- */
$('togglePlayback').addEventListener('click', togglePlay);
$('playAllBtn').addEventListener('click', togglePlay);
$('glassLid').addEventListener('click', togglePlay);
$('glassLid').addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); togglePlay(); }
});
$('prevTrack').addEventListener('click', () => loadTrack(activeTrack <= 0 ? tracks.length - 1 : activeTrack - 1, true));
$('nextTrack').addEventListener('click', () => loadTrack(activeTrack < 0 ? 0 : activeTrack + 1, true));

audio.addEventListener('play', updateUI);
audio.addEventListener('pause', updateUI);
audio.addEventListener('loadedmetadata', () => { $('duration').textContent = prettyTime(audio.duration); });
audio.addEventListener('timeupdate', () => {
  $('currentTime').textContent = prettyTime(audio.currentTime);
  if (Number.isFinite(audio.duration) && audio.duration > 0) $('progressRange').value = audio.currentTime / audio.duration * 100;
});
audio.addEventListener('ended', () => {
  if (activeTrack < tracks.length - 1) loadTrack(activeTrack + 1, true);
  else { audio.pause(); audio.currentTime = 0; updateUI(); }
});
$('progressRange').addEventListener('input', e => {
  if (Number.isFinite(audio.duration) && audio.duration > 0) audio.currentTime = Number(e.target.value) / 100 * audio.duration;
});
$('muteBtn').addEventListener('click', () => {
  audio.muted = !audio.muted;
  $('muteBtn').querySelector('i').className = audio.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high';
});