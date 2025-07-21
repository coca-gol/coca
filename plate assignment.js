// From PLAY MUSIC DATA APLIKASI
let allMusicFiles = [];
let albumList = {};
let userPlaylist = [];
let currentPlayingList = [];
let currentTrackIndex = -1;
let currentCategory = 'music';
let isShuffling = false;
let originalPlayingList = [];
let customPlaylists = [];
let activeCustomPlaylistId = null;
let currentPlaylistForImageUpload = null;

let isSwiping = false;
let startSwipeX = 0;
let currentScrollLeft = 0;

let thumbnailContent = '';
let likedSongs = JSON.parse(localStorage.getItem('likedSongs')) || [];
let isLikedSongsDisplayed = false;
let lastScrollY = window.scrollY;
let scrollTimeout;
let startY = 0;
let translateY = 0;
let currentTrackMetadata = null;


//  From SLIDE MENU  /
let startX = 0;
let isDragging = false;
let currentX = 0;
let translateX = 0;


// from sleep Timer
let sleepTimerTimeoutId = null;
let sleepTimerEndTime = 0;


//  Cut audio - Context untuk Web Audio API
let cutAudioPlayerPreview;
let audioContext;
let sourceNode;
let audioBufferData;
let mainAppWrapper;
let cutAudioView;

document.addEventListener('DOMContentLoaded', () => {

    const mainAppWrapper = document.getElementById('mainAppWrapper');
    const sideMenuOverlay = document.getElementById('sideMenuOverlay');
    const menuBtn = document.getElementById('menuBtn');
    const sideMenu = document.getElementById('sideMenu');
    const closeMenuBtn = document.getElementById('closeMenuBtn');


    const zoomToggle = document.getElementById('zoomToggle');
    const zoomStatusSpan = document.getElementById('zoomStatus');
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    const LS_KEY_ZOOM_ENABLED = 'zoom_enabled';
    let isZoomEnabled = localStorage.getItem(LS_KEY_ZOOM_ENABLED) === 'true';

    //    const rgbMaxColorToggle = document.getElementById('rgbMaxColor');
    //    const WALPPAPER_MODE_KEY = 'walppaperMode';

    const darkModeToggle = document.getElementById('darkModeToggle');
    const themeOptions = document.getElementById('themeOptions');
    const body = document.body;



    const downloadConvertView = document.getElementById('downloadConvertView');
    const downloadConvertBtn = document.getElementById('downloadConvertBtn');
    const closeDownloadConvertBtn = document.getElementById('closeDownloadConvertBtn');



    const cutAudioMenuItem = document.getElementById('cutAudioMenuItem');
    const cutAudioView = document.getElementById('cutAudioView');
    const closeCutAudioBtn = document.getElementById('closeCutAudioBtn');



    const aboutUsView = document.getElementById('aboutUsView');
    const aboutUsMenuItem = document.getElementById('aboutUsBtn');
    const closeAboutUsBtn = document.getElementById('closeAboutUsBtn');


    const supportedAudioExtensions = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'];
    const supportedVideoExtensions = ['mp4', 'webm', 'ogg', 'mov', 'avi'];


    const audioPlayer = document.getElementById('audioPlayer');
    const categoryButtons = document.querySelectorAll('.category-btn');
    const categoryContentWrapper = document.querySelector('.category-content-wrapper');
    const categoryContents = document.querySelectorAll('.category-content');
    const searchInput = document.getElementById('searchInput');
    const activeTrackTitleAnimation = document.getElementById('activeTrackTitleAnimation');
    const musicCategory = document.getElementById('musicCategory');


    const addMusicFolderBtn = document.getElementById('addMusicFolderBtn');


    const musicFolderInput = document.getElementById('musicFolderInput');
    const musicListUl = document.getElementById('musicList');
    const playAllCustomPlaylistBtn = document.getElementById('playAllCustomPlaylistBtn');
    const artistCategory = document.getElementById('artistCategory');
    const artistListUl = document.getElementById('artistList');
    const albumCategory = document.getElementById('albumCategory');
    const albumListUl = document.getElementById('albumList');
    const userPlaylistUl = document.getElementById('userPlaylist');
    const customPlaylistsUl = document.getElementById('customPlaylistsUl');
    const customConfirmOverlay = document.getElementById('customConfirmOverlay');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const musicCategoryBtn = document.querySelector('.category-btn[data-category="music"]');
    const listItem = document.createElement('li');
    const createPlaylistContainer = document.getElementById('create-playlist-container');
    const createPlaylistButton = document.getElementById('create-playlist-button');
    const newPlaylistInputArea = document.getElementById('new-playlist-input-area');
    const newPlaylistNameInput = document.getElementById('new-playlist-name');
    const saveNewPlaylistButton = document.getElementById('save-new-playlist-button');
    const cancelNewPlaylistButton = document.getElementById('cancel-new-playlist-button');
    const playlistImageInput = document.createElement('input');


    const playerControlContainer = document.getElementById('playerControlContainer');
    const currentTrackTitleEl = document.getElementById('currentTrackTitle');
    const currentTrackArtistEl = document.getElementById('currentTrackArtist');
    const currentTrackArtistMiniEl = document.getElementById('currentTrackArtistMini');
    const addToPlaylistBtn = document.getElementById('addToPlaylistBtn');

    const activeTrackTitleAnimationThumbnail = document.getElementById('activeTrackTitleAnimationThumbnail');
    const currentThumbnailArt = document.getElementById('currentThumbnailArt');

    const backgroundVideoPlayer = document.getElementById('backgroundVideoPlayer');

    const toggleThumbnailBtn = document.getElementById('toggleThumbnailBtn');
    const thumbnailContainer = document.getElementById('thumbnailContainer');
    const nowPlayingInfo = document.querySelector('.now-playing-info');
    const likedSongsEntry = document.getElementById('likedSongsEntry');
    const likedSongsUl = document.getElementById('likedSongsUl');
    const likedSongsCountSpan = likedSongsEntry ? likedSongsEntry.querySelector('.song-count'): null;
    const addThumbnailToPlaylistBtn = document.getElementById('addThumbnailToPlaylistBtn');
    const SCROLL_DEBOUNCE_DELAY = 100;
    const SCROLL_THRESHOLD = 30;

    const trackInfoBtn = document.getElementById('trackInfoBtn');
    const trackInfoPopup = document.getElementById('trackInfoPopup');
    const closeTrackInfoPopupBtn = document.getElementById('closeTrackInfoPopupBtn');
    const popupTrackTitle = document.getElementById('popupTrackTitle');
    const popupTrackArtist = document.getElementById('popupTrackArtist');
    const popupTrackAlbum = document.getElementById('popupTrackAlbum');
    const popupTrackDuration = document.getElementById('popupTrackDuration');
    const popupFileSize = document.getElementById('popupFileSize');
    const popupFilePath = document.getElementById('popupFilePath');

    const prevBtn = document.getElementById('prevBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');

    const playPauseBtnMini = document.getElementById('playPauseBtnMini');



    const toastNotification = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');


    // --- VARIABEL BARU UNTUK PROGRESS BAR V2 ---
    const playProgressBarV2 = document.getElementById('playProgressBarV2');
    const nextBtn = document.getElementById('nextBtn');
    const nextBtnMini = document.getElementById('nextBtnMini');
    const playbackProgressBar = document.getElementById('playbackProgressBar');
    const progressBarContainer = document.querySelector('.progress-bar-container');
    const currentTimeSpan = document.getElementById('currentTime');
    const totalDurationSpan = document.getElementById('totalDuration');
    //   const volumeSlider = document.getElementById('volumeSlider');
    const repeatBtn = document.getElementById('repeatBtn');
    const clearPlaylistBtn = document.getElementById('clearPlaylistBtn');
    const shuffleBtn = document.getElementById('shuffleBtn');
    const LS_KEY_MUSIC_METADATA = 'musicPlayer_allMusicMetadata_v4';
    const LS_KEY_PLAYLIST_IDS = 'musicPlayer_userPlaylistIds_v4';
    const LS_KEY_VOLUME = 'musicPlayer_volume';




    const sleepTimerBtn = document.getElementById('sleepTimerBtn');
    const sleepTimerModal = document.getElementById('sleepTimerModal');
    const timerOptionsContainer = sleepTimerModal.querySelector('.timer-options');
    const timerCountdownElement = document.getElementById('timerCountdown');
    const activeTimerDisplay = document.getElementById('activeTimerDisplay');
    const cancelActiveTimerBtn = document.getElementById('cancelActiveTimerBtn');



    const urlInput = document.getElementById('url');
    const processButton = document.getElementById('convert-btn');
    const resultsSection = document.getElementById('results');
    const loadingMessage = document.querySelector('#loading-message.loading-bubbles');

    const downloadLinksDiv = document.getElementById('download-links');
    const videoLink = document.getElementById('video-link');
    const audioLink = document.getElementById('audio-link');
    const errorMessage = document.getElementById('error-message');
    const videoInfoDisplay = document.getElementById('video-info-display');
    const videoThumbnail = document.getElementById('video-thumbnail');
    const videoTitleDisplay = document.getElementById('video-title-display');
    const videoPlayerContainer = document.getElementById('video-player-container');
    const videoPreviewIframe = document.getElementById('video-preview-iframe');



    const cutAudioFileInput = document.getElementById('cutAudioFileInput');
    const selectedFileName = document.getElementById('selectedFileName');
    const audioCuttingArea = document.getElementById('audioCuttingArea');
    const cutAudioFileNameDisplay = document.querySelector('#cutAudioFileNameDisplay .file-name-placeholder');
    const cutAudioOriginalDuration = document.getElementById('cutAudioOriginalDuration');
    const startSlider = document.getElementById('startSlider');
    const endSlider = document.getElementById('endSlider');
    const cutStartTimeDisplay = document.getElementById('cutStartTimeDisplay');
    const cutEndTimeDisplay = document.getElementById('cutEndTimeDisplay');
    const previewCutAudioBtn = document.getElementById('previewCutAudioBtn');
    const audioProgressSlider = document.getElementById('audioProgressSlider');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const totalDurationDisplay = document.getElementById('totalDurationDisplay');
    const customFileNameInput = document.getElementById('customFileNameInput');
    const downloadCutAudioLink = document.getElementById('downloadCutAudioLink');

    const cutAudioBtn = document.getElementById('cutAudioBtn');
    if (!cutAudioBtn) {
        console.error("Tombol 'Potong & Unduh' (ID: cutAudioBtn) tidak ditemukan di HTML.");
    }

    cutAudioPlayerPreview = document.getElementById('cutAudioPlayerPreview');

    if (!cutAudioPlayerPreview) {
        console.error("Elemen audio pratinjau (ID: cutAudioPlayerPreview) tidak ditemukan di HTML.");

        cutAudioPlayerPreview = new Audio();
    }

    const languageToggleV2 = document.getElementById('languageToggleV2');
    const languageOptionsV2 = document.getElementById('languageOptionsV2');

    //  elemen yang akan diterjemahkan
    const textToTranslateV01 = document.getElementById('textv01');
    //    const textToTranslateV02 = document.getElementById('textv02');
    const textToTranslateV03 = document.getElementById('textv03');
    const textToTranslateV04 = document.getElementById('textv04');
    const textToTranslateV05 = document.getElementById('textv05');
    const textToTranslateV06 = document.getElementById('textv06');
    const textToTranslateV07 = document.getElementById('textv07');
    const textToTranslateV2 = document.getElementById('textv2');
    const textToTranslateV3 = document.getElementById('textv3');
    const textToTranslateV4 = document.getElementById('textv4');
    const textToTranslateV5 = document.getElementById('textv5');
    const textToTranslateV6 = document.getElementById('textv6');
    const textToTranslateV7 = document.getElementById('textv7');
    const textToTranslateV8 = document.getElementById('textv8');
    //    const textToTranslateV9 = document.getElementById('textv9');
    const textToTranslateV10 = document.getElementById('textv10');
    const textToTranslateV11 = document.getElementById('textv11');
    const textToTranslateV12 = document.getElementById('textv12');
    const textToTranslateV13 = document.getElementById('textv13');
    const textToTranslateV14 = document.getElementById('textv14');
    const textToTranslateV15 = document.getElementById('textv15');
    const textToTranslateV16 = document.getElementById('textv16');
    const textToTranslateV17 = document.getElementById('textv17');
    const textToTranslateV18 = document.getElementById('textv18');
    const textToTranslateV19 = document.getElementById('textv19');
    const textToTranslateV20 = document.getElementById('textv20');

    let currentActiveLanguageV2 = localStorage.getItem('selectedLangV2') || 'id';

    const translationsV2 = {
        id: {
            textv01: "indonesia",
            //        textv02: "Tema",
            textv03: "potong audio",
            textv04: "pengunduh",
            textv05: "pengatur waktu",
            textv06: "Hapus daftar putar",
            textv07: "informasi",
            textv2: "Musik",
            textv3: "Artis",
            textv4: "Album",
            textv5: "Daftar putar",
            textv6: "artist",
            textv7: "pindai folder musik",
            textv8: "lihat musik",
            //       textv9: "Musik Berdasarkan album",
            //
            textv11: "lagu Favorit",
            textv12: "Tidak ada lagu yang sedang diputar",
            textv10: "Tidak ada lagu yang sedang diputar",
            textv13: "Tidak ada lagu yang sedang diputar",
            textv14: "informasi lagu",
            textv15: "Buat daftar putar baru",
            textv16: "Artis",
            textv17: "PILIH WAKTU",
            textv18: "Apakah Anda yakin ingin menghapus daftar putar ini?",
            textv19: "Judul :",
            textv20: "Artis :"

        },
        en: {
            textv01: "English",
            //         textv02: "Theme",
            textv03: "Cut audio",
            textv04: "Downloader",
            textv05: "Sleep timer",
            textv06: "Delete playlist",
            textv07: "information",
            textv2: "Music",
            textv3: "Artist",
            textv4: "Album",
            textv5: "Playlist",
            textv6: "artist",
            textv7: "scan music folder",
            textv8: "Music display",
            //        textv9: "Music by album",
            //        textv10: "my playlist",
            textv11: "favorit song",
            textv12: "No song are playing",
            textv10: "No songs are playing",
            textv13: "No songs are playing",
            textv14: "song information",
            textv15: "Create a new playlist",
            textv16: "Artist",
            textv17: "SELECT TIMER",
            textv18: "Are you sure you want to delete this playlist?",
            textv19: "Title:",
            textv20: "Artist :"
        }
    };

// Fungsi untuk menerapkan terjemahan V2
    function applyTranslationV2(lang) {
        if (translationsV2[lang]) {
            // Perbarui teks untuk setiap elemen
            if (textToTranslateV01) {
                textToTranslateV01.textContent = translationsV2[lang].textv01;
            }
            //           if (textToTranslateV02) {
            //               textToTranslateV02.textContent = translationsV2[lang].textv02;
            //           }
            if (textToTranslateV03) {
                textToTranslateV03.textContent = translationsV2[lang].textv03;
            }
            if (textToTranslateV04) {
                textToTranslateV04.textContent = translationsV2[lang].textv04;
            }
            if (textToTranslateV05) {
                textToTranslateV05.textContent = translationsV2[lang].textv05;
            }
            if (textToTranslateV06) {
                textToTranslateV06.textContent = translationsV2[lang].textv06;
            }
            if (textToTranslateV07) {
                textToTranslateV07.textContent = translationsV2[lang].textv07;
            }
            if (textToTranslateV2) {
                textToTranslateV2.textContent = translationsV2[lang].textv2;
            }
            if (textToTranslateV3) {
                textToTranslateV3.textContent = translationsV2[lang].textv3;
            }
            if (textToTranslateV4) {
                textToTranslateV4.textContent = translationsV2[lang].textv4;
            }
            if (textToTranslateV5) {
                textToTranslateV5.textContent = translationsV2[lang].textv5;
            }
            if (textToTranslateV6) {
                textToTranslateV6.textContent = translationsV2[lang].textv6;
            }
            if (textToTranslateV7) {
                textToTranslateV7.textContent = translationsV2[lang].textv7;
            }
            if (textToTranslateV8) {
               textToTranslateV8.textContent = translationsV2[lang].textv8;
            }
            //       if (textToTranslateV9) {
            //            textToTranslateV9.textContent = translationsV2[lang].textv9;

            if (textToTranslateV10) {
                textToTranslateV10.textContent = translationsV2[lang].textv10;
            }
            if (textToTranslateV11) {
                textToTranslateV11.textContent = translationsV2[lang].textv11;
            }
            if (textToTranslateV12) {
                textToTranslateV12.textContent = translationsV2[lang].textv12;
            }
            if (textToTranslateV13) {
                textToTranslateV13.textContent = translationsV2[lang].textv13;
            }
            if (textToTranslateV14) {
                textToTranslateV14.textContent = translationsV2[lang].textv14;
            }
            if (textToTranslateV15) {
                textToTranslateV15.textContent = translationsV2[lang].textv15;
            }
            if (textToTranslateV16) {
                textToTranslateV16.textContent = translationsV2[lang].textv16;
            }
            if (textToTranslateV17) {
                textToTranslateV17.textContent = translationsV2[lang].textv17;
            }
            if (textToTranslateV18) {
                textToTranslateV18.textContent = translationsV2[lang].textv18;
            }
            if (textToTranslateV19) {
                textToTranslateV19.textContent = translationsV2[lang].textv19;
            }
            if (textToTranslateV20) {
                textToTranslateV20.textContent = translationsV2[lang].textv20;
            }
            // Opsional: Simpan bahasa yang dipilih di localStorage
            localStorage.setItem('selectedLangV2', lang);
        }
    }

    languageToggleV2.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah link dari melakukan navigasi atau scroll ke atas
        languageOptionsV2.classList.toggle('open');
    });

    languageOptionsV2.addEventListener('click', (e) => {
        // Memastikan yang diklik adalah elemen <a> di dalam <li>
        if (e.target.tagName === 'A' && e.target.closest('li')) {
            e.preventDefault(); // Mencegah link dari melakukan navigasi

            const selectedLang = e.target.dataset.lang; // Ambil nilai data-lang
            if (selectedLang) {
                applyTranslationV2(selectedLang); // Terapkan terjemahan
                languageOptionsV2.classList.remove('open'); // Sembunyikan daftar setelah memilih
            }
        }
    });

    const defaultLangV2 = localStorage.getItem('selectedLangV2') || 'id';
    applyTranslationV2(defaultLangV2);
    
    const savedTheme = localStorage.getItem('theme') || 'default'; // Ambil tema tersimpan
    applyTheme(savedTheme);

    if (darkModeToggle) {
        updateDarkModeToggleText(savedTheme);
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleThemeOptions);
    }


    function toggleThemeOptions() {
        themeOptions.classList.toggle('open');
    }

    //  Fungsi untuk Mengaplikasikan Tema
    function applyTheme(themeName) {
        body.className = ''; // Reset kelas tema yang ada
        body.classList.add(themeName);
        localStorage.setItem('theme',
            themeName);
        updateDarkModeToggleText(themeName);
    }

    function updateDarkModeToggleText(theme) {
        if (darkModeToggle) {
            let iconClass = '';
            let text = '';
            switch (theme) {
                default:
                    iconClass = 'fas fa-sun';
                    text = 'default';
                    break;
                case 'night':
                    iconClass = 'fas fa-moon';
                    text = 'night';
                    break;
                case 'dark':
                    iconClass = 'fas fa-bolt';
                    text = 'dark';
                    break;
                case 'monokrom':
                    iconClass = 'fas fa-stroopwafel';
                    text = 'monokrom';
                    break;
                case 'purple':
                    iconClass = 'fas fa-wand-sparkles';
                    text = 'purple';
                    break;
                case 'magenta':
                    iconClass = 'fas fa-wand-sparkles';
                    text = 'magenta';
                    break;
                case 'red':
                    iconClass = 'fas fa-fire';
                    text = 'red';
                    break;
                case 'maron':
                    iconClass = 'fas fa-fire';
                    text = 'maron';
                    break;
                case 'orange':
                    iconClass = 'fas fa-lemon';
                    text = 'orange';
                    break;
                case 'blue':
                    iconClass = 'fab fa-skyatlas';
                    text = 'blue';
                    break;
                case 'navy':
                    iconClass = 'fab fa-skyatlas';
                    text = 'navy';
                    break;
                case 'green':
                    iconClass = 'fas fa-leaf';
                    text = 'green';
                    break;
                case 'armygreen':
                    iconClass = 'fas fa-leaf';
                    text = 'army green';
                    break;

            }
            darkModeToggle.innerHTML = `<i class="${iconClass}"></i>&nbsp;Theme ${text}`;
        }
    }

    //  Event Listeners untuk Memilih Tema
    if (themeOptions) {
        themeOptions.addEventListener('click', (event) => {
            const target = event.target.closest('a');
            if (target) {
                const theme = target.dataset.theme;
                applyTheme(theme);
                themeOptions.classList.remove('open'); // Tutup opsi tema setelah dipilih
            }
        });
    }

    // Fungsi untuk memperbarui meta tag dan UI
    function updateZoomSetting(enableZoom) {
        if (enableZoom) {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=yes, maximum-scale=5.0');
            //    zoomStatusSpan.textContent = 'izinkan zoom';
            // PERBAIKAN DI SINI
            zoomToggle.querySelector('i').classList.remove('fa-lock'); // Hapus hanya nama ikon lama
            zoomToggle.querySelector('i').classList.add('fa-arrows'); // Tambahkan hanya nama ikon baru
        } else {
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            //           zoomStatusSpan.textContent = 'kunci zoom';
            // PERBAIKAN DI SINI
            zoomToggle.querySelector('i').classList.remove('fa-arrows'); // Hapus hanya nama ikon lama
            zoomToggle.querySelector('i').classList.add('fa-lock'); // Tambahkan hanya nama ikon baru
        }
        localStorage.setItem(LS_KEY_ZOOM_ENABLED, enableZoom);
        isZoomEnabled = enableZoom; // Perbarui status internal
    }


    function toggleSideMenu(forceClose = false) {
        if (sideMenuOverlay && sideMenu) {
            if (forceClose || sideMenuOverlay.classList.contains('active')) {
                // Tutup menu
                sideMenuOverlay.classList.remove('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                sideMenu.style.transform = '';
                translateX = 0;

            } else {
                // Buka menu
                sideMenuOverlay.classList.add('active');
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                sideMenu.style.transform = 'translateX(0)';
                translateX = 0; // Reset posisi geser
            }
        }
    }

    if (sideMenu && sideMenu.classList.contains('active') && !sideMenu.contains(e.target) && !menuBtn.contains(e.target)) {
        console.log("Clicked outside side menu. Closing sideMenu.");
        sideMenu.classList.remove('active');

        menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    }

    // menutup side menu dengan GESER HORIZONTAL KE KIRI
    if (sideMenuOverlay && sideMenu) {
        sideMenuOverlay.addEventListener('mousedown', (e) => {

            if (sideMenuOverlay.classList.contains('active')) {
                startX = e.clientX;
                isDragging = true;
                sideMenu.style.transition = 'none'; // Hilangkan transisi saat dragging
            }
        });

        sideMenuOverlay.addEventListener('mousemove',
            (e) => {
                if (!isDragging) return;

                currentX = e.clientX;
                const diffX = currentX - startX;

                if (diffX <= 0) {
                    // Hanya jika digeser ke kiri
                    translateX = diffX;
                    sideMenu.style.transform = `translateX(${translateX}px)`;
                }
            });

        sideMenuOverlay.addEventListener('mouseup',
            () => {
                if (!isDragging) return;

                isDragging = false;
                sideMenu.style.transition = 'left 0.3s ease-in-out'; // Kembalikan transisi

                // geseran lebih dari setengah lebar menu, tutup
                if (translateX < -sideMenu.offsetWidth / 2) {
                    toggleSideMenu(true);
                } else {
                    sideMenu.style.transform = 'translateX(0)'; // Kembalikan ke posisi terbuka
                    translateX = 0;
                }
            });

        sideMenuOverlay.addEventListener('mouseleave',
            () => {

                if (isDragging) {
                    isDragging = false;
                    sideMenu.style.transition = 'left 0.3s ease-in-out'; // Kembalikan transisi
                    sideMenu.style.transform = translateX < -sideMenu.offsetWidth / 2 ? 'translateX(-300px)': 'translateX(0)'; // Sesuaikan dengan lebar menu
                    if (translateX < -sideMenu.offsetWidth / 2) {
                        setTimeout(() => toggleSideMenu(true), 300); // Tunggu transisi selesai
                    } else {
                        translateX = 0;
                    }
                }
            });

        //  Event untuk Sentuhan (Touch)
        sideMenuOverlay.addEventListener('touchstart',
            (e) => {
                // sentuhan pertama (satu jari) dan jika menu sudah terbuka
                if (e.touches.length === 1 && sideMenuOverlay.classList.contains('active')) {
                    startX = e.touches[0].clientX;
                    isDragging = true;
                    sideMenu.style.transition = 'none'; // Hilangkan transisi saat dragging
                }
            },
            {
                passive: true
            }); // passive: true untuk performa scrolling

        sideMenuOverlay.addEventListener('touchmove',
            (e) => {
                if (!isDragging || e.touches.length === 0) return;

                currentX = e.touches[0].clientX;
                const diffX = currentX - startX;

                if (diffX <= 0) {
                    // Hanya jika digeser ke kiri
                    translateX = diffX;
                    sideMenu.style.transform = `translateX(${translateX}px)`;
                }
            },
            {
                passive: true
            });


        sideMenuOverlay.addEventListener('touchend',
            () => {
                if (!isDragging) return;

                isDragging = false;
                sideMenu.style.transition = 'left 0.3s ease-in-out'; // Kembalikan transisi

                // Jika geseran lebih dari setengah lebar menu, tutup
                if (translateX < -sideMenu.offsetWidth / 2) {
                    toggleSideMenu(true);
                } else {
                    sideMenu.style.transform = 'translateX(0)'; // Kembalikan ke posisi terbuka
                    translateX = 0;
                }
            });
    }

    function showOverlayView(viewElement) {
        // 1. Sembunyikan semua overlay full-screen yang mungkin aktif
        document.querySelectorAll('.full-screen-overlay').forEach(overlay => {
            overlay.classList.remove('active');
        });

        // 2. Sembunyikan seluruh konten utama aplikasi
        if (mainAppWrapper) {
            mainAppWrapper.classList.add('hidden');
        }

        // 3. Sembunyikan menu samping jika terbuka
        if (sideMenu && sideMenu.classList.contains('active')) {
            sideMenu.classList.remove('active');
            menuBtn.innerHTML = '<i class="fas fa-bars"></i>'; // Kembali ke ikon bar
        }

        // 4. Tampilkan overlay yang diminta
        if (viewElement) {
            viewElement.classList.add('active');
        }
        console.log(`Menampilkan overlay: ${viewElement ? viewElement.id: 'N/A'}`);
    }

    // GLOBAL EVENT LISTENER UNTUK KLIK PADA DOCUMENT ---
    document.addEventListener('click', (e) => {
        //  PENANGANAN TOMBOL TAMBAH KE PLAYLIST (UMUM & KUSTOM)
        if (e.target.closest('.add-to-default-playlist-btn')) {
            // Tombol tambah ke playlist default
            const btn = e.target.closest('.add-to-default-playlist-btn');
            const fileId = btn.dataset.fileId;
            addSongToDefaultPlaylist(fileId);

            const trackToAdd = allMusicFiles.find(t => t.id === fileId);
            if (trackToAdd && userPlaylist.some(t => t.id === fileId)) {
                btn.classList.add('active');
                btn.querySelector('i').className = 'fas fa-check';
                btn.title = 'Sudah ada di Antrian';
            }
        } else if (e.target.closest('.add-to-custom-playlist-btn')) {
            // Tombol tambah ke playlist kustom
            const btn = e.target.closest('.add-to-custom-playlist-btn');
            const fileId = btn.dataset.fileId;
            addSongToActiveCustomPlaylist(fileId);

            const activePlaylist = activeCustomPlaylistId ? customPlaylists.find(p => p.id === activeCustomPlaylistId): null;
            if (activePlaylist && activePlaylist.songs.includes(fileId)) {
                btn.classList.add('added');
                btn.querySelector('i').className = 'fas fa-check';
                btn.title = `Sudah ada di "${activePlaylist.name}"`;
            }
        } else if (e.target.closest('.remove-from-playlist-btn')) {

            const btn = e.target.closest('.remove-from-playlist-btn');
            const fileId = btn.dataset.fileId;
            const trackToRemove = userPlaylist.find(t => t.id === fileId);

            if (trackToRemove) {
                userPlaylist = userPlaylist.filter(t => t.id !== fileId);

                if (currentCategory === 'playlist') {

                    renderMusicList(userPlaylist, userPlaylistUl, true); // Pastikan fungsi ini terdefinisi
                }
                saveMusicData(); // Pastikan fungsi ini terdefinisi
                alert(`"${parseTrackInfo(trackToRemove.name).title}" dihapus dari Antrian.`); // Pastikan parseTrackInfo terdefinisi
                console.log(`Removed "${trackToRemove.name}" from playlist.`);

                // Update tombol di musicListUl juga jika lagu ini ada di sana
                const musicItemBtn = musicListUl.querySelector(`.add-to-default-playlist-btn[data-file-id="${fileId}"]`);
                if (musicItemBtn) {
                    musicItemBtn.classList.remove('active');
                    musicItemBtn.querySelector('i').className = 'fas fa-plus'; // Kembali ke ikon plus/default
                    musicItemBtn.title = 'Tambahkan ke Antrian';
                }

                if (currentPlayingList === userPlaylist) {
                    if (currentTrackIndex >= userPlaylist.length) {
                        currentTrackIndex = userPlaylist.length - 1;
                    }
                    if (userPlaylist.length === 0) {
                        loadTrack(-1); // Berhenti memutar jika playlist kosong
                    } else {
                        loadTrack(currentTrackIndex); // Tetap pada lagu yang sama atau pindah ke sebelumnya
                    }
                }
            }
        }
    });

    if (progressBarContainer) {
        progressBarContainer.addEventListener('click', (e) => {
            if (!audioPlayer.src || isNaN(audioPlayer.duration)) {
                console.log("Cannot set playback position: no audio source or duration invalid.");
                return;
            }
            const width = progressBarContainer.clientWidth;
            const clickX = e.offsetX;
            const duration = audioPlayer.duration;
            audioPlayer.currentTime = (clickX / width) * duration;
            console.log("Set playback position to:", audioPlayer.currentTime);
        });
    }

    // Terapkan pengaturan zoom saat halaman dimuat
    updateZoomSetting(isZoomEnabled);

    if (zoomToggle) {
        zoomToggle.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah navigasi tautan
            updateZoomSetting(!isZoomEnabled); // Balikkan status

        });
    }

    if (nowPlayingInfo) {
        nowPlayingInfo.addEventListener('click', (e) => {
            if (addToPlaylistBtn && e.target.closest('#addToPlaylistBtn')) {
                return;
            }
            e.stopPropagation();
            toggleThumbnail();
        });
    }

    if (downloadConvertBtn) {
        downloadConvertBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlayView(downloadConvertView);
            console.log("Membuka halaman Download & Convert.");
        });
    }

    // Event listener untuk membuka halaman About Us
    if (aboutUsBtn) {
        aboutUsBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlayView(aboutUsView); // Pastikan showOverlayView terdefinisi
            console.log("Membuka halaman About us.");
        });
    }
    // Listener untuk menu item potong audio
    if (cutAudioMenuItem) {
        cutAudioMenuItem.addEventListener('click', (e) => {
            e.preventDefault();

            audioCuttingArea.style.display = 'none';
            downloadCutAudioLink.style.display = 'none';

            document.querySelectorAll('.full-screen-overlay').forEach(overlay => {
                if (overlay.classList.contains('active')) {
                    overlay.classList.remove('active');
                }
            });
            if (mainAppWrapper) {
                mainAppWrapper.classList.add('hidden'); // Sembunyikan mainAppWrapper
            }

            cutAudioView.classList.add('active'); // Tampilkan overlay potong audio
            resetCutAudioUI(); // Pastikan resetCutAudioUI terdefinisi
            console.log("Membuka halaman Potong Audio.");
        });
    }

    if (menuBtn) {
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSideMenu(); // Panggil fungsi toggle
        });
    }

    if (sideMenuOverlay) {
        sideMenuOverlay.addEventListener('click', (e) => {

            if (e.target === sideMenuOverlay) {
                console.log("Clicked on sideMenuOverlay outside sideMenu. Closing sideMenu.");
                toggleSideMenu(true); // Tutup paksa menu
            }
        });
    }

    // Listener untuk pilihan durasi timer di dalam modal sleep timer
    if (timerOptionsContainer) {
        timerOptionsContainer.addEventListener('click', (e) => {
            const targetLi = e.target.closest('li'); // Mendapatkan li yang diklik
            if (!targetLi) return;
            const targetButton = targetLi.querySelector('button');
            if (!targetButton) return;

            const minutes = parseInt(targetButton.dataset.minutes);

            const milliseconds = minutes * 60 * 1000;
            sleepTimerEndTime = Date.now() + milliseconds;
            clearTimeout(sleepTimerTimeoutId);
            sleepTimerTimeoutId = setTimeout(() => {
                console.log("Sleep Timer berakhir. Memutar musik.");
                if (audioPlayer) {
                    audioPlayer.pause();
                }

                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtnMini.innerHTML = '<i class="fas fa-play"></i>';
                sleepTimerTimeoutId = null;
                sleepTimerEndTime = 0;
                if (timerCountdownElement) {
                    timerCountdownElement.textContent = '';
                }
                updateActiveTimerDisplay(); // Perbarui tampilan active timer
            },
                milliseconds);

            console.log(`Sleep Timer diatur untuk ${minutes} menit.`);
            updateCountdown();
            sleepTimerModal.classList.remove('active');
            updateActiveTimerDisplay(); // Perbarui tampilan active timer
        });
    }

    // Event Listener untuk tombol batalkan timer yang aktif
    if (cancelActiveTimerBtn) {
        cancelActiveTimerBtn.addEventListener('click', () => {
            if (sleepTimerTimeoutId) {
                clearTimeout(sleepTimerTimeoutId);
                sleepTimerTimeoutId = null;
                sleepTimerEndTime = 0;
                if (timerCountdownElement) {
                    timerCountdownElement.textContent = '';
                }
                updateActiveTimerDisplay(); // Perbarui tampilan active timer
                console.log("Sleep Timer dibatalkan dari tampilan aktif.");
            }
        });
    }

    function updateCountdown() {
        if (sleepTimerTimeoutId === null) {
            activeTimerDisplay.innerHTML = '';
            activeTimerDisplay.style.display = 'none';
            return;
        }

        const remainingTimeMs = sleepTimerEndTime - Date.now();
        const remainingTimeSeconds = Math.floor(remainingTimeMs / 1000);

        if (remainingTimeSeconds <= 0) {
            activeTimerDisplay.innerHTML = '00:00';
            activeTimerDisplay.style.display = 'none';
        } else {
            const formattedTime = formatTime(remainingTimeSeconds);
            const svgCode = `<i class="fa-solid fa-clock"></i>`;

            activeTimerDisplay.innerHTML = `<i class="fa-solid fa-clock"></i> Sisa: ${formattedTime}`;
            activeTimerDisplay.style.display = 'inline-flex';
            cancelActiveTimerBtn.style.display = 'inline'; // Selalu tampilkan tombol batal
        }

        requestAnimationFrame(updateCountdown);
    }

    function updateActiveTimerDisplay() {
        if (sleepTimerTimeoutId === null) {
            activeTimerDisplay.innerHTML = '';
            activeTimerDisplay.style.display = 'none';
            cancelActiveTimerBtn.style.display = 'none'; // Sembunyikan tombol batal saat timer tidak aktif
        }
    }

    //  Event Listener untuk tombol close modal
    if (closeSleepTimerModalBtn) {
        closeSleepTimerModalBtn.addEventListener('click', () => {
            sleepTimerModal.classList.remove('active'); // Hanya menutup modal
        });
    }

    //  Event Listener untuk Tombol Sleep Timer di Menu Samping
    if (sleepTimerBtn) {
        sleepTimerBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Mencegah navigasi link
            e.stopPropagation();

            console.log("--- Sleep Timer Button CLICKED ---");
            // Toggle tampilan modal timer
            if (sleepTimerModal) {
                sleepTimerModal.classList.toggle('active');
                console.log("sleepTimerModal active class status:", sleepTimerModal.classList.contains('active'));

                if (sleepTimerModal.classList.contains('active')) {
                    updateCountdown(); // Pastikan updateCountdown terdefinisi
                }
            }
        });
    }

    if (likedSongsUl) {
        likedSongsUl.addEventListener('click', (e) => {
            const removeBtn = e.target.closest('.remove-from-liked-btn');
            if (removeBtn) {
                const trackName = removeBtn.dataset.trackName;
                if (trackName) {
                    removeTrackFromLikedSongs(trackName);
                    renderLikedSongs();
                }

                return;
            }

            const trackItem = e.target.closest('.track-item');
            if (trackItem) {

                const trackName = trackItem.dataset.trackName;
                const trackIndexInLiked = parseInt(trackItem.dataset.trackIndex); // Ambil index dari dataset

                if (isNaN(trackIndexInLiked) || trackIndexInLiked < 0 || trackIndexInLiked >= likedSongs.length) {
                    console.error("Indeks lagu tidak valid.");
                    return;
                }

                // Atur currentPlayingList ke likedSongs dan putar lagu
                currentPlayingList = [...likedSongs]; // Salin array likedSongs ke currentPlayingList
                currentTrackIndex = trackIndexInLiked; // Set indeks ke lagu yang diklik

                loadTrack(currentTrackIndex); // Muat lagu yang dipilih
                audioPlayer.play(); // Putar lagu
                console.log(`Memutar lagu dari Lagu Favorit: ${trackName}`);
            }
        });
    }

    updateLikedSongsCount();

    if (customPlaylistsUl) customPlaylistsUl.style.display = 'block';
    if (likedSongsUl) likedSongsUl.style.display = 'none';
    if (userPlaylistUl) userPlaylistUl.style.display = 'none';

    isLikedSongsDisplayed = false;




    //  Helper Functions
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2,
            '0')}:${remainingSeconds.toString().padStart(2,
            '0')}`;
    }

    // OVERLAY All PAGE  DOWN - CUT - ABS
    function formatTime(seconds) {
        const date = new Date(null);
        date.setSeconds(seconds);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = Math.floor(seconds % 60);

        if (hours > 0) {
            return `${hours}:${minutes < 10 ? '0': ''}${minutes}:${remainingSeconds < 10 ? '0': ''}${remainingSeconds}`;
        }
        return `${minutes}:${remainingSeconds < 10 ? '0': ''}${remainingSeconds}`;
    }

    function updateSliderTrack() {
        const totalDuration = parseFloat(endSlider.max);
        if (isNaN(totalDuration) || totalDuration === 0) return;

        const startVal = parseFloat(startSlider.value);
        const endVal = parseFloat(endSlider.value);

        const startPercent = (startVal / totalDuration) * 100;
        const endPercent = (endVal / totalDuration) * 100;

        const sliderTrack = document.querySelector('.slider-track');
        sliderTrack.style.left = `${startPercent}%`;
        sliderTrack.style.width = `${endPercent - startPercent}%`;
    }

    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    // Fungsi RESET UI Potong Audio
    function resetCutAudioUI() {
        if (cutAudioPlayerPreview) {

            cutAudioPlayerPreview.pause();
            cutAudioPlayerPreview.src = '';

            const oldPreviewUrl = cutAudioPlayerPreview.src;
            if (oldPreviewUrl && oldPreviewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(oldPreviewUrl);
            }
        }
        // Reset variabel data audio
        audioBufferData = null;

        // Reset elemen UI
        selectedFileName.textContent = 'Tidak ada file terpilih, klik disini.';
        cutAudioFileNameDisplay.textContent = ''; // Hapus nama file di detail
        cutAudioOriginalDuration.textContent = '0:00';
        currentTimeDisplay.textContent = '00:00';
        totalDurationDisplay.textContent = '00:00';
        customFileNameInput.value = ''; // Kosongkan nama file kustom
        downloadCutAudioLink.style.display = 'none'; // Sembunyikan link unduhan
        downloadCutAudioLink.href = '#'; // Reset href

        // Reset slider
        startSlider.value = 0;
        endSlider.value = 100; // Atau nilai default yang sesuai
        audioProgressSlider.value = 0;
        startSlider.max = 100; // Reset max slider ke default jika belum ada audio
        endSlider.max = 100;
        audioProgressSlider.max = 100;
        updateSliderDisplays(); // Update tampilan waktu dan track slider

        audioCuttingArea.style.display = 'none';

        // Reset ikon tombol play
        previewCutAudioBtn.innerHTML = '<i class="fas fa-play"></i>';

        console.log("UI Potong Audio telah direset.");
    }

    async function restoreMainPlayerFromCutAudio() {
        console.log("restoreMainPlayerFromCutAudio: Dipanggil.");

        if (typeof currentTrackPlayingMetadata !== 'undefined' && currentTrackPlayingMetadata) {
            console.log("restoreMainPlayerFromCutAudio: Memulihkan lagu:", currentTrackPlayingMetadata.title);

            await loadAndPlayMainTrack(currentTrackPlayingMetadata);
        } else {
            console.log("restoreMainPlayerFromCutAudio: Tidak ada lagu untuk dipulihkan.");

            if (audioPlayer) {
                audioPlayer.pause();
            }
        }
    }

    // Fungsi untuk mereset UI Player
    function resetPlayerUI() {
        console.log("Resetting player UI.");
        if (playPauseBtn) playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        if (playPauseBtnMini) playPauseBtnMini.innerHTML = '<i class="fas fa-play"></i>';
        if (currentTrackTitleEl) currentTrackTitleEl.textContent = 'Tidak ada lagu yang sedang di putar';
        if (currentTrackArtistEl) currentTrackArtistEl.textContent = 'Artis';
        if (currentTrackArtistMiniEl) currentTrackArtistMiniEl.textContent = 'Artis';
        if (currentTimeSpan) currentTimeSpan.textContent = '0:00';
        if (totalDurationSpan) totalDurationSpan.textContent = '0:00';

        if (playbackProgressBar) {
            playbackProgressBar.style.width = '0%';
        }
        if (playProgressBarV2) {
            // Tambahkan ini untuk progress bar V2
            playProgressBarV2.style.width = '0%';
        }

        // Bersihkan video background
        if (backgroundVideoPlayer) {
            backgroundVideoPlayer.src = ''; // Hentikan video
            backgroundVideoPlayer.classList.remove('is-loaded'); 
            if (backgroundVideoPlayer.srcObject) {
                backgroundVideoPlayer.srcObject = null;
            }
        }

        if (addToPlaylistBtn) addToPlaylistBtn.classList.remove('active');

        if ('clearAppBadge' in navigator) {
            navigator.clearAppBadge()
            .then(() => console.log('[Badging API] Badge cleared on UI reset'))
            .catch(error => console.error('[Badging API] Gagal menghapus badge:', error));
        }
    }

    function parseTrackInfo(fileName) {
        const cleanedName = fileName.replace(/\.(mp3|wav|ogg|m4a|flac)$/i,
            '');
        const parts = cleanedName.split(' - ');
        let artist = 'Artis Tidak Diketahui';
        let title = cleanedName;

        if (parts.length > 1) {
            artist = parts[0].trim();
            title = parts.slice(1).join(' - ').trim();
        }
        return {
            title,
            artist
        };
    }

    function updatePlaybackProgress() {
        const currentTime = audioPlayer.currentTime;
        const duration = audioPlayer.duration;

        // Perbarui current time display
        const currentMinutes = Math.floor(currentTime / 60);
        const currentSeconds = Math.floor(currentTime % 60).toString().padStart(2, '0');
        currentTimeSpan.textContent = `${currentMinutes}:${currentSeconds}`;

        // Perbarui total duration display (hanya jika durasi valid)
        if (isFinite(duration)) {
            // Pastikan durasi adalah angka valid
            const totalMinutes = Math.floor(duration / 60);
            const totalSeconds = Math.floor(duration % 60).toString().padStart(2, '0');
            totalDurationSpan.textContent = `${totalMinutes}:${totalSeconds}`;
        } else {
            totalDurationSpan.textContent = '0:00'; // Atau 'N/A'
        }

        // Perbarui progress bar LAMA dan BARU
        if (isFinite(duration) && duration > 0) {
            const progressPercent = (currentTime / duration) * 100;
            if (playbackProgressBar) {
                playbackProgressBar.style.width = `${progressPercent}%`;
            }
            if (playProgressBarV2) {
                playProgressBarV2.style.width = `${progressPercent}%`;
            }
        } else {
            if (playbackProgressBar) {
                playbackProgressBar.style.width = '0%';
            }
            if (playProgressBarV2) {
                playProgressBarV2.style.width = '0%';
            }
        }
    }

    // Fungsi untuk menghasilkan ID unik yang stabil untuk file
    function generateFileId(file) {
        return `${file.name}-${file.lastModified}-${file.size}`;
    }

    // Local Storage Management
    function saveMusicData() {
        const simplifiedMusicMetadata = allMusicFiles.map(file => ({
            id: file.id,
            name: file.name,

            title: file.title,
            artist: file.artist,
            album: file.album,
            thumbnailUrl: file.thumbnailUrl,
            fileData: Blob, //DISIMPAN DI INDEXEDDB
            size: file.size // Simpan ukuran file juga
        }));
        localStorage.setItem(LS_KEY_MUSIC_METADATA, JSON.stringify(simplifiedMusicMetadata));

        localStorage.setItem(LS_KEY_PLAYLIST_IDS, JSON.stringify(userPlaylist.map(track => track.id)));
        //  localStorage.setItem(LS_KEY_VOLUME, audioPlayer.volume.toString());
    }

    function loadMusicData() {
        console.log("Loading music data from localStorage...");
        const storedMusicMetadata = localStorage.getItem(LS_KEY_MUSIC_METADATA);
        if (storedMusicMetadata) {
            try {
                const parsedMetadata = JSON.parse(storedMusicMetadata);
                // Penting: allMusicFiles sekarang hanya menyimpan metadata. File audio sendiri ada di IndexedDB.
                allMusicFiles = parsedMetadata;
                console.log("Music metadata loaded from localStorage.");
            } catch (e) {
                console.error("Error loading music metadata from localStorage:", e);
                allMusicFiles = [];
            }
        } else {
            allMusicFiles = [];
        }


        const storedPlaylistIds = localStorage.getItem(LS_KEY_PLAYLIST_IDS);
        if (storedPlaylistIds) {
            try {
                const parsedPlaylistIds = JSON.parse(storedPlaylistIds);
                // Rekonstruksi userPlaylist menggunakan ID dan mencari metadata dari allMusicFiles
                userPlaylist = parsedPlaylistIds.map(id => {
                    const foundTrack = allMusicFiles.find(t => t.id === id);
                    if (foundTrack) {
                        return foundTrack; // Menggunakan objek metadata lengkap dari allMusicFiles
                    }
                    console.warn(`Track dengan ID ${id} di playlist tidak ditemukan di allMusicFiles. Akan diabaikan.`);
                    return null;
                }).filter(Boolean); // Hapus entri null
                console.log("User playlist loaded.");
            } catch (e) {
                console.error("Error loading playlist IDs from localStorage:",
                    e);
                userPlaylist = [];
            }
        } else {
            userPlaylist = [];
        }
    }
    const BACKGROUND_VIDEOS = {
        'youtube': 'vid-wonderful.mp4',
        'sky': 'vid-wonderful.mp4',
        'slowed': 'vid-night.mp4',
        'evo': 'vid-night.mp4',
        'vibes': 'vid-dj.mp4',
        'dangdut': 'vid-dj.mp4',
        'lagu': 'vid-slow.mp4',
        'music': 'vid-wonderful.mp4',
        'official': 'vid-wonderful.mp4',
        'dj': 'vid-dj.mp4',
        'hiphop': 'vid-dj.mp4',
        'party': 'vid-dj.mp4',
        'nature': 'vid-wonderful.mp4',
        'fallback': 'vid-wonderful.mp4' // Video default jika tidak ada yang cocok
    };

    function getBackgroundVideoByTitle(title) {
        const lowerCaseTitle = title.toLowerCase();

        for (const keyword in BACKGROUND_VIDEOS) {
            if (keyword === 'fallback') continue; // Lewati fallback di iterasi utama

            if (lowerCaseTitle.includes(keyword)) {
                return BACKGROUND_VIDEOS[keyword]; // Mengembalikan nama file video
            }
        }

        // Jika tidak ada kata kunci yang cocok, kembalikan video fallback
        return BACKGROUND_VIDEOS['fallback'];
    }

    const DEFAULT_THUMBNAILS = {

        'pop': 'music-com.png',
        'rmx': 'music-com.png',
        'remix': 'music-com.png',
        'youtube': 'sky.jpg',
        'sky': 'sky.jpg',
        'clip': 'official.jpg',
        'religi': 'raworange.jpg',
        'clasic': 'music-com.jpg',
        'song': 'pop.png',
        'rap': 'rap.jpeg',
        'relax': 'natural.jpg',
        'slowed': 'slowmo.jpg',
        'instrumen': 'neonJeoa.jpg',
        'evo': 'neonJeoa.jpg',
        'vibe': 'neonJeoa.jpeg',
        'dangdut': 'music-com.png',
        'lagu': 'rawkimura.jpeg',
        'foundations': 'pop.png',
        'denny': 'dc.jpeg',
        'music': 'music-com.png',
        'official': 'official.jpg',
        'jazz': 'jazz.jpeg',
        'dj': 'music-com.png',
        'hiphop': 'rap.jpeg',
        'fallback': 'music-com.png'
    };

    function getDefaultThumbnailByTitle(title) {
        const lowerCaseTitle = title.toLowerCase();

        for (const keyword in DEFAULT_THUMBNAILS) {

            if (keyword === 'fallback') continue;

            if (lowerCaseTitle.includes(keyword)) {
                return DEFAULT_THUMBNAILS[keyword];
            }
        }

        return DEFAULT_THUMBNAILS['fallback'];
    }

    openIndexedDB().then(async (db) => {
        // Pastikan db diterima di sini
        console.log('IndexedDB siap digunakan.');

        await loadAllMediaData(); // Panggil fungsi baru untuk memuat semua jenis media
        renderMusicList(allMusicFiles, musicListUl);
        displayCategory('music');

        renderCustomPlaylists();

        updateLikedSongsCount();

    }).catch(error => {
        console.error('Gagal membuka IndexedDB saat inisialisasi:', error);
        alert('Aplikasi tidak dapat berjalan offline karena masalah database.');
    });

    function openIndexedDB() {
        return new Promise((resolve, reject) => {

            const request = indexedDB.open('MusikOfflineDB', 15); // versi

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log(`[DEBUG] IndexedDB upgrade needed from version ${event.oldVersion} to ${event.newVersion}`);

                if (db.objectStoreNames.contains('musikFiles')) {
                    db.deleteObjectStore('musikFiles');
                    console.log("[DEBUG] Menghapus object store 'musikFiles' lama.");
                }
                const objectStore = db.createObjectStore('musikFiles', {
                    keyPath: 'id'
                });
                //  indeks jika untuk pencarian cepat
                objectStore.createIndex('name', 'name', {
                    unique: false
                });
                objectStore.createIndex('artist', 'artist', {
                    unique: false
                });
                objectStore.createIndex('album', 'album', {
                    unique: false
                });
                objectStore.createIndex('type', 'type', {
                    unique: false
                }); // Indeks untuk 'type' (akan selalu 'audio' sekarang)

                console.log("[DEBUG] Object store 'musikFiles' baru dibuat.");
            };

            request.onsuccess = (event) => {
                const db = event.target.result;
                console.log(`[DEBUG] IndexedDB opened successfully. Version: ${db.version}`);
                resolve(db);
            };

            request.onerror = (event) => {
                console.error("IndexedDB error:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    //  parameter 'type' di akhir
    async function simpanMusikKeDB(id,
        namaFile,
        dataBlob,
        judulLagu,
        artis,
        album,
        thumbnailUrl,
        type) {
        const db = await openIndexedDB();

        const transaction = db.transaction(['musikFiles'],
            'readwrite');
        const objectStore = transaction.objectStore('musikFiles');

        const dataMusik = {
            id: id,
            name: namaFile,
            fileData: dataBlob,
            title: judulLagu,
            artist: artis,
            album: album,
            thumbnailUrl: thumbnailUrl,
            timestamp: new Date(),
            type: type // <--- TAMBAHKAN type KE OBJEK DATA
        };

        return new Promise((resolve, reject) => {
            const request = objectStore.put(dataMusik);
            request.onsuccess = () => {
                console.log(`Media (${type}) berhasil disimpan/diperbarui di IndexedDB:`, judulLagu);
                resolve();
            };
            request.onerror = (event) => {
                console.error(`Gagal menyimpan/memperbarui media (${type}) di IndexedDB:`, event.target.error);
                reject(event.target.error);
            };
        });
    }

    // --- FUNGSI BARU UNTUK MEMUAT SEMUA JENIS MEDIA DARI DB ---
    async function loadAllMediaData() {
        allMusicFiles = [];

        const db = await openIndexedDB();
        const transaction = db.transaction(['musikFiles'],
            'readonly');
        const objectStore = transaction.objectStore('musikFiles');
        const request = objectStore.getAll();

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                const allItems = request.result;
                allItems.forEach(item => {
                    // Pastikan hanya audio yang ditambahkan ke allMusicFiles
                    if (item.type === 'audio') {
                        // Filter hanya audio
                        const metadata = {
                            id: item.id,
                            name: item.name,
                            title: item.title,
                            artist: item.artist,
                            album: item.album,
                            thumbnailUrl: item.thumbnailUrl,
                            duration: 0,
                            type: item.type,
                            fileData: item.fileData // Tetap muat fileData jika diperlukan untuk player
                        };
                        allMusicFiles.push(metadata);
                    } else {
                        console.warn(`[DEBUG] Mengabaikan item non-audio saat memuat: ${item.name} (Tipe: ${item.type})`);
                    }
                });
                console.log(`[DEBUG] Memuat data dari IndexedDB: ${allMusicFiles.length} audio.`);
                // Hapus baris ini: console.log(`[DEBUG] Memuat data dari IndexedDB: ${allMusicFiles.length} audio, ${allVideoFiles.length} video.`);


                // Rekonstruksi userPlaylist (tetap sama)
                const storedPlaylistIds = localStorage.getItem(LS_KEY_PLAYLIST_IDS);
                if (storedPlaylistIds) {
                    try {
                        const parsedPlaylistIds = JSON.parse(storedPlaylistIds);
                        userPlaylist = parsedPlaylistIds.map(id => {
                            const foundTrack = allMusicFiles.find(t => t.id === id);
                            if (foundTrack) {
                                return foundTrack;
                            }
                            console.warn(`Track dengan ID ${id} di playlist tidak ditemukan di allMusicFiles.`);
                            return null;
                        }).filter(Boolean);
                        console.log("User playlist loaded.");
                    } catch (e) {
                        console.error("Error loading playlist IDs from localStorage:",
                            e);
                        userPlaylist = [];
                    }
                } else {
                    userPlaylist = [];
                }

                loadCustomPlaylists(); // Tetap panggil untuk playlist kustom

                resolve();
            };
            request.onerror = (event) => {
                console.error('Gagal mengambil semua media dari IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async function getMusikDariDB(idMusik) {
        const db = await openIndexedDB();
        const transaction = db.transaction(['musikFiles'],
            'readonly');
        const objectStore = transaction.objectStore('musikFiles');

        const request = objectStore.get(idMusik);

        return new Promise((resolve, reject) => {
            request.onsuccess = (event) => {
                const dataMusik = event.target.result;
                if (dataMusik) {
                    console.log('Musik ditemukan:', dataMusik.judul);
                    resolve(dataMusik);
                } else {
                    console.log('Musik dengan ID tersebut tidak ditemukan.');
                    resolve(null);
                }
            };

            request.onerror = (event) => {
                console.error('Gagal mengambil musik:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async function getAllMusikFromDB() {
        const db = await openIndexedDB();
        const transaction = db.transaction(['musikFiles'],
            'readonly');
        const objectStore = transaction.objectStore('musikFiles');
        const request = objectStore.getAll(); // Mengambil semua objek dari object store

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {

                const allMetadata = request.result.map(item => ({
                    id: item.id,
                    name: item.name,
                    title: item.title,
                    artist: item.artist,
                    album: item.album,
                    thumbnailUrl: item.thumbnailUrl,
                    size: item.fileData ? item.fileData.size: 0 // ukuran file disimpan
                }));
                resolve(allMetadata);
            };
            request.onerror = (event) => {
                console.error('Gagal mengambil semua musik dari IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    async function hapusMusikDariDB(idMusik) {
        const db = await openIndexedDB();
        const transaction = db.transaction(['musikFiles'],
            'readwrite');
        const objectStore = transaction.objectStore('musikFiles');
        const request = objectStore.delete(idMusik);

        return new Promise((resolve, reject) => {
            request.onsuccess = () => {
                console.log('Musik berhasil dihapus dari IndexedDB:', idMusik);
                resolve();
            };
            request.onerror = (event) => {
                console.error('Gagal menghapus musik dari IndexedDB:', event.target.error);
                reject(event.target.error);
            };
        });
    }

    // Render UI Functions
    function renderMusicList(list,
        targetUl,
        isPlaylist = false) {
        targetUl.innerHTML = '';

        console.log(`Rendering music list to ${targetUl.id}. List length: ${list.length}`);

        if (list.length === 0) {
            let message = isPlaylist ?
            'Tambahkan lagu ke playlist Anda dari kategori "Musik" atau tombol (+) di pemutar.':
            'Tidak ada lagu. Klik "Scan Folder Musik" untuk menambah.';
            if (targetUl === artistListUl) {
                message = 'Tambahkan lagu untuk melihat daftar artis.';
            } else if (targetUl === customPlaylistsUl) {
                message = 'Belum ada daftar putar kustom. Klik "+" untuk membuat!';
            }
            targetUl.innerHTML = `<li class="empty-message">${message}</li>`;
            updateActiveSongInUI();
            return;
        }

        list.forEach((track, index) => {
            const listItem = document.createElement('li');
            listItem.classList.add('music-item');
            listItem.dataset.fileId = track.id;

            const title = track.title || 'Judul Tidak Diketahui';
            const artist = track.artist || 'Artis Tidak Diketahui';

            let thumbnailUrlToUse = track.thumbnailUrl;

            if (!thumbnailUrlToUse || thumbnailUrlToUse === '') {

                thumbnailUrlToUse = getDefaultThumbnailByTitle(title);
            }


            let actionIconHtml = '';
            let btnClasses = 'icon-button track-action-icon';
            let btnTitle = 'Tambahkan ke Playlist';
            let btnIcon = 'fas fa-plus'; // Default ikon

            if (targetUl === musicListUl) {
                if (activeCustomPlaylistId) {
                    // Mode: Menambahkan ke playlist kustom yang aktif
                    const activePlaylist = customPlaylists.find(p => p.id === activeCustomPlaylistId);
                    const isAlreadyInActiveCustomPlaylist = activePlaylist ? activePlaylist.songs.includes(track.id): false;

                    if (isAlreadyInActiveCustomPlaylist) {
                        btnClasses += ' add-to-custom-playlist-btn added';
                        btnIcon = 'fas fa-check';
                        btnTitle = `Sudah ada di "${activePlaylist.name}"`;
                    } else {
                        btnClasses += ' add-to-custom-playlist-btn';
                        btnIcon = 'fas fa-plus';
                        btnTitle = `Tambahkan ke "${activePlaylist.name}"`;
                    }
                } else {
                    const isAlreadyInDefaultPlaylist = userPlaylist.some(pTrack => pTrack.id === track.id);
                    if (isAlreadyInDefaultPlaylist) {
                        btnClasses += ' add-to-default-playlist-btn active';
                        btnIcon = 'fas fa-check';
                        btnTitle = 'Sudah ada di Antrian';
                    } else {
                        btnClasses += ' add-to-default-playlist-btn';
                        btnIcon = ''; // Ikon list untuk menambah ke antrian
                        btnTitle = 'Tambahkan ke Antrian';
                    }
                }
                actionIconHtml = `<button class="${btnClasses}" data-file-id="${track.id}" title="${btnTitle}"><i class="${btnIcon}"></i></button>`;

            } else if (targetUl === userPlaylistUl) {
                actionIconHtml = `<button class="icon-button track-action-icon remove-from-playlist-btn" data-file-id="${track.id}" title="Hapus dari Antrian"><i class="fas fa-times"></i></button>`;
            }

            listItem.innerHTML = `
            <div class="thumbnail" style="background-image: url('${thumbnailUrlToUse}');"></div>
            <div class="track-info">
            <div class="track-title">${title}</div>
            <div class="track-artist">${artist}</div>
            </div>
            ${actionIconHtml}
            `;

            listItem.addEventListener('click', (e) => {
                if (e.target.closest('.track-action-icon')) {
                    console.log("Action button clicked, preventing item play.");
                    return;
                }

                console.log(`Music item clicked: ${track.title}.`);

                if (targetUl === musicListUl || targetUl === artistListUl || targetUl === albumListUl) {
                    currentPlayingList = list;
                } else if (targetUl === userPlaylistUl) {
                    currentPlayingList = userPlaylist;
                } else {
                    console.warn("Klik lagu dari UL yang tidak dikenali. Menggunakan daftar yang sedang dirender.");
                    currentPlayingList = list;
                }

                const foundIndex = currentPlayingList.findIndex(item => item.id === track.id);
                if (foundIndex !== -1) {
                    loadTrack(foundIndex);
                } else {
                    console.error("Lagu tidak ditemukan dalam daftar putar yang sedang diatur.");
                    alert('Lagu tidak dapat ditemukan dalam daftar saat ini. Silakan scan ulang folder.');
                }
            });

            targetUl.appendChild(listItem);
        });
        updateActiveSongInUI();
    }

    function renderArtistList() {
        artistListUl.innerHTML = '';
        console.log("Rendering artist list.");
        if (allMusicFiles.length === 0) {
            artistListUl.innerHTML = '<li class="empty-message">Tambahkan lagu untuk melihat daftar artis.</li>';
            return;
        }

        const artists = {};
        allMusicFiles.forEach(file => {

            const artistName = file.artist || 'Artis Tidak Diketahui'; // Fallback jika tidak ada artist

            if (!artists[artistName]) {
                // artistName yang sudah diambil
                artists[artistName] = [];
            }
            artists[artistName].push(file);
        });

        const sortedArtists = Object.keys(artists).sort((a, b) => a.localeCompare(b));

        if (sortedArtists.length === 0) {
            artistListUl.innerHTML = '<li class="empty-message">Tidak ada artis ditemukan.</li>';
            return;
        }

        sortedArtists.forEach(artistName => {
            const artistSongs = artists[artistName];

            // default icon yang lebih spesifik untuk artis.
            const artistThumbnailUrl = artistSongs[0]?.thumbnailUrl || '';
            //  diganti dengan path ikon user/artist default
            // ==========================
            const listItem = document.createElement('li');
            listItem.classList.add('music-item', 'artist-item');
            listItem.innerHTML = `
            <div class="thumbnail" style="background-image: url('${artistThumbnailUrl}'); display: none;"></div> <div class="track-info">
            <div class="track-title">${artistName}</div>
            <div class="track-artist">${artistSongs.length} Lagu</div>
            </div>
            <button class="icon-button track-action-icon view-artist-songs-btn" data-artist-name="${artistName}" title="Lihat semua lagu ${artistName}"><li class="title-artis">A&R</li></button>
            `;
            listItem.addEventListener('click', () => {
                console.log(`Artist clicked: ${artistName}.`);
                displayCategory('music');
                musicCategory.querySelector('.page-description').textContent = `Lagu dari ${artistName}`;
                // ======================
                // UBAH: Filter berdasarkan f.artist langsung, bukan parseTrackInfo(f.name)
                const filteredSongs = allMusicFiles.filter(f => f.artist === artistName);
                // ======================
                renderMusicList(filteredSongs, musicListUl);
                currentPlayingList = filteredSongs;
                updateActiveSongInUI();
            });
            artistListUl.appendChild(listItem);
        });
        updateActiveSongInUI();
    }

    function buildAlbumList() {
        albumList = {}; // Reset daftar album setiap kali dibangun ulang
        allMusicFiles.forEach(fileData => {
            const albumName = fileData.album || "Album Unknown"; // Fallback jika tidak ada info album

            if (!albumList[albumName]) {
                albumList[albumName] = [];
            }
            albumList[albumName].push(fileData);
        });
        console.log("Album List Built:",
            albumList);
    }
    function renderAlbumList() {
    albumListUl.innerHTML = '';

    if (Object.keys(albumList).length === 0) {
        albumListUl.innerHTML = '<li class="no-items">No Albums Found.</li>';
        return;
    }

    const albumNames = Object.keys(albumList).sort((a, b) => a.localeCompare(b));

    albumNames.forEach(albumName => {
        const albumSongs = albumList[albumName];
        const albumThumbnailUrl = albumSongs[0]?.thumbnailUrl || '';
        const albumItem = document.createElement('li');
        albumItem.className = 'album-categorized-item';
        albumItem.dataset.albumName = albumName;

        // --- PERHATIKAN PERUBAHAN DI SINI: TOMBOL PLAY DIHAPUS ---
        albumItem.innerHTML = `
            <div class="album-item-thumbnail" style="background-image: url('${albumThumbnailUrl}');"><svg class="icon-album-fallback" viewBox="0 0 511.999 511.999"></svg>

                <div class="album-item-overlay">
                    <div class="album-item-info">
                        <div class="album-item-title">${albumName}</div>
                        <div class="album-item-count">${albumSongs.length} lagu</div>
                    </div>
                    </div>
            </div>
        `;
        albumListUl.appendChild(albumItem);

        // Logika Fallback Gambar (TETAP SAMA)
        const thumbnailDiv = albumItem.querySelector('.album-item-thumbnail');
        if (albumThumbnailUrl) {
            const img = new Image();
            img.src = albumThumbnailUrl;
            img.onload = () => {
                // Gambar berhasil dimuat, tidak perlu lakukan apa-apa
                thumbnailDiv.style.backgroundImage = `url('${albumThumbnailUrl}')`; // Pastikan background-image diset
            };
            img.onerror = () => {
                // Gambar gagal dimuat, tambahkan kelas untuk menampilkan ikon fallback
                thumbnailDiv.classList.add('no-thumbnail');
                thumbnailDiv.style.backgroundImage = 'none'; // Pastikan gambar tidak tampil
            };
        } else {
            // Tidak ada URL thumbnail, langsung tambahkan kelas untuk menampilkan ikon fallback
            thumbnailDiv.classList.add('no-thumbnail');
            thumbnailDiv.style.backgroundImage = 'none';
        }

        albumItem.addEventListener('click', (e) => {

            if (e.target.closest('.play-all-btn')) {
                return; // Jangan lakukan apa-apa jika tombol play yang diklik
            }
            const clickedAlbumName = e.currentTarget.dataset.albumName;
            displaySongsInAlbum(clickedAlbumName);
        });
        albumItem.addEventListener('click', (e) => {
            const clickedAlbumName = e.currentTarget.dataset.albumName;
            displaySongsInAlbum(clickedAlbumName);
        });
    });
}

function displaySongsInAlbum(albumName) {
        if (albumList[albumName]) {
            const songsInAlbum = albumList[albumName];

            displayCategory('music', songsInAlbum, `Album by : ${albumName} (${songsInAlbum.length} Lagu)`);

        }
    }

    // Menambahkan  ke playlist kustom yang aktif
    // ============================================
    function addSongToActiveCustomPlaylist(fileId) {
        if (!activeCustomPlaylistId) {
            console.error("Tidak ada playlist kustom aktif yang dipilih. Ini seharusnya tidak terjadi jika tombolnya terlihat.");
            alert("Pilih daftar putar kustom terlebih dahulu di kategori Playlist.");
            return;
        }

        const playlistToUpdate = customPlaylists.find(p => p.id === activeCustomPlaylistId);

        if (playlistToUpdate) {
            const song = allMusicFiles.find(f => f.id === fileId);
            if (!song) {
                console.error("Lagu dengan ID", fileId, "tidak ditemukan di allMusicFiles.");
                alert("Lagu tidak ditemukan. Mungkin Anda perlu scan ulang folder musik.");
                return;
            }

            if (!playlistToUpdate.songs.includes(fileId)) {
                playlistToUpdate.songs.push(fileId);
                saveCustomPlaylists();
                alert(`"${song.title}" ditambahkan ke "${playlistToUpdate.name}"!`);

                renderCustomPlaylists();

                if (currentCategory === 'music' && activeCustomPlaylistId === playlistToUpdate.id) {
                    const songsInSelectedPlaylist = allMusicFiles.filter(musicFile =>
                        playlistToUpdate.songs.includes(musicFile.id)
                    );
                    musicCategory.querySelector('.page-description').textContent = `Daftar Putar: ${playlistToUpdate.name} (${songsInSelectedPlaylist.length} Lagu)`;
                    renderMusicList(songsInSelectedPlaylist, musicListUl);

                }

            } else {
                alert(`"${song.title}" sudah ada di "${playlistToUpdate.name}".`);
            }
        } else {
            console.error("Playlist kustom aktif tidak ditemukan dengan ID:", activeCustomPlaylistId);
            alert("Playlist kustom aktif tidak ditemukan. Silakan pilih ulang.");
        }
    }

    //  Menambahkan lagu ke playlist default>
    // ==========================================
    function addSongToDefaultPlaylist(fileId) {
        const trackToAdd = allMusicFiles.find(track => track.id === fileId);
        if (trackToAdd) {
            if (!userPlaylist.some(t => t.id === fileId)) {
                userPlaylist.push(trackToAdd);

                if (currentCategory === 'playlist') {
                    renderMusicList(userPlaylist, userPlaylistUl, true); // render ulang dan memperbarui jumlah
                }
                saveMusicData(); // menyimpan userPlaylist jika itu bagian dari data musik
                alert(`"${parseTrackInfo(trackToAdd.name).title}" ditambahkan ke Antrian.`);
                console.log(`Added "${trackToAdd.name}" to default playlist.`);
            } else {
                alert(`"${parseTrackInfo(trackToAdd.name).title}" sudah ada di Antrian.`);
                console.log(`"${trackToAdd.name}" already in default playlist.`);
            }
        } else {
            console.error("Lagu tidak ditemukan di allMusicFiles:", fileId);
            alert("Lagu tidak ditemukan.");
        }
    }

    // Fungsi Penyimpanan & Pemuatan Data Playlist
    // ===========================================
    function generateUniqueId() {
        return 'playlist-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    }

    function saveCustomPlaylists() {
        try {
            localStorage.setItem('customPlaylists', JSON.stringify(customPlaylists));
            console.log('Custom playlists saved successfully.');
        } catch (e) {
            console.error('Error saving custom playlists to localStorage:', e);
        }
    }

    function loadCustomPlaylists() {
        try {
            const storedPlaylists = localStorage.getItem('customPlaylists');
            if (storedPlaylists) {
                customPlaylists = JSON.parse(storedPlaylists);
                console.log('Custom playlists loaded:', customPlaylists);
            } else {
                customPlaylists = [];
                console.log('No custom playlists found in localStorage.');
            }
        } catch (e) {
            console.error('Error loading custom playlists from localStorage:', e);
            customPlaylists = []; // Reset if parsing fails
        }
    }

    // Fungsi Render UI untuk Playlist Kustom
    // ============================================
    function renderCustomPlaylists() {
        const customPlaylistsUl = document.getElementById('customPlaylistsUl'); // Pastikan ini diakses dengan benar
        customPlaylistsUl.innerHTML = ''; // Bersihkan daftar yang ada
        console.log("Rendering custom playlists. Count:", customPlaylists.length);

        if (customPlaylists.length === 0) {
            customPlaylistsUl.innerHTML = '<li class="empty-message">Belum ada daftar putar kustom. Klik "+" untuk membuat!</li>';
            return;
        }

        customPlaylists.forEach(playlist => {

            const listItem = document.createElement('li');
            listItem.classList.add('music-item', 'playlist-item');
            listItem.dataset.playlistId = playlist.id;

            let thumbnailContent; // let atau const untuk deklarasi lokal

            if (playlist.thumbnailUrl) {
                thumbnailContent = `<div class="playlist-thumbnail" style="background-image: url('${playlist.thumbnailUrl}');"></div>`;
            } else {
                thumbnailContent = `<div class="playlist-thumbnail default-icon"><i class="fas fa-music"></i></div>`;
            }

            const validSongsCount = playlist.songs.filter(songId =>
                allMusicFiles.some(f => f.id === songId)
            ).length;

            listItem.innerHTML = `
            <div class="playlist-thumbnail-wrapper">
            ${thumbnailContent}
            <button class="add-playlist-image-btn" data-playlist-id="${playlist.id}" title="Tambahkan gambar playlist">
            <i class="fa-solid fa-wand-magic-sparkles"></i>
            </button>
            </div>
            <div class="track-info">
            <div class="track-title">${playlist.name}</div>
            <div class="track-artist">${validSongsCount} Lagu</div>
            </div>
            <button class="icon-button delete-playlist-btn" data-playlist-id="${playlist.id}" title="Hapus Playlist">
            <i class="fas fa-times"></i>
            </button>
            `;

            // Event listener untuk mengklik item playlist (selain tombol)
            listItem.addEventListener('click', (e) => {
                if (e.target.closest('.add-playlist-image-btn') || e.target.closest('.delete-playlist-btn')) {
                    e.stopPropagation();
                    return;
                }

                console.log(`Playlist "${playlist.name}" clicked. Displaying its songs.`);
                activeCustomPlaylistId = playlist.id;

                const songsInSelectedPlaylist = allMusicFiles.filter(musicFile =>
                    playlist.songs.includes(musicFile.id)
                );

                displayCategory('music'); // Beralih ke kategori musik
                musicCategory.querySelector('.page-description').textContent = `Daftar Putar: ${playlist.name} (${songsInSelectedPlaylist.length} Lagu)`;
                renderMusicList(songsInSelectedPlaylist, musicListUl);
                currentPlayingList = songsInSelectedPlaylist;
            });

            // Event listener untuk tombol "Hapus Playlist"
            listItem.querySelector('.delete-playlist-btn').addEventListener('click',
                (e) => {
                    const idToDelete = e.currentTarget.dataset.playlistId;
                    deleteCustomPlaylist(idToDelete);
                });

            // Event listener untuk tombol "Tambahkan Gambar Playlist"
            listItem.querySelector('.add-playlist-image-btn').addEventListener('click',
                (e) => {
                    const idToUpdate = e.currentTarget.dataset.playlistId;
                    triggerPlaylistImageUpload(idToUpdate);
                });

            customPlaylistsUl.appendChild(listItem); // Menambahkan item baru ke UL
        });
    }

    // Fungsi Aksi Playlist
    // ============================================
    function createNewPlaylist() {
        const playlistName = newPlaylistNameInput.value.trim();
        if (playlistName) {
            // Cek apakah nama playlist sudah ada
            const existingPlaylist = customPlaylists.find(p => p.name.toLowerCase() === playlistName.toLowerCase());
            if (existingPlaylist) {
                alert('Daftar putar dengan nama ini sudah ada!');
                return;
            }

            const newPlaylist = {
                id: generateUniqueId(),
                // ID unik
                name: playlistName,
                songs: [],
                // Awalnya kosong
                thumbnailUrl: '' // Thumbnail awal kosong
            };
            customPlaylists.push(newPlaylist);
            saveCustomPlaylists();
            renderCustomPlaylists(); // Render ulang daftar playlist
            newPlaylistNameInput.value = ''; // Kosongkan input
            toggleNewPlaylistInput(false); // Sembunyikan input
            alert(`Daftar putar "${playlistName}" berhasil dibuat!`);
        } else {
            alert('Nama daftar putar tidak boleh kosong!');
        }
    }

    function deleteCustomPlaylist(playlistId) {

        customConfirmOverlay.style.display = 'block'; // Tampilkan dialog kustom

        confirmDeleteBtn.onclick = function() {
            customPlaylists = customPlaylists.filter(p => p.id !== playlistId);
            saveCustomPlaylists();
            renderCustomPlaylists();

            if (activeCustomPlaylistId === playlistId) {
                activeCustomPlaylistId = null;
                // Opsional: reset deskripsi halaman musik
                if (musicCategory) {
                    musicCategory.querySelector('.page-description').textContent = 'Semua lagu yang tersedia';
                }
            }
            //     alert('Daftar putar berhasil dihapus.');
            customConfirmOverlay.style.display = 'none'; // Sembunyikan dialog
        };

        cancelDeleteBtn.onclick = function() {
            customConfirmOverlay.style.display = 'none'; // Sembunyikan dialog
        };
    }

    playlistImageInput.type = 'file';
    playlistImageInput.accept = 'image/*'; // Hanya menerima file gambar
    playlistImageInput.style.display = 'none'; // Sembunyikan input file
    document.body.appendChild(playlistImageInput); // Tambahkan ke body
    function triggerPlaylistImageUpload(playlistId) {
        currentPlaylistForImageUpload = playlistId;
        playlistImageInput.click(); // Memicu dialog pemilihan file
    }

    playlistImageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        //  menyimpan ID playlist di dataset input:
        const targetPlaylistId = playlistImageInput.dataset.targetPlaylistId;

        if (file && targetPlaylistId) {
            //  TargetPlaylistId
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                console.log("[DEBUG] Base64 Image Generated (first 50 chars):", base64Image.substring(0, 50) + '...');
                console.log("[DEBUG] Full Base64 Image Data URI length:", base64Image.length);

                if (base64Image.startsWith('data:image/')) {
                    console.log("[DEBUG] Base64 URI appears valid.");
                    const playlist = customPlaylists.find(p => p.id === targetPlaylistId); // <-- Gunakan targetPlaylistId
                    if (playlist) {
                        playlist.thumbnailUrl = base64Image;
                        saveCustomPlaylists();
                        renderCustomPlaylists();
                        alert('Gambar playlist berhasil diunggah!');
                    } else {
                        console.error("[ERROR] Playlist for image upload not found (inside reader.onload):", targetPlaylistId);
                    }
                } else {
                    console.error("[ERROR] Generated string is not a valid Data URI:", base64Image);
                }
            };
            reader.onerror = (error) => {
                console.error("Error reading file:", error);
                alert("Gagal membaca file gambar.");
            };
            reader.readAsDataURL(file);
        } else {
            console.warn("[DEBUG] No file selected or targetPlaylistId is null. File:", file, "ID:", targetPlaylistId);
        }
        //  Reset targetPlaylistId di dataset input, bukan currentPlaylistForImageUpload
        playlistImageInput.dataset.targetPlaylistId = ''; // Reset setelah proses selesai
        e.target.value = ''; // Bersihkan input file
    });

    //  upload,  set dataset input :
    function triggerPlaylistImageUpload(playlistId) {
        playlistImageInput.dataset.targetPlaylistId = playlistId; // <-- Set ID di sini!
        playlistImageInput.click();
    }

    // Event listener untuk tombol "Buat daftar putar baru.."
    createPlaylistButton.addEventListener('click',
        () => {
            toggleNewPlaylistInput(true);
        });

    // Event listener untuk tombol "Save"
    saveNewPlaylistButton.addEventListener('click',
        createNewPlaylist);

    // Event listener untuk tombol "Cancel"
    cancelNewPlaylistButton.addEventListener('click',
        () => {
            toggleNewPlaylistInput(false);
            newPlaylistNameInput.value = ''; // Kosongkan input saat dibatalkan
        });

    // Fungsi pembantu untuk mengelola tampilan input playlist baru
    function toggleNewPlaylistInput(show) {
        if (show) {
            createPlaylistButton.classList.add('hidden');
            newPlaylistInputArea.classList.remove('hidden');
            newPlaylistNameInput.focus(); // Fokus ke input
        } else {
            createPlaylistButton.classList.remove('hidden');
            newPlaylistInputArea.classList.add('hidden');
        }
    }

    // Fungsi toggleNewPlaylistInput harus ada dan dapat diakses
    function toggleNewPlaylistInput(show) {
        if (show) {
            createPlaylistButton.classList.add('hidden');
            newPlaylistInputArea.classList.remove('hidden');
            newPlaylistNameInput.focus();
        } else {
            createPlaylistButton.classList.remove('hidden');
            newPlaylistInputArea.classList.add('hidden');
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        loadCustomPlaylists();
        renderCustomPlaylists();

        // Event listeners untuk UI "Buat Playlist Baru"
        if (createPlaylistButton) {
            // Cek elemen untuk menghindari error
            createPlaylistButton.addEventListener('click', () => {
                toggleNewPlaylistInput(true);
            });
        }
        if (saveNewPlaylistButton) {
            saveNewPlaylistButton.addEventListener('click', createNewPlaylist);
        }
        if (cancelNewPlaylistButton) {
            cancelNewPlaylistButton.addEventListener('click', () => {
                toggleNewPlaylistInput(false);
                newPlaylistNameInput.value = '';
            });
        }

        if (musicCategoryBtn) {
            console.log("Simulating click on Music category button for initialization.");

            displayCategory('music');
        } else {
            console.warn("Music category button not found. Initializing music list directly.");
            renderMusicList(allMusicFiles, musicListUl);
            currentPlayingList = allMusicFiles;
            updateActiveSongInUI();
        }
    });
    async function processFile(file) {
        const id = generateFileId(file);
        const fileExtension = file.name.split('.').pop().toLowerCase();
        let title = file.name.split('.').slice(0,
            -1).join('.');
        let artist = "Artis Tidak Diketahui";
        let album = "Album Tidak Diketahui";
        let thumbnailUrl = ''; // Default kosong untuk audio jika tidak ada gambar embedded
        let type = 'audio'; // Set default ke audio

        if (supportedAudioExtensions.includes(fileExtension)) {
            // Logika jsmediatags untuk audio (tidak berubah)
            try {
                const tag = await new Promise((resolve, reject) => {
                    jsmediatags.read(file, {
                        onSuccess: resolve, onError: reject
                    });
                });
                title = tag.tags.title || title;
                artist = tag.tags.artist || artist;
                album = tag.tags.album || album;
                if (tag.tags.picture) {
                    const base64String = btoa(
                        tag.tags.picture.data.map(char => String.fromCharCode(char)).join('')
                    );
                    thumbnailUrl = `data:${tag.tags.picture.format};base64,${base64String}`;
                }
            } catch (error) {
                console.warn(`Gagal membaca tag untuk file audio ${file.name}:`, error.type, error.info);
                // Default thumbnail jika gagal membaca tag
                thumbnailUrl = getDefaultThumbnailByTitle(title || file.name) || 'logo.png';
            }
        } else {
            // Abaikan semua file non-audio
            console.warn(`[DEBUG] File "${file.name}" dengan ekstensi ${fileExtension} bukan audio yang didukung dan akan diabaikan.`);
            return null; // Penting: kembalikan null agar file ini tidak disimpan
        }

        try {
            // Simpan fileData (Blob) dan metadata ke IndexedDB, sekarang hanya untuk audio
            await simpanMusikKeDB(id, file.name, file, title, artist, album, thumbnailUrl, type);
            console.log(`[DEBUG] File "${file.name}" (${type}) berhasil disimpan ke IndexedDB.`);
            return {
                id: id,
                name: file.name,
                title: title,
                artist: artist,
                album: album,
                thumbnailUrl: thumbnailUrl,
                duration: 0,
                type: type,

            };
        } catch (e) {
            console.error(`Gagal menyimpan file ${file.name} ke IndexedDB:`, e);
            return null;
        }
    }

    if (addMusicFolderBtn && musicFolderInput) {
        addMusicFolderBtn.addEventListener('click', () => {
            console.log("Add Music Folder button clicked.");
            musicFolderInput.click();
        });

        musicFolderInput.addEventListener('change', async (event) => {
            const files = event.target.files;
            if (files.length === 0) {
                event.target.value = ''; // Reset input agar bisa memilih folder yang sama lagi
                return;
            }

            const filesToProcessPromises = [];
            for (const file of files) {
                // Mendorong setiap file ke processFile, yang sekarang hanya menangani AUDIO
                filesToProcessPromises.push(processFile(file));
            }

            try {

                const processedAudioFiles = (await Promise.all(filesToProcessPromises)).filter(Boolean);

                if (processedAudioFiles.length === 0) {
                    showCustomNotification('Tidak ada file audio yang didukung ditemukan di folder yang dipilih.');
                    event.target.value = '';
                    return;
                }

                const existingAudioIds = new Set(allMusicFiles.map(f => f.id));
                const uniqueNewAudio = processedAudioFiles.filter(newFile => !existingAudioIds.has(newFile.id));
                allMusicFiles.push(...uniqueNewAudio);

                console.log(`Berhasil memproses: ${uniqueNewAudio.length} audio baru.`);

                renderMusicList(allMusicFiles, musicListUl); // Untuk Music Category (audio)
                // Perbarui daftar artis dan album
                renderArtistList();

                buildAlbumList();

                renderAlbumList();

                let notificationMessage = '';
                if (uniqueNewAudio.length > 0) {
                    notificationMessage = `Berhasil menambahkan ${uniqueNewAudio.length} file audio baru!`;
                } else {
                    notificationMessage = 'Tidak ada file audio baru yang ditambahkan (mungkin sudah ada).';
                }
                showCustomNotification(notificationMessage);

            } catch (error) {
                console.error("Terjadi kesalahan saat memproses file:", error);
                showCustomNotification("Terjadi kesalahan saat memproses file audio. Silakan coba lagi.");
            } finally {
                event.target.value = ''; // Selalu reset input
            }
        });
    }


    function showCustomNotification(message,
        duration = 1500) {
        const notificationDiv = document.getElementById('customNotification');
        const notificationMsgSpan = document.getElementById('notificationMessage');

        if (!notificationDiv || !notificationMsgSpan) {
            console.error("Elemen notifikasi kustom tidak ditemukan di DOM.");

            alert(message);
            return;
        }

        notificationMsgSpan.textContent = message;
        notificationDiv.classList.add('show');

        setTimeout(() => {
            notificationDiv.classList.remove('show');
        }, duration);
    }


    function showTrackInfoPopup() {
        if (trackInfoPopup) {
            trackInfoPopup.classList.add('active');

            populateTrackInfoPopup(); // Panggil fungsi untuk mengisi data
        }
    }

    // Fungsi untuk menyembunyikan popup informasi lagu
    function hideTrackInfoPopup() {
        if (trackInfoPopup) {
            trackInfoPopup.classList.remove('active');
        }
    }

    // Fungsi untuk mengisi detail lagu ke dalam popup
    function populateTrackInfoPopup() {
        const currentTrack = currentPlayingList[currentTrackIndex];

        if (currentTrack) {
            const title = currentTrack.title || 'Tidak Diketahui';
            const artist = currentTrack.artist || 'Tidak Diketahui';
            const album = currentTrack.album || 'Tidak Diketahui';

            // Memformat durasi
            const duration = audioPlayer.duration;
            const formattedDuration = isNaN(duration) ? '0:00': formatTime(duration); // fungsi formatTime

            // Ukuran file
            let fileSizeText = 'N/A';
            if (currentTrack.size) {
                // currentTrack.size
                const fileSizeKB = currentTrack.size / 1024;
                if (fileSizeKB < 1024) {
                    fileSizeText = `${fileSizeKB.toFixed(2)} KB`;
                } else {
                    fileSizeText = `${(fileSizeKB / 1024).toFixed(2)} MB`;
                }
            }

            const filePath = 'Tidak Tersedia (Offline)';

            // Isi elemen-elemen di popup
            if (popupTrackTitle) popupTrackTitle.textContent = title;
            if (popupTrackArtist) popupTrackArtist.textContent = artist;
            if (popupTrackAlbum) popupTrackAlbum.textContent = album;
            if (popupTrackDuration) popupTrackDuration.textContent = formattedDuration;
            if (popupFileSize) popupFileSize.textContent = fileSizeText;
            if (popupFilePath) {

                popupFilePath.textContent = 'Tidak Tersedia (Privasi Browser)';
                //     popupFilePath.textContent = filePath;

            }

        } else {
            // Reset popup jika tidak ada lagu yang diputar
            if (popupTrackTitle) popupTrackTitle.textContent = 'Tidak Ada Lagu';
            if (popupTrackArtist) popupTrackArtist.textContent = 'Tidak Ada Lagu';
            if (popupTrackAlbum) popupTrackAlbum.textContent = 'Tidak Ada Lagu';
            if (popupTrackDuration) popupTrackDuration.textContent = '0:00';
            if (popupFileSize) popupFileSize.textContent = '0 MB';
            if (popupFilePath) popupFilePath.textContent = 'N/A';
        }
    }

    function showToast(message, duration = 3000) {
        // Durasi default 3 detik
        if (toastNotification && toastMessage) {
            toastMessage.textContent = message; // Atur teks pesan
            toastNotification.classList.add('show'); // Tambahkan kelas 'show' untuk menampilkan
            setTimeout(() => {
                toastNotification.classList.remove('show');
            }, duration);
        } else {
            console.warn("Toast notification elements not found.");
        }
    }

    function addCurrentTrackToPlaylist() {
        if (currentTrackIndex !== -1 && currentPlayingList[currentTrackIndex]) {
            const currentTrack = currentPlayingList[currentTrackIndex];
            addTrackToLikedSongs(currentTrack);

        } else {
            console.log("Tidak ada lagu yang sedang diputar untuk ditambahkan ke playlist.");
        }
    }

    function addTrackToLikedSongs(track) {
        const exists = likedSongs.some(t => t.name === track.name);
        if (!exists) {
            likedSongs.push(track);
            saveLikedSongs();
            console.log(`"${track.name}" ditambahkan ke Lagu Favorit.`);

            showToast(`"${track.title || track.name}" berhasil ditambahkan!`, 2500); // Pesan sukses

        } else {
            console.log(`"${track.name}" sudah ada di Lagu Favorit.`);

            showToast(`"${track.title || track.name}" sudah ada di Favorit.`, 2500); // Pesan info
        }
    }

    function saveLikedSongs() {
        localStorage.setItem('likedSongs', JSON.stringify(likedSongs));
        updateLikedSongsCount(); // Perbarui jumlah lagu saat disimpan
    }

    function removeTrackFromLikedSongs(trackName) {
        const initialLength = likedSongs.length;
        likedSongs = likedSongs.filter(track => track.name !== trackName);
        if (likedSongs.length < initialLength) {
            saveLikedSongs();
            console.log(`"${trackName}" dihapus dari Lagu Favorit.`);
            // Perbarui ikon 'like' di thumbnail
        } else {
            console.log(`"${trackName}" tidak ditemukan di Lagu Favorit.`);
        }
    }

    function isTrackLiked(trackName) {
        return likedSongs.some(track => track.name === trackName);
    }

    function updateLikedSongsCount() {
        if (likedSongsCountSpan) {
            likedSongsCountSpan.textContent = `(${likedSongs.length})`;
        }
    }

    function renderLikedSongs() {
        if (!likedSongsUl) return;

        likedSongsUl.innerHTML = ''; // Kosongkan daftar sebelumnya

        if (likedSongs.length === 0) {
            likedSongsUl.innerHTML = '<li class="empty-message">Tidak ada lagu favorit.</li>';
        } else {
            likedSongs.forEach((track, index) => {
                // Tambahkan index untuk play-ability
                const li = document.createElement('li');
                li.classList.add('track-item');
                li.dataset.trackName = track.name;
                li.dataset.trackIndex = index;

                const {
                    title, artist
                } = parseTrackInfo(track.name);

                li.innerHTML = `
                <div class="track-info">
                <div class="track-title">${title}</div>
                <div class="track-artist">${artist}</div>
                </div>
                <button class="icon-button remove-from-liked-btn" data-track-name="${track.name}">
                <i class="fas fa-thumbs-up"></i>
                </button>
                `;
                likedSongsUl.appendChild(li);
            });
        }
    }

    function updateCategoryContent(category) {
        if (category === 'music') {
            musicCategory.querySelector('.page-description').textContent = '';
            renderMusicList(allMusicFiles, musicListUl);
            currentPlayingList = allMusicFiles;
        } else if (category === 'artist') {
            artistCategory.querySelector('.page-description').textContent = '';
            renderArtistList();
            currentPlayingList = [];
        } else if (category === 'album') {
            albumCategory.querySelector('.page-description').textContent = 'song by album';
            renderAlbumList();
            currentPlayingList = [];
        } else if (category === 'playlist') {
            playlistCategory.querySelector('.page-description').textContent = '';
            const validPlaylist = userPlaylist.filter(track => allMusicFiles.some(f => f.id === track.id && f.file instanceof File));
            userPlaylist = validPlaylist;
            renderMusicList(userPlaylist, userPlaylistUl, true);
            currentPlayingList = userPlaylist;
        }
        updateActiveSongInUI();
    }

    function updateActiveSongInUI() {
        console.log("Updating active song in UI. Current track:", currentTrackIndex, "of", currentPlayingList.length);

        document.querySelectorAll('.content-list li.music-item').forEach(item => item.classList.remove('active-song'));


        if (currentTrackIndex !== -1 && currentPlayingList.length > 0) {
            const currentTrack = currentPlayingList[currentTrackIndex];

            if (!currentTrack || !currentTrack.id) {
                console.warn("Objek lagu saat ini tidak valid atau ID-nya hilang saat update UI.");
                return;
            }

            const activeCategoryElement = document.getElementById(currentCategory + 'Category');

            let activeItem = null;
            if (activeCategoryElement) {
                activeItem = activeCategoryElement.querySelector(`[data-file-id="${currentTrack.id}"]`);
            } else {

                activeItem = document.querySelector(`[data-file-id="${currentTrack.id}"]`);
            }
            if (activeItem) {
                activeItem.classList.add('active-song');

                activeItem.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
                console.log("Active song highlight applied to:", currentTrack.name);
            } else {
                console.warn(`Could not find DOM element for active song ID: ${currentTrack.id} in current category (${currentCategory}). List might not be fully rendered yet or ID mismatch.`);

            }
        }
    }

    async function loadMusicData() {
        console.log("Loading music data from IndexedDB and localStorage (for playlists)...");

        try {
            // Ambil semua metadata lagu dari IndexedDB
            allMusicFiles = await getAllMusikFromDB();
            console.log("Music metadata loaded from IndexedDB. Total files:", allMusicFiles.length);

        } catch (e) {
            console.error("Error loading music metadata from IndexedDB:", e);
            allMusicFiles = []; // Reset jika ada masalah
        }

        const storedPlaylistIds = localStorage.getItem(LS_KEY_PLAYLIST_IDS);
        if (storedPlaylistIds) {
            try {
                const parsedPlaylistIds = JSON.parse(storedPlaylistIds);
                // Rekonstruksi userPlaylist menggunakan ID dan mencari metadata dari allMusicFiles
                userPlaylist = parsedPlaylistIds.map(id => {
                    const foundTrack = allMusicFiles.find(t => t.id === id);
                    if (foundTrack) {
                        return foundTrack;
                    }
                    console.warn(`Track dengan ID ${id} di playlist tidak ditemukan di allMusicFiles (setelah load dari IndexedDB). Akan diabaikan.`);
                    return null;
                }).filter(Boolean); // Hapus entri null
                console.log("User playlist loaded.");
            } catch (e) {
                console.error("Error loading playlist IDs from localStorage:",
                    e);
                userPlaylist = [];
            }
        } else {
            userPlaylist = [];
        }

        loadCustomPlaylists();
    }

    async function loadTrack(index) {
        console.log(`Attempting to load track index: ${index} from list of length: ${currentPlayingList.length}`);
        if (index < 0 || index >= currentPlayingList.length) {
            console.warn("Invalid track index. Resetting player UI.");
            currentTrackIndex = -1;

            if (activeTrackTitleAnimation) {
                activeTrackTitleAnimation.textContent = 'No song are playing';
                activeTrackTitleAnimation.classList.remove('marquee-active');
            }
            playerControlContainer.classList.remove('thumbnail-active-background');

            thumbnailContainer.classList.remove('active');

            if (currentThumbnailArt) {
                currentThumbnailArt.src = DEFAULT_THUMBNAILS['fallback'] || '';
                currentThumbnailArt.style.display = 'block';
                thumbnailIconPlaceholder.style.display = 'none';
                currentThumbnailArt.alt = 'Album Art Default';
            }
            if (activeTrackTitleAnimationThumbnail) {
                activeTrackTitleAnimationThumbnail.textContent = 'No song are playing';
                activeTrackTitleAnimationThumbnail.classList.remove('marquee-active');
            }
            resetPlayerUI();
            return;
        }
        currentTrackIndex = index;
        const trackMetadata = currentPlayingList[currentTrackIndex];
        console.log("Loading track metadata:", trackMetadata ? trackMetadata.name: "undefined track object");

        if (!trackMetadata || !trackMetadata.id) {
            console.error("Track metadata is invalid or ID is missing. Cannot load track.");
            audioPlayer.src = '';
            resetPlayerUI();
            return;
        }

        // Simpan metadata lagu yang sedang dimuat
        currentTrackMetadata = trackMetadata;

        //  Implementasi Media Session API (TIDAK ADA PERUBAHAN DI SINI)
        if ('mediaSession' in navigator) {
            // Atur metadata sesi media
            navigator.mediaSession.metadata = new MediaMetadata({
                title: currentTrackMetadata.title || currentTrackMetadata.name, //  fallback ke name
                artist: currentTrackMetadata.artist || 'Unknown Artist',
                album: currentTrackMetadata.album || 'Unknown Album',
                artwork: [{
                    src: currentTrackMetadata.thumbnailUrl || 'headphone-com.png', sizes: '96x96', type: 'image/png'
                },
                    {
                        src: currentTrackMetadata.thumbnailUrl || 'headphone-com.png', sizes: '128x128', type: 'image/png'
                    },
                    {
                        src: currentTrackMetadata.thumbnailUrl || 'headphone-com.png', sizes: '192x192', type: 'image/png'
                    },
                    {
                        src: currentTrackMetadata.thumbnailUrl || 'headphone-com.png', sizes: '256x256', type: 'image/png'
                    },
                    {
                        src: currentTrackMetadata.thumbnailUrl || 'headphone-com.png', sizes: '384x384', type: 'image/png'
                    },
                    {
                        src: currentTrackMetadata.thumbnailUrl || 'headphone-com.png', sizes: '512x512', type: 'image/png'
                    },
                ]
            });

            navigator.mediaSession.setActionHandler('play', () => {
                console.log('[Media Session] Action: play');
                audioPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtnMini.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
            });

            navigator.mediaSession.setActionHandler('pause', () => {
                console.log('[Media Session] Action: pause');
                audioPlayer.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                playPauseBtnMini.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = false;
            });

            navigator.mediaSession.setActionHandler('previoustrack', () => {
                console.log('[Media Session] Action: previoustrack');
                playPrevTrack();
            });

            navigator.mediaSession.setActionHandler('nexttrack', () => {
                console.log('[Media Session] Action: nexttrack');
                playNextTrack();
            });

            navigator.mediaSession.setActionHandler('seekbackward', (event) => {
                console.log('[Media Session] Action: seekbackward', event.seekOffset);
                audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime + (event.seekOffset || -10));
            });

            navigator.mediaSession.setActionHandler('seekforward', (event) => {
                console.log('[Media Session] Action: seekforward', event.seekOffset);
                audioPlayer.currentTime = Math.min(audioPlayer.duration, audioPlayer.currentTime + (event.seekOffset || 10));
            });

            navigator.mediaSession.setActionHandler('seekto', (event) => {
                console.log('[Media Session] Action: seekto', event.seekTime);
                if (event.fastSeek && 'fastSeek' in audioPlayer) {
                    audioPlayer.fastSeek(event.seekTime);
                } else {
                    audioPlayer.currentTime = event.seekTime;
                }
            });

            navigator.mediaSession.setActionHandler('stop',
                () => {
                    console.log('[Media Session] Action: stop');
                    audioPlayer.pause();
                    audioPlayer.currentTime = 0;
                    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
                    playPauseBtnMini.innerHTML = '<i class="fas fa-play"></i>';
                    isPlaying = false;
                });

            console.log('[Media Session] Metadata dan Action Handler telah diatur.');
        } else {
            console.warn('Media Session API tidak didukung di browser ini.');
        }

        if ('setAppBadge' in navigator) {
            navigator.setAppBadge(1)
            .then(() => console.log('[Badging API] Badge set to 1'))
            .catch(error => console.error('[Badging API] Gagal mengatur badge:', error));
        }
        // Revoke URL objek sebelumnya untuk mencegah kebocoran memori
        if (audioPlayer.src && audioPlayer.src.startsWith('blob:')) {
            URL.revokeObjectURL(audioPlayer.src);
            console.log("[DEBUG] Previous Blob URL revoked.");
        }

        let fileBlob = null;
        try {
            const trackFromDB = await getMusikDariDB(trackMetadata.id);
            if (trackFromDB && trackFromDB.fileData) {
                fileBlob = trackFromDB.fileData;
                console.log(`[DEBUG] Successfully retrieved Blob for "${trackMetadata.name}" from IndexedDB.`);
            } else {
                console.error(`[DEBUG] Could not find file data (Blob) for ID: ${trackMetadata.id} in IndexedDB.`);
                alert(`File musik "${trackMetadata.name}" tidak dapat ditemukan secara offline. Silakan scan ulang folder.`);
                audioPlayer.src = '';
                resetPlayerUI();
                return;
            }
        } catch (error) {
            console.error(`[DEBUG] Error retrieving file from IndexedDB for ${trackMetadata.name}:`, error);
            alert(`Terjadi kesalahan saat memuat file musik "${trackMetadata.name}".`);
            audioPlayer.src = '';
            resetPlayerUI();
            return;
        }
        if (fileBlob) {
            const fileURL = URL.createObjectURL(fileBlob);
            audioPlayer.src = fileURL;
            audioPlayer.load();
            console.log("[DEBUG] New audio source set from IndexedDB Blob:", fileURL);
        } else {
            console.error("[DEBUG] No file Blob available for playback.");
            audioPlayer.src = '';
            resetPlayerUI();
            return;
        }

        const title = trackMetadata.title || parseTrackInfo(trackMetadata.name).title;
        const artist = trackMetadata.artist || parseTrackInfo(trackMetadata.name).artist;

        currentTrackTitleEl.textContent = title;
        currentTrackArtistEl.textContent = artist;
        currentTrackArtistMiniEl.textContent = artist
        console.log("[DEBUG] UI text updated for:", title);


        const selectedVideoFileName = getBackgroundVideoByTitle(title); // judul lagu untuk filter
        const videoPath = `${selectedVideoFileName}`; // Sesuaikan path jika berbeda

        if (backgroundVideoPlayer) {

            if (!backgroundVideoPlayer.src.includes(selectedVideoFileName)) {
                console.log(`[DEBUG] Mengganti video background ke: ${selectedVideoFileName}`);
                backgroundVideoPlayer.src = videoPath;

                backgroundVideoPlayer.removeEventListener('canplaythrough', handleBackgroundVideoLoad);
                backgroundVideoPlayer.addEventListener('canplaythrough', handleBackgroundVideoLoad);

                backgroundVideoPlayer.classList.remove('is-loaded'); // Sembunyikan selama loading
                backgroundVideoPlayer.load(); // Muat sumber video baru
                backgroundVideoPlayer.play().catch(e => console.error("Error playing background video:", e));
            } else {
                console.log(`[DEBUG] Video background sudah sesuai (${selectedVideoFileName}).`);

                backgroundVideoPlayer.classList.add('is-loaded');

                backgroundVideoPlayer.play().catch(e => console.error("Error ensuring background video plays:", e));
            }
        }

        let finalThumbnailUrl = trackMetadata.thumbnailUrl;

        if (!finalThumbnailUrl || finalThumbnailUrl === '') {
            finalThumbnailUrl = getDefaultThumbnailByTitle(title);
        }

        if (currentThumbnailArt && thumbnailIconPlaceholder) {
            if (finalThumbnailUrl) {
                currentThumbnailArt.src = finalThumbnailUrl;
                currentThumbnailArt.style.display = 'block';
                thumbnailIconPlaceholder.style.display = 'none';
                currentThumbnailArt.alt = `Album Art for ${title} by ${artist}`;
                console.log("[DEBUG] Thumbnail art updated to:", finalThumbnailUrl);
            } else {
                currentThumbnailArt.src = DEFAULT_THUMBNAILS['fallback'] || ''; // Fallback aman
                // currentThumbnailArt.src = ''; // Baris ini membuat src kosong setelah fallback, hapus.
                currentThumbnailArt.style.display = 'none';
                currentThumbnailArt.alt = '';
                thumbnailIconPlaceholder.style.display = 'flex';
                console.warn("[DEBUG] Final thumbnail URL is empty, displaying default icon as ultimate fallback.");
            }
        }

        if (activeTrackTitleAnimation) {
            activeTrackTitleAnimation.textContent = `${title} - ${artist}`;
            activeTrackTitleAnimation.classList.add('marquee-active');
            console.log("[DEBUG] animation text updated for:", title);
        }

        if (activeTrackTitleAnimationThumbnail) {
            activeTrackTitleAnimationThumbnail.textContent = `${title} - ${artist}`;
            activeTrackTitleAnimationThumbnail.classList.add('marquee-active');
            console.log("[DEBUG] Thumbnail animation text updated for:", title);
        }

        const isCurrentlyInPlaylist = userPlaylist.some(pTrack => pTrack.id === trackMetadata.id);
        if (isCurrentlyInPlaylist) {
            addToPlaylistBtn.classList.add('active');
        } else {
            addToPlaylistBtn.classList.remove('active');
        }
        console.log("[DEBUG] Add to Playlist button status updated.");

        playerControlContainer.classList.remove('hidden');
        playerControlContainer.classList.add('block');

        try {
            await audioPlayer.play();
            playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playPauseBtnMini.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
            console.log("[DEBUG] Audio playing automatically after loadTrack.");
        } catch (error) {
            console.error("[DEBUG] Error playing audio (autoplay blocked?):", error);
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtnMini.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            alert('Autoplay diblokir oleh browser. Silakan klik tombol play untuk memulai.');
        }
        updateActiveSongInUI();

        audioPlayer.onended = () => {

            if (fileURL) {
                // Memeriksa keberadaan fileURL
                URL.revokeObjectURL(fileURL);
                console.log(`[DEBUG] URL objek dibatalkan untuk ${trackMetadata.name} karena lagu selesai.`);
            }
            playNextTrack();
        };
    }

    const togglePlayPause = async () => {
        console.log("Play/Pause button clicked. Current track index:", currentTrackIndex, "Current playing list length:", currentPlayingList.length);

        // KASUS 1: Tidak ada lagu di daftar putar sama sekali
        if (currentPlayingList.length === 0) {
            alert('Silakan tambahkan musik terlebih dahulu.');
            console.warn("[DEBUG] No songs in current playing list.");
            return;
        }

        // KASUS 2: Belum ada lagu yang dimuat (currentTrackIndex = -1)
        if (currentTrackIndex === -1) {
            console.log("[DEBUG] No track loaded, attempting to load the first track.");
            currentTrackIndex = 0; // muat lagu pertama
            await loadTrack(currentTrackIndex);
            return;
        }

        // KASUS 3: Lagu sudah dimuat, hanya perlu Play/Pause
        if (audioPlayer.paused) {
            try {
                await audioPlayer.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
                playPauseBtnMini.innerHTML = '<i class="fas fa-pause"></i>';
                isPlaying = true;
                console.log("[DEBUG] AudioPlayer now playing.");
            } catch (error) {
                console.error("[DEBUG] Failed to play audio:", error);
                alert('Gagal memutar audio. Coba muat ulang halaman atau periksa konsol.');
            }
        } else {
            audioPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            playPauseBtnMini.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
            console.log("[DEBUG] AudioPlayer now paused.");
        }

        // Di dalam togglePlayPause() setelah audioPlayer.pause()
        if ('clearAppBadge' in navigator) {
            navigator.clearAppBadge()
            .then(() => console.log('[Badging API] Badge cleared'))
            .catch(error => console.error('[Badging API] Gagal menghapus badge:', error));
        }

        updatePlaybackProgress(); // Perbarui UI (misalnya progres bar)
    };
    // Handler untuk memudarkan video setelah dimuat (fungsi pembantu)
    function handleBackgroundVideoLoad() {
        backgroundVideoPlayer.classList.add('is-loaded');
    }


    function playNextTrack() {
        console.log("Playing next track. Shuffle mode:", isShuffling ? "ON": "OFF");
        if (currentPlayingList.length === 0) {
            console.log("No songs in current playing list.");
            return;
        }

        if (isRepeating) {
            audioPlayer.currentTime = 0;
            audioPlayer.play();
            console.log("Repeating current track.");
        } else {
            let nextIndex;
            if (isShuffling) {
                // LOGIKA BARU UNTUK MEMILIH LAGU ACAK SETIAP KALI
                do {
                    nextIndex = Math.floor(Math.random() * currentPlayingList.length);
                } while (nextIndex === currentTrackIndex && currentPlayingList.length > 1); // Hindari memutar lagu yang sama dua kali berturut-turut jika ada lebih dari 1 lagu
                console.log("DEBUG: Shuffle ON. Picking random next track at index:", nextIndex);
            } else {
                // LOGIKA SEKUENSIAL JIKA SHUFFLE OFF
                nextIndex = (currentTrackIndex + 1) % currentPlayingList.length;
                console.log("DEBUG: Shuffle OFF. Picking sequential next track at index:", nextIndex);
            }

            console.log("DEBUG: Current playing list (map names):", currentPlayingList.map(track => track.name));
            console.log("DEBUG: Current track index:", currentTrackIndex, "Next calculated index:", nextIndex);
            console.log("DEBUG: Next song target by name:", currentPlayingList[nextIndex] ? currentPlayingList[nextIndex].name: "undefined");

            loadTrack(nextIndex);
            console.log("Loading next track at index:", nextIndex);
        }
    }

    function playPrevTrack() {
        console.log("Playing previous track.");
        if (currentPlayingList.length === 0) {
            console.log("No songs in current playing list.");
            return;
        }
        const prevIndex = (currentTrackIndex - 1 + currentPlayingList.length) % currentPlayingList.length;
        loadTrack(prevIndex);
        console.log("Loading previous track at index:", prevIndex);
    }

    // Fungsi untuk mengacak array (Fisher-Yates shuffle)
    function shuffleArray(array) {
        let currentIndex = array.length,
        randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex],
                array[randomIndex]] = [array[randomIndex],
                array[currentIndex]];
        }
        return array;
    }

    // Fungsi untuk mengacak daftar putar saat ini
    function shuffleCurrentPlayingList() {
        if (currentPlayingList.length > 1) {
            currentPlayingList = shuffleArray([...currentPlayingList]); // Buat salinan sebelum diacak
            console.log("Current playing list shuffled.");
        } else {
            console.log("Cannot shuffle list with 0 or 1 song.");
        }
    }

    function toggleThumbnail(forceClose = false) {
        // Penting: Reset inline transform style untuk memastikan CSS mengambil alih
        thumbnailContainer.style.transform = '';

        if (forceClose) {
            thumbnailContainer.classList.remove('active');

        } else {
            thumbnailContainer.classList.toggle('active');

        }

        if (toggleThumbnailBtn) {
            const isActive = thumbnailContainer.classList.contains('active');
            toggleThumbnailBtn.classList.toggle('active', isActive);
        }

        translateY = 0;
    }

    // Event listener untuk tombol info lagu
    if (trackInfoBtn) {
        trackInfoBtn.addEventListener('click', () => {
            // --- MODIFIKASI DIMULAI DI SINI ---
            if (trackInfoPopup.classList.contains('active')) {
                // Jika popup sudah aktif, sembunyikan
                console.log('Track Info button clicked. Hiding popup.');
                hideTrackInfoPopup();
            } else {
                // Jika popup belum aktif, tampilkan
                console.log('Track Info button clicked. Showing popup.');
                showTrackInfoPopup();
            }

        });
    }

    if (closeTrackInfoPopupBtn) {
        closeTrackInfoPopupBtn.addEventListener('click', () => {
            console.log('Close Track Info button clicked. Hiding popup.');
            hideTrackInfoPopup();
        });
    }

    if (toggleThumbnailBtn) {
        toggleThumbnailBtn.addEventListener('click', () => {
            toggleThumbnail();
        });
    }


    if (thumbnailContainer) {
        thumbnailContainer.addEventListener('mousedown', (e) => {
            if (thumbnailContainer.classList.contains('active')) {
                startY = e.clientY;
                isDragging = true;
                thumbnailContainer.style.transition = 'none';
            }
        });

        toggleThumbnailBtn.addEventListener('click',
            () => {
                thumbnailContainer.classList.toggle('active');

                if (thumbnailContainer.classList.contains('active')) {

                    playerControlContainer.classList.add('thumbnail-active-background');

                } else {
                    playerControlContainer.classList.remove('thumbnail-active-background');
                }

            });

        document.addEventListener('mousemove',
            (e) => {
                if (!isDragging) return;
                const currentY = e.clientY;
                const diffY = currentY - startY;

                if (diffY >= 0) {
                    // Hanya jika digeser ke bawah
                    translateY = diffY;
                    thumbnailContainer.style.transform = `translateY(${translateY}px)`;
                }
            });

        document.addEventListener('mouseup',
            () => {
                if (!isDragging) return;
                isDragging = false;

                thumbnailContainer.style.transition = 'transition: transform 0.3s ease-in-out, z-index 0s linear 0.3s;';
                if (translateY > thumbnailContainer.offsetHeight / 2) {
                    toggleThumbnail(true); // Paksa tutup
                } else {
                    thumbnailContainer.style.transform = `translateY(calc(-1 * var(--border)))`;
                    translateY = 0;
                }
            });

        thumbnailContainer.addEventListener('mouseleave',
            () => {

                if (isDragging) {
                    isDragging = false;
                    thumbnailContainer.style.transition = 'transition: transform 0.3s ease-in-out, z-index 0s linear 0.3s;'; // Tambahkan transisi z-index
                    if (translateY > thumbnailContainer.offsetHeight / 2) {
                        toggleThumbnail(true);
                    } else {
                        thumbnailContainer.style.transform = `translateY(calc(-1 * var(--border)))`;
                        translateY = 0;
                    }
                }
            });

        //  Event untuk Sentuhan (Touch)
        thumbnailContainer.addEventListener('touchstart',
            (e) => {
                if (e.touches.length === 1 && thumbnailContainer.classList.contains('active')) {
                    startY = e.touches[0].clientY;
                    isDragging = true;
                    thumbnailContainer.style.transition = 'none';
                }
            },
            {
                passive: true
            });

        thumbnailContainer.addEventListener('touchmove',
            (e) => {
                if (!isDragging || e.touches.length === 0) return;
                const currentY = e.touches[0].clientY;
                const diffY = currentY - startY;

                if (diffY >= 0) {
                    translateY = diffY;
                    thumbnailContainer.style.transform = `translateY(${translateY}px)`;
                }
            },
            {
                passive: true
            });

        thumbnailContainer.addEventListener('touchend',
            () => {
                if (!isDragging) return;
                isDragging = false;
                thumbnailContainer.style.transition = 'transform 0.3s ease-in-out, z-index 0s linear 0.3s';

                if (translateY > thumbnailContainer.offsetHeight / 2) {
                    toggleThumbnail(true);
                } else {
                    thumbnailContainer.style.transform = `translateY(calc(-1 * var(--border)))`;
                    translateY = 0;
                }
            });
    }

    window.addEventListener('scroll',
        () => {
            clearTimeout(scrollTimeout);

            scrollTimeout = setTimeout(() => {
                const currentScrollY = window.scrollY;
                const isThumbnailActive = thumbnailContainer && thumbnailContainer.classList.contains('active');

                if (isThumbnailActive && (currentScrollY - lastScrollY) > SCROLL_THRESHOLD) {
                    console.log("[DEBUG]: Detected scroll DOWN beyond threshold. Attempting to CLOSE thumbnail.");
                    toggleThumbnail(true); // Panggil fungsi toggleThumbnail untuk menutup
                }

                lastScrollY = currentScrollY;
            },
                SCROLL_DEBOUNCE_DELAY);
        });

    window.addEventListener('resize', () => {});

    window.addEventListener('load', () => {});

    //   Event Listener Utama
    if (addThumbnailToPlaylistBtn) {
        addThumbnailToPlaylistBtn.addEventListener('click', addCurrentTrackToPlaylist);
    }

    if (likedSongsEntry) {
        likedSongsEntry.addEventListener('click', () => {
            if (isLikedSongsDisplayed) {
                //  sembunyikan likedSongsUl dan tampilkan customPlaylistsUl
                if (likedSongsUl) likedSongsUl.style.display = 'none';
                if (customPlaylistsUl) customPlaylistsUl.style.display = 'block';
                if (userPlaylistUl) userPlaylistUl.style.display = 'none';

                console.log("Menyembunyikan Lagu Favorit, menampilkan Playlist Kustom.");
                isLikedSongsDisplayed = false;
            } else {
                // tampilkan likedSongsUl dan sembunyikan customPlaylistsUl
                if (customPlaylistsUl) customPlaylistsUl.style.display = 'none';
                if (userPlaylistUl) userPlaylistUl.style.display = 'none';

                if (likedSongsUl) likedSongsUl.style.display = 'block';
                renderLikedSongs(); // Render ulang setiap kali ditampilkan
                console.log("Menampilkan daftar Lagu Favorit.");
                isLikedSongsDisplayed = true;
            }

        });
    }


    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', togglePlayPause); // Panggil togglePlayPause!
    }
    if (playPauseBtnMini) {
        playPauseBtnMini.addEventListener('click', togglePlayPause);
    }
    // Event Listener untuk tombol Next
    if (nextBtn) {
        nextBtn.addEventListener('click', playNextTrack);
    }
    // Event Listener untuk tombol Next
    if (nextBtnMini) {
        nextBtnMini.addEventListener('click', playNextTrack);
    }
    // Event Listener untuk tombol Previous
    if (prevBtn) {
        prevBtn.addEventListener('click', playPrevTrack);
    }


    //
    if (audioPlayer) {
        audioPlayer.addEventListener('timeupdate', () => {
            // Kita akan memanggil updatePlaybackProgress() di sini
            // daripada menduplikasi logika di dalam event listener ini.
            // Ini membuat kode lebih rapi dan DRY (Don't Repeat Yourself).
            updatePlaybackProgress();
        });

        audioPlayer.addEventListener('loadedmetadata', () => {
            if (totalDurationSpan) {
                totalDurationSpan.textContent = formatTime(audioPlayer.duration);
            }
            console.log("Metadata loaded. Duration:", audioPlayer.duration);
            // Panggil updatePlaybackProgress untuk memastikan progress bar terinisialisasi
            updatePlaybackProgress();
        });

        audioPlayer.addEventListener('ended',
            () => {
                console.log("Audio ended. Playing next track.");
                playNextTrack(); // Asumsi playNextTrack() ada
            });
    }
    updatePlaybackProgress();

    let isRepeating = false;
    if (repeatBtn) {
        repeatBtn.addEventListener('click', () => {
            isRepeating = !isRepeating;
            repeatBtn.classList.toggle('active', isRepeating);
            audioPlayer.loop = isRepeating;
            //   alert(`Repeat: ${isRepeating ? 'ON': 'OFF'}`);
            console.log("Repeat mode toggled:", isRepeating);
        });
    }

    if (shuffleBtn) {
        shuffleBtn.addEventListener('click', () => {
            isShuffling = !isShuffling;
            shuffleBtn.classList.toggle('active', isShuffling);
            console.log("Shuffle mode toggled:", isShuffling);

            const currentlyPlayingTrack = (currentTrackIndex !== -1 && currentPlayingList.length > 0) ? currentPlayingList[currentTrackIndex]: null;

            if (isShuffling) {
                originalPlayingList = [...currentPlayingList]; // Save original order
                shuffleCurrentPlayingList();

                if (currentlyPlayingTrack) {
                    currentTrackIndex = currentPlayingList.findIndex(track => track.id === currentlyPlayingTrack.id);
                    if (currentTrackIndex === -1) {

                        currentTrackIndex = 0;

                    }
                } else {
                    currentTrackIndex = 0;

                }

            } else {
                // Turning shuffle OFF
                // Restore the original order
                currentPlayingList = [...originalPlayingList];

                if (currentlyPlayingTrack) {
                    currentTrackIndex = currentPlayingList.findIndex(track => track.id === currentlyPlayingTrack.id);
                    if (currentTrackIndex === -1) {
                        // If for some reason it's not found
                        currentTrackIndex = 0; // Default to the first song in original list
                    }
                } else {
                    currentTrackIndex = 0;
                }
            }

            if (currentCategory === 'music') {
                renderMusicList(currentPlayingList, musicListUl);
            } else if (currentCategory === 'playlist') {
                renderMusicList(currentPlayingList, userPlaylistUl, true);
            }

            updateActiveSongInUI(); // Re-highlight the active song based on the new list order
        });
    }

    if (musicCategoryBtn) {
        console.log("Simulating click on Music category button for initialization.");
        musicCategoryBtn.click();
    } else {
        console.warn("Music category button not found. Initializing music list directly.");
        renderMusicList(allMusicFiles, musicListUl);
        currentPlayingList = allMusicFiles;
        updateActiveSongInUI();
    }

    if (playerControlContainer) {
        playerControlContainer.classList.add('block');
    }

    // Logika untuk Tombol Hapus Playlist
    if (clearPlaylistBtn) {
        clearPlaylistBtn.addEventListener('click', async (e) => {
            // <-- Jadikan asynchronous
            e.preventDefault();
            if (confirm("Anda yakin ingin menghapus SEMUA lagu dan video yang telah Anda tambahkan serta playlist Anda? Ini tidak bisa dibatalkan.")) {
                console.log("Clearing all media data and playlists.");

                // 1. Kosongkan array di memori
                allMusicFiles = [];
                allVideoFiles = []; // <-- Tambahan: Kosongkan daftar video
                userPlaylist = [];
                currentPlayingList = [];
                currentTrackIndex = -1;

                // 2. Hentikan pemutaran dan reset player UI
                audioPlayer.pause();
                audioPlayer.src = '';
                resetPlayerUI();
                playerControlContainer.classList.add('block');
                activeTrackTitleAnimation.textContent = 'No song are playing';
                activeTrackTitleAnimation.classList.remove('marquee-active');

                // 3. Hapus data dari IndexedDB
                try {
                    await clearAllMediaFromDB(); // <-- Tambahan: Panggil fungsi untuk menghapus dari DB
                    console.log("Semua data media berhasil dihapus dari IndexedDB.");
                } catch (error) {
                    console.error("Gagal menghapus data media dari IndexedDB:", error);
                    alert("Terjadi kesalahan saat menghapus data dari database.");
                    return; // Hentikan proses jika gagal menghapus dari DB
                }

                // 4. Hapus data dari Local Storage (untuk playlist kustom, dll)
                localStorage.removeItem(LS_KEY_MUSIC_METADATA); // Ini mungkin tidak lagi relevan jika semua metadata di DB
                localStorage.removeItem(LS_KEY_PLAYLIST_IDS);

                customPlaylists = [];
                saveCustomPlaylists(); // Panggil fungsi untuk menyimpan state kosong

                // 5. Perbarui UI untuk semua daftar
                renderMusicList(allMusicFiles, musicListUl);

                renderMusicList(userPlaylist, userPlaylistUl, true);
                renderArtistList();
                renderCustomPlaylists(); // Render ulang daftar playlist kustom
                buildAlbumList();
                renderAlbumList(); // Render ulang daftar album

                if (sideMenu && sideMenu.classList.contains('active')) {
                    sideMenu.classList.remove('active');
                    menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
                alert("Semua data musik, video, dan playlist telah dihapus.");
            }
        });
    }

    async function clearAllMediaFromDB() {
        const db = await openIndexedDB();
        // Pastikan nama object store adalah 'musikFiles'
        const transaction = db.transaction(['musikFiles'],
            'readwrite');
        const objectStore = transaction.objectStore('musikFiles');

        return new Promise((resolve, reject) => {
            const request = objectStore.clear(); // Menghapus semua entri

            request.onsuccess = () => {
                console.log("Semua data di 'musikFiles' IndexedDB telah dihapus.");
                resolve();
            };

            request.onerror = (event) => {
                console.error("Gagal menghapus data dari IndexedDB:", event.target.error);
                reject(event.target.error);
            };
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();

            // Cari lagu yang cocok
            const filteredSongs = allMusicFiles.filter(track =>
                parseTrackInfo(track.name).title.toLowerCase().includes(searchTerm) ||
                parseTrackInfo(track.name).artist.toLowerCase().includes(searchTerm)
            );

            // Kosongkan list sebelumnya
            musicListUl.innerHTML = "";

            if (filteredSongs.length > 0) {
                displayCategory('music'); // tetap tampilkan section 'music'
                musicCategory.querySelector('.page-description').textContent = `Hasil Pencarian untuk "${searchInput.value}"`;

                // Tampilkan hasil yang cocok saja
                renderMusicList(filteredSongs, musicListUl);
                currentPlayingList = filteredSongs;
                updateActiveSongInUI();
            } else {
                // Jika tidak ditemukan, tampilkan pesan kosong
                musicCategory.querySelector('.page-description').textContent = `Tidak ada hasil untuk "${searchInput.value}"`;
            }
        });
    }
    // ============================================
    // OVERLAY All PAGE  DOWN - CUT - ABS
    // ===========================================

    cutAudioFileInput.addEventListener('change',
        async (event) => {
            const file = event.target.files[0];
            if (!file) {
                selectedFileName.textContent = 'Pilih File Audio, klik disini.';
                audioCuttingArea.style.display = 'none';

                if (cutAudioPlayerPreview) {
                    cutAudioPlayerPreview.pause();
                    cutAudioPlayerPreview.src = ''; // Kosongkan src pemain pratinjau
                }

                audioBufferData = null;
                previewCutAudioBtn.innerHTML = '<i class="fas fa-play"></i>';
                cutAudioFileNameDisplay.textContent = '';
                cutAudioOriginalDuration.textContent = '0:00';
                currentTimeDisplay.textContent = '00:00';
                totalDurationDisplay.textContent = '00:00';
                customFileNameInput.value = '';
                downloadCutAudioLink.style.display = 'none';
                startSlider.value = 0; endSlider.value = 100; audioProgressSlider.value = 0;
                updateSliderDisplays();
                return;
            }

            if (cutAudioPlayerPreview) {
                cutAudioPlayerPreview.pause();
                cutAudioPlayerPreview.src = ''; // Kosongkan src pemain pratinjau
            }
            previewCutAudioBtn.innerHTML = '<i class="fas fa-play"></i>';

            selectedFileName.textContent = file.name;
            cutAudioFileNameDisplay.textContent = file.name;
            customFileNameInput.value = file.name.split('.').slice(0, -1).join('_');

            initAudioContext();

            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    audioBufferData = await audioContext.decodeAudioData(e.target.result);

                    const duration = audioBufferData.duration;
                    cutAudioOriginalDuration.textContent = formatTime(duration);
                    totalDurationDisplay.textContent = formatTime(duration);

                    startSlider.max = duration;
                    endSlider.max = duration;
                    audioProgressSlider.max = duration;

                    startSlider.value = 0;
                    endSlider.value = duration;
                    audioProgressSlider.value = 0;

                    updateSliderDisplays();

                    audioCuttingArea.style.display = 'block';
                    downloadCutAudioLink.style.display = 'none';


                    const newAudioUrl = URL.createObjectURL(file);
                    cutAudioPlayerPreview.src = newAudioUrl;
                    cutAudioPlayerPreview.load();

                    cutAudioPlayerPreview.onloadedmetadata = () => {

                        audioProgressSlider.max = cutAudioPlayerPreview.duration;
                        console.log("Cut Preview Player: onloadedmetadata fired. Duration:", cutAudioPlayerPreview.duration);
                    };

                    cutAudioPlayerPreview.ontimeupdate = () => {

                        audioProgressSlider.value = cutAudioPlayerPreview.currentTime;
                        currentTimeDisplay.textContent = formatTime(cutAudioPlayerPreview.currentTime);
                        const cutEndTime = parseFloat(endSlider.value);
                        if (!cutAudioPlayerPreview.paused && cutAudioPlayerPreview.currentTime >= cutEndTime) {

                            cutAudioPlayerPreview.pause();
                            previewCutAudioBtn.innerHTML = '<i class="fas fa-play"></i>';
                            cutAudioPlayerPreview.currentTime = parseFloat(startSlider.value);
                        }
                    };

                    cutAudioPlayerPreview.onended = () => {

                        previewCutAudioBtn.innerHTML = '<i class="fas fa-play"></i>';
                        cutAudioPlayerPreview.currentTime = parseFloat(startSlider.value);

                        URL.revokeObjectURL(newAudioUrl); // <-- PENTING: Cabut URL objek ketika selesai
                        cutAudioPlayerPreview.src = ''; // <-- Bersihkan src pemain pratinjau setelah selesai
                    };

                } catch (error) {
                    console.error('Error decoding audio data:', error);
                    alert('Gagal memuat atau memproses file audio. Pastikan format file didukung.');
                    selectedFileName.textContent = 'Tidak ada file terpilih, klik disini.';
                    audioCuttingArea.style.display = 'none';
                    resetCutAudioUI(); // Ini akan mereset pemain pratinjau juga
                }
            };
            reader.onerror = (error) => {
                console.error('Error reading file:', error);
                alert('Gagal membaca file.');
                resetCutAudioUI();
            };

            reader.readAsArrayBuffer(file);
        });

    startSlider.addEventListener('input',
        updateSliderDisplays);
    endSlider.addEventListener('input',
        updateSliderDisplays);

    // 2. Fungsi Pengaturan Slider Pemotongan (Start & End)
    function updateSliderDisplays() {
        let startTime = parseFloat(startSlider.value);
        let endTime = parseFloat(endSlider.value);

        if (startTime > endTime) {
            startTime = endTime;
            startSlider.value = endTime;
        }
        if (endTime < startTime) {
            endTime = startTime;
            endSlider.value = startTime;
        }

        startSlider.value = startTime;
        endSlider.value = endTime;

        cutStartTimeDisplay.textContent = formatTime(startTime);
        cutEndTimeDisplay.textContent = formatTime(endTime);

        updateSliderTrack();
    }


    previewCutAudioBtn.addEventListener('click', () => {
        if (!cutAudioPlayerPreview || !cutAudioPlayerPreview.src || isNaN(cutAudioPlayerPreview.duration)) {

            alert('Pilih file audio terlebih dahulu!');
            return;
        }

        if (cutAudioPlayerPreview.paused) {

            const startTime = parseFloat(startSlider.value);
            cutAudioPlayerPreview.currentTime = startTime;
            cutAudioPlayerPreview.play();

            previewCutAudioBtn.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            cutAudioPlayerPreview.pause();

            previewCutAudioBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    audioProgressSlider.addEventListener('input',
        () => {
            if (cutAudioPlayerPreview && !isNaN(cutAudioPlayerPreview.duration)) {

                cutAudioPlayerPreview.currentTime = audioProgressSlider.value;

            }
        });

    // 4. Fungsi Pemotongan dan Penyimpanan Audio dengan Web Audio API
    if (cutAudioBtn) {
        cutAudioBtn.addEventListener('click', async () => {
            if (!audioBufferData) {
                alert('Tidak ada data audio yang dimuat untuk dipotong.');
                return;
            }

            const start = parseFloat(startSlider.value);
            const end = parseFloat(endSlider.value);
            const fileNameWithoutExt = customFileNameInput.value || 'cut_audio';
            const outputFileName = `${fileNameWithoutExt}_potong.wav`; // Output will be WAV

            if (end <= start) {
                alert('Durasi akhir harus lebih besar dari durasi awal.');
                return;
            }

            try {
                // Buat AudioBuffer baru untuk bagian yang dipotong
                const cutDuration = end - start;
                const sampleRate = audioBufferData.sampleRate;
                const numberOfChannels = audioBufferData.numberOfChannels;

                // Hitung jumlah sampel untuk durasi yang dipotong
                const startOffset = Math.floor(start * sampleRate);
                const endOffset = Math.floor(end * sampleRate);
                const frameCount = endOffset - startOffset;

                // Buat AudioBuffer baru dengan ukuran yang sesuai
                const newAudioBuffer = audioContext.createBuffer(numberOfChannels, frameCount, sampleRate);

                // Salin data dari AudioBuffer asli ke AudioBuffer baru
                for (let i = 0; i < numberOfChannels; i++) {
                    const originalChannelData = audioBufferData.getChannelData(i);
                    const newChannelData = newAudioBuffer.getChannelData(i);
                    for (let j = 0; j < frameCount; j++) {
                        newChannelData[j] = originalChannelData[startOffset + j];
                    }
                }

                // --- Encoding ke WAV ---
                // Sumber: https://stackoverflow.com/questions/21947852/create-audio-file-from-audiobuffer
                // membuat Blob WAV dari AudioBuffer
                const writeString = (view, offset, string) => {
                    for (let i = 0; i < string.length; i++) {
                        view.setUint8(offset + i, string.charCodeAt(i));
                    }
                };

                const floatTo16BitPCM = (output, offset, input) => {
                    for (let i = 0; i < input.length; i++, offset += 2) {
                        const s = Math.max(-1, Math.min(1, input[i]));
                        output.setInt16(offset, s < 0 ? s * 0x8000: s * 0x7FFF, true);
                    }
                };

                // --- Encoding ke WAV --- (VERSI BARU YANG SUDAH DIPERBAIKI)
                const encodeWAV = (audioBuffer) => {
                    const numberOfChannels = audioBuffer.numberOfChannels;
                    const sampleRate = audioBuffer.sampleRate;
                    const format = 1; // 1 = PCM (uncompressed)
                    const bitDepth = 16;
                    const bytesPerSample = bitDepth / 8;

                    // Fungsi helper untuk menulis string ke DataView
                    const writeString = (view, offset, string) => {
                        for (let i = 0; i < string.length; i++) {
                            view.setUint8(offset + i, string.charCodeAt(i));
                        }
                    };

                    // Kalkulasi ukuran buffer
                    const dataLength = audioBuffer.length * numberOfChannels * bytesPerSample;
                    const buffer = new ArrayBuffer(44 + dataLength); // Header WAV adalah 44 byte
                    const view = new DataView(buffer);

                    // --- Menulis Header WAV ---
                    writeString(view, 0, 'RIFF'); // RIFF identifier
                    view.setUint32(4, 36 + dataLength, true); // Panjang file
                    writeString(view, 8, 'WAVE'); // Tipe RIFF
                    writeString(view, 12, 'fmt '); // Format chunk identifier
                    view.setUint32(16, 16, true); // Panjang format chunk
                    view.setUint16(20, format, true); // Format sample (1 = PCM)
                    view.setUint16(22, numberOfChannels, true); // Jumlah channel
                    view.setUint32(24, sampleRate, true); // Sample rate
                    view.setUint32(28, sampleRate * numberOfChannels * bytesPerSample, true); // Byte rate
                    view.setUint16(32, numberOfChannels * bytesPerSample, true); // Block align
                    view.setUint16(34, bitDepth, true); // Bit per sample
                    writeString(view, 36, 'data'); // Data chunk identifier
                    view.setUint32(40, dataLength, true); // Panjang data chunk

                    // --- Menulis Data Audio (Interleaved) ---
                    const channels = [];
                    for (let i = 0; i < numberOfChannels; i++) {
                        channels.push(audioBuffer.getChannelData(i));
                    }

                    let offset = 44; // Mulai tulis data setelah header
                    // Loop melalui setiap frame/sampel
                    for (let i = 0; i < audioBuffer.length; i++) {
                        // Loop melalui setiap channel untuk frame saat ini
                        for (let j = 0; j < numberOfChannels; j++) {
                            // Ambil sampel, konversi ke 16-bit PCM, dan tulis
                            const sample = Math.max(-1, Math.min(1, channels[j][i]));
                            view.setInt16(offset, sample < 0 ? sample * 0x8000: sample * 0x7FFF, true);
                            offset += bytesPerSample;
                        }
                    }

                    // Kembalikan sebagai Blob
                    return new Blob([view], {
                        type: 'audio/wav'
                    });
                };


                const wavBlob = encodeWAV(newAudioBuffer);
                const url = URL.createObjectURL(wavBlob);

                downloadCutAudioLink.href = url;
                downloadCutAudioLink.download = outputFileName;
                downloadCutAudioLink.textContent = `Unduh ${outputFileName}`;
                downloadCutAudioLink.style.display = 'inline-block';
                alert('Audio berhasil dipotong dan siap diunduh! (Format WAV)');

            } catch (error) {
                console.error('Terjadi kesalahan saat memotong atau meng-encode audio:', error);
                alert('Gagal memotong audio. Pastikan Anda memilih file yang valid dan coba lagi.');
            }
        });
    }


    //  OVERlAY -  D O W N L O A D E R
    // ============================================
    processButton.addEventListener('click',
        () => {

            const url = urlInput.value.trim(); // .trim() untuk menghapus spasi
            if (!url) {
                alert('Mohon masukkan URL!');
                return;
            }
            downloadLinksDiv.style.display = 'none';
            errorMessage.style.display = 'none';
            videoInfoDisplay.style.display = 'none'; // Sembunyikan info video/thumbnail
            videoThumbnail.style.display = 'none';
            videoPlayerContainer.style.display = 'none';
            videoPreviewIframe.src = ''; // Bersihkan src iframe
            videoTitleDisplay.textContent = ''; // Bersihkan judul

            if (!url) {
                alert('Mohon masukkan URL!');
                return;
            }

            loadingMessage.style.display = 'flex'; // Tampilkan loading bubbles (flex)

            const apiEndpoint = 'http://....../api/download'; // Alamat API back-end

            const requestOptions = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    url: url
                })
            };

            fetch(apiEndpoint, requestOptions)
            .then(response => {
                loadingMessage.style.display = 'none'; // Sembunyikan loading setelah respon diterima

                if (!response.ok) {
                    return response.json().then(err => {
                        throw new Error(err.error || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (data.error) {
                    errorMessage.textContent = 'Error dari server: ' + data.error;
                    errorMessage.style.display = 'block';
                } else {
                    const videoUrl = data.videoUrl;
                    const audioUrl = data.audioUrl;
                    const thumbnailUrl = data.thumbnailUrl; // Ambil thumbnail URL
                    const videoTitle = data.title; // Ambil judul video
                    const videoId = data.videoId; // Ambil Video ID untuk iframe

                    // Tampilkan info video/thumbnail.
                    if (thumbnailUrl || videoTitle) {
                        videoInfoDisplay.style.display = 'block';
                        if (thumbnailUrl) {
                            videoThumbnail.src = thumbnailUrl;
                            videoThumbnail.style.display = 'block';
                        }
                        if (videoTitle) {
                            videoTitleDisplay.textContent = videoTitle;
                        }
                    }

                    if (videoId) {

                        videoPreviewIframe.src = `https://www.youtube.com/embed/${videoId}`;
                        videoPlayerContainer.style.display = 'block';
                    } else {
                        //  tidak ada videoId, sembunyikan player
                        videoPlayerContainer.style.display = 'none';
                        videoPreviewIframe.src = '';
                    }

                    // Tampilkan link download
                    if (videoUrl) {
                        videoLink.href = videoUrl;
                        videoLink.style.display = 'inline';
                    } else {
                        videoLink.style.display = 'none';
                    }

                    if (audioUrl) {
                        audioLink.href = audioUrl;
                        audioLink.style.display = 'inline';
                    } else {
                        audioLink.style.display = 'none';
                    }

                    if (videoUrl || audioUrl) {
                        downloadLinksDiv.style.display = 'block';
                    } else {
                        errorMessage.textContent = 'Tidak ada link unduhan tersedia untuk URL ini.';
                        errorMessage.style.display = 'block';
                    }
                }
            })
            .catch(error => {
                loadingMessage.style.display = 'none';
                errorMessage.textContent = 'Terjadi kesalahan: ' + error.message;
                errorMessage.style.display = 'block';
                console.error('Fetch error:', error);

                videoInfoDisplay.style.display = 'none';
                videoThumbnail.style.display = 'none';
                videoPlayerContainer.style.display = 'none';
            });
        });

        // Global declarations and initializations
    const openPageDaringView = document.getElementById("openPageDaringView");
    const pageDaringView = document.getElementById("pageDaringView");
    const closePageDaringView = document.getElementById("closePageDaringView");
    const audioPlayerView = document.getElementById("daringAudioPlayer");
    const playPauseBtnView = document.getElementById("playPauseBtnView");
    const nextBtnView = document.getElementById("nextBtnView");
    const repeatBtnView = document.getElementById("repeatBtnView");
    const progressBarView = document.getElementById("playProgressBarView");
    const searchInputView = document.getElementById("DaringsearchInput");
    const trackTitleAnimationView = document.getElementById("trackTitleAnimationView");
    let marqueeTextSpan = null; // Variabel untuk menyimpan referensi span teks marquee

    let currentIndexView = -1;
    let isRepeatView = false;

    // Data lagu (contoh, sesuaikan dengan sumber data Anda)
    const daringTracksView = [
    {
        titleView: "GIMS - Est-ce que tu m'aimes",
        artistView: "Maître Gims",
        srcView: "https://example.mp3",
        coverView: "https://raw.bar.jpg"
    }
];

    let cachedTrackMetadata = {};

    let currentLoadAbortController = null;

    let audioContext = null;
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    }
    initAudioContext(); // Inisialisasi AudioContext di awal

    async function loadTrackMetadata(track, signal) {
        // Jika metadata sudah ada di cache, langsung kembalikan
        if (cachedTrackMetadata[track.srcView]) {
            return cachedTrackMetadata[track.srcView];
        }

        try {
            // Gunakan `signal` untuk membatalkan fetch jika controller dibatalkan
            const response = await fetch(track.srcView, { signal });
            // Cek jika fetch dibatalkan
            if (!response.ok) {
                if (response.status === 200 && signal.aborted) { // Aborted before headers received
                    throw new Error("Fetch aborted by user action.");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.clone().blob(); // Clone response agar bisa dipakai untuk blob dan arrayBuffer
            const arrayBuffer = await response.arrayBuffer(); // Ambil arrayBuffer untuk AudioContext

            // Decode tags (judul, artis, cover)
            const tags = await new Promise((resolve, reject) => {
                jsmediatags.read(blob, {
                    onSuccess: ({ tags }) => resolve(tags),
                    onError: (error) => reject(error)
                });
            });

            const title = tags.title || track.titleView;
            const artist = tags.artist || track.artistView;
            let coverSrc = track.coverView;
            let objectUrlForCover = null; // Untuk menyimpan Object URL cover jika dibuat

            if (tags.picture) {
                const { data, format } = tags.picture;
                const blobForCover = new Blob([new Uint8Array(data)], { type: format });
                objectUrlForCover = URL.createObjectURL(blobForCover); // Buat Object URL untuk cover
                coverSrc = objectUrlForCover; // Gunakan Object URL ini sebagai src
            }

            // Dapatkan durasi menggunakan AudioContext (lebih andal)
            let duration = 0;
            try {
                const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
                duration = audioBuffer.duration;
            } catch (audioError) {
                console.warn(`[Performance] Could not reliably get duration for ${title} (${track.srcView}):`, audioError);
                // Biarkan duration tetap 0 atau gunakan fallback
            }

            const metadata = {
                title: title,
                artist: artist,
                coverSrc: coverSrc,
                duration: duration,
                objectUrlForCover: objectUrlForCover // Simpan Object URL untuk cover agar bisa dicabut nanti
            };

            cachedTrackMetadata[track.srcView] = metadata; // Simpan ke cache
            return metadata;

        } catch (error) {
            // Tangani pembatalan fetch secara spesifik
            if (error.name === 'AbortError' || error.message === 'Fetch aborted by user action.') {
                console.log(`[Performance] Metadata loading for ${track.titleView} aborted.`);
                return null; // Kembalikan null atau throw error jika Anda ingin menghentikan Promise.all
            }
            console.error(`[Performance] Failed to load metadata for ${track.srcView}:`, error);
            // Fallback: kembalikan metadata default jika gagal (agar proses tidak berhenti)
            const metadata = {
                title: track.titleView,
                artist: track.artistView,
                coverSrc: track.coverView,
                duration: 0,
                objectUrlForCover: null
            };
            cachedTrackMetadata[track.srcView] = metadata;
            return metadata;
        }
    }
    async function renderTrackListView() {
    const daringTrackContainer = document.getElementById("daringTrackContainer");
    const loadingBubble = document.getElementById("loadingIndicatorView");

    loadingBubble.style.display = "none";
    daringTrackContainer.innerHTML = ""; // Bersihkan kontainer utama

    const tracksToRender = daringTracksView; 
    // Atau: const tracksToRender = await loadTrackMetadata(daringTracksView); // Jika masih pakai jsmediatags

    let currentSegment = null;
    let cardsInCurrentSegment = 0; // Menghitung berapa kartu sudah di segmen saat ini
    
    const SCROLL_X_LIMIT = 9; // Batas kartu per segmen scroll-x

    tracksToRender.forEach((track, index) => {
        // Logika untuk MEMBUAT SEGMENT BARU jika diperlukan
        // Buat segmen baru jika:
        // 1. Ini adalah kartu pertama (index 0)
        // 2. Atau, jika segmen saat ini sudah penuh dengan 9 kartu
        if (currentSegment === null || cardsInCurrentSegment === SCROLL_X_LIMIT) {
            cardsInCurrentSegment = 0; // Reset hitungan kartu untuk segmen baru
            
            currentSegment = document.createElement("div");
            currentSegment.className = "segment-scroll-x"; // Selalu segmen scroll-x
            daringTrackContainer.appendChild(currentSegment);
        }

        // --- Bagian untuk membuat cardView dan menambahkan ke currentSegment ---
        const cardView = document.createElement("div");
        cardView.className = "content-card-view"; // Kelas dasar untuk kartu
        cardView.dataset.srcView = track.srcView;
        cardView.dataset.titleView = track.titleView;
        cardView.dataset.artistView = track.artistView;
        
        const title = track.title || track.titleView;
        const artist = track.artist || track.artistView;
        const coverSrc = track.coverSrc || track.coverView;

        cardView.innerHTML = `
            <img src="${coverSrc}" class="thumbss">
            <div class="content-info">
                <h4 class="track-title-text">${title}</h4>
                <p>${artist}</p>
            </div>
        `;
        
        currentSegment.appendChild(cardView);
        cardsInCurrentSegment++; // Tambah hitungan kartu di segmen saat ini

        // Logic marquee-active
        const titleElement = cardView.querySelector('.track-title-text');
        if (titleElement) {
            setTimeout(() => {
                if (titleElement.scrollWidth > titleElement.clientWidth) {
                    titleElement.classList.add('marquee-active');
                } else {
                    titleElement.classList.remove('marquee-active');
                }
            }, 50);
        }

        cardView.addEventListener("click", () => {
            playTrackView(track);
        });
    });
}

    // Pastikan marqueeTextSpan diinisialisasi sekali saja
    if (!trackTitleAnimationView.querySelector('#marqueeText')) {
        marqueeTextSpan = document.createElement('span');
        marqueeTextSpan.id = 'marqueeText';
        trackTitleAnimationView.appendChild(marqueeTextSpan);
    } else {
        marqueeTextSpan = trackTitleAnimationView.querySelector('#marqueeText');
    }

    function playTrackView(track) {
        currentIndexView = daringTracksView.findIndex(t => t.srcView === track.srcView);
        audioPlayerView.src = track.srcView;
        audioPlayerView.load(); // Tambahkan .load() untuk memastikan audio di-load ulang
        audioPlayerView.play().catch(error => {
            console.error("Error playing audio (autoplay blocked or other issue):", error);
            playPauseBtnView.innerHTML = '<i class="fas fa-play"></i>'; // Pastikan ikon kembali ke play
            alert("Autoplay diblokir oleh browser. Silakan klik play secara manual.");
        });
        playPauseBtnView.innerHTML = '<i class="fas fa-pause"></i>';
        progressBarView.style.width = "0%"; // Reset progress bar

        // Update dan kontrol animasi marquee
        marqueeTextSpan.textContent = `${track.titleView} - ${track.artistView}`;
        trackTitleAnimationView.style.display = "block"; // Tampilkan kontainer marquee

        const availableWidth = trackTitleAnimationView.clientWidth - 20; // 10px padding kiri + 10px padding kanan

        if (marqueeTextSpan.scrollWidth <= availableWidth) {
            marqueeTextSpan.style.animation = 'none'; // Matikan animasi jika teks pendek
            marqueeTextSpan.style.transform = 'translateX(0)'; // Pastikan di posisi awal
            trackTitleAnimationView.style.justifyContent = 'center'; // Pusatkan teks jika tidak dianimasikan
            marqueeTextSpan.style.animationPlayState = "paused"; // Pastikan animasi berhenti jika tidak diperlukan
        } else {

            marqueeTextSpan.style.animation = 'none'; // Reset animasi
            void marqueeTextSpan.offsetWidth; // Trigger reflow
            marqueeTextSpan.style.animation = 'marquee-animation 15s linear infinite'; // Aktifkan animasi
            trackTitleAnimationView.style.justifyContent = 'flex-start'; // Teks dimulai dari kiri
            marqueeTextSpan.style.animationPlayState = "running"; // Jalankan animasi
        }
    }

    playPauseBtnView.addEventListener("click", () => {
        if (audioPlayerView.paused) {
            audioPlayerView.play();
            playPauseBtnView.innerHTML = '<i class="fas fa-pause"></i>';
            if (marqueeTextSpan) {
                marqueeTextSpan.style.animationPlayState = "running";
            }
        } else {
            audioPlayerView.pause();
            playPauseBtnView.innerHTML = '<i class="fas fa-play"></i>';
            if (marqueeTextSpan) {
                marqueeTextSpan.style.animationPlayState = "paused";
            }
        }
    });

    nextBtnView.addEventListener("click",
        () => {
            currentIndexView = (currentIndexView + 1) % daringTracksView.length;
            playTrackView(daringTracksView[currentIndexView]);
        });

    repeatBtnView.addEventListener("click",
        () => {
            isRepeatView = !isRepeatView;
            repeatBtnView.classList.toggle("active", isRepeatView);
        });

    audioPlayerView.addEventListener("timeupdate",
        () => {
            // Gunakan audioPlayerView.duration yang seharusnya lebih andal sekarang
            if (audioPlayerView.duration && !isNaN(audioPlayerView.duration) && isFinite(audioPlayerView.duration) && audioPlayerView.duration > 0) {
                const percent = (audioPlayerView.currentTime / audioPlayerView.duration) * 100;
                progressBarView.style.width = percent + "%";
            } else {
                progressBarView.style.width = "0%";
            }
        });

    audioPlayerView.addEventListener('loadedmetadata',
        () => {
            progressBarView.style.width = "0%";

        });

    audioPlayerView.addEventListener("ended",
        () => {
            if (isRepeatView) {
                audioPlayerView.play();
            } else {
                nextBtnView.click();
            }
            if (!isRepeatView && currentIndexView === daringTracksView.length - 1) {
                if (marqueeTextSpan) {
                    marqueeTextSpan.style.animationPlayState = "paused";
                }
            }
        });

    searchInputView.addEventListener("input",
        () => {
            const keyword = searchInputView.value.toLowerCase();
            const cards = document.querySelectorAll(".content-card-view");

            let matchFound = false;
            cards.forEach(card => {
                const title = (card.dataset.titleView || "").toLowerCase();
                const artist = (card.dataset.artistView || "").toLowerCase();
                const isMatch = title.includes(keyword) || artist.includes(keyword);
                card.style.display = isMatch ? "block" : "none";
                if (isMatch) matchFound = true;
            });

            if (!matchFound && keyword === "") {
                cards.forEach(card => {
                    card.style.display = "block";
                });
            }
        });

    if (openPageDaringView) {
        openPageDaringView.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlayView(pageDaringView); // Asumsi ini fungsi yang menunjukkan overlay
            if (!pageDaringView.dataset.rendered) {
                renderTrackListView();
                pageDaringView.dataset.rendered = "true";
            }
            // Hentikan pemutaran audio di halaman utama jika ada
            if (window.audioPlayer) { // Asumsi audioPlayer dari halaman utama bernama `audioPlayer`
                window.audioPlayer.pause();
            }
            // Reset ikon play/pause di halaman utama (jika ada)
            if (window.playPauseBtn) {
                window.playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
            if (window.playPauseBtnMini) {
                window.playPauseBtnMini.innerHTML = '<i class="fas fa-play"></i>';
            }
            console.log("Membuka halaman page Daring.");
        });
    }

    if (closePageDaringView) {
        closePageDaringView.addEventListener('click', () => {

            if (currentLoadAbortController) {
                currentLoadAbortController.abort();
                console.log("[Performance] Active metadata loading aborted due to page close.");
            }

            // --- Pembersihan Audio Player Daring ---
            audioPlayerView.pause(); // Hentikan audio di halaman Daring
            audioPlayerView.src = ''; // Kosongkan src untuk membebaskan sumber daya
            playPauseBtnView.innerHTML = '<i class="fas fa-play"></i>'; // Reset ikon play/pause

            // --- Pembersihan Marquee ---
            trackTitleAnimationView.style.display = "none";
            if (marqueeTextSpan) {
                marqueeTextSpan.style.animationPlayState = "paused";
                marqueeTextSpan.textContent = ''; // Kosongkan teks marquee
            }

            // --- Pembersihan Cache dan Object URLs (PENTING untuk memori) ---
            for (const src in cachedTrackMetadata) {
                const metadata = cachedTrackMetadata[src];
                if (metadata.objectUrlForCover) {
                    URL.revokeObjectURL(metadata.objectUrlForCover);
                }
            }
            cachedTrackMetadata = {}; // Kosongkan cache
            console.log("[Performance] Cleared cached metadata and revoked Object URLs.");

            document.getElementById("loadingIndicatorView").style.display = "none";


            toggleSideMenu(true); // Sembunyikan side menu jika diperlukan
            displayCategory('music'); // Kembali ke tampilan kategori musik utama (atau apapun yang sesuai)

            console.log("Menutup halaman page Daring.");
        });
    }

    if (closeDownloadConvertBtn) {
        closeDownloadConvertBtn.addEventListener('click', () => {
            toggleSideMenu(true);

            displayCategory('music');

            console.log("Menutup halaman Download & Convert. Kembali ke halaman utama tanpa memuat ulang.");
        });
    }
    if (closeCutAudioBtn) {
        closeCutAudioBtn.addEventListener('click', () => {
            toggleSideMenu(true);
            cutAudioView.classList.remove('active');

            if (mainAppWrapper) {
                mainAppWrapper.classList.remove('hidden');

            }
            displayCategory('music');

            resetCutAudioUI();

            restoreMainPlayerFromCutAudio();

            console.log("Menutup halaman Potong Audio. Kembali ke halaman utama.");
        });
    }
    if (closeAboutUsBtn) {
        closeAboutUsBtn.addEventListener('click', () => {
            toggleSideMenu(true);

            displayCategory('music');

            console.log("Menutup halaman About Us. Kembali ke halaman utama tanpa memuat ulang.");
        });
    }
    function displayCategory(categoryName, songsToShow = null, pageDescription = null) {
        console.log(`[DEBUG] displayCategory dipanggil dengan: ${categoryName}, songsToShow: ${songsToShow ? songsToShow.length: 'none'}, pageDescription: ${pageDescription}`);

        // Sembunyikan semua overlay full-screen (jika ada yang aktif)
        document.querySelectorAll('.full-screen-overlay').forEach(overlay => {
            if (overlay.classList.contains('active')) {
                console.log(`[DEBUG] Menghapus 'active' dari overlay: ${overlay.id}`);
                overlay.classList.remove('active');
            }
        });
        if (typeof mainAppWrapper !== 'undefined' && mainAppWrapper) {
            if (mainAppWrapper.classList.contains('hidden')) {
                mainAppWrapper.classList.remove('hidden');
                console.log("[DEBUG] Berhasil menghapus 'hidden' dari mainAppWrapper.");
            }
        } else {
            console.warn("[DEBUG] mainAppWrapper tidak ditemukan atau tidak didefinisikan!");
        }
        // Perbarui kelas 'active' pada tombol kategori
        if (typeof categoryButtons !== 'undefined') {
            categoryButtons.forEach(button => {
                if (button.dataset.category === categoryName) {
                    if (!button.classList.contains('active')) {
                        button.classList.add('active');
                        console.log(`[DEBUG] Menambahkan 'active' ke category button: ${button.dataset.category}`);
                    }
                } else {
                    if (button.classList.contains('active')) {
                        button.classList.remove('active');
                        console.log(`[DEBUG] Menghapus 'active' dari category button: ${button.dataset.category}`);
                    }
                }
            });
        } else {
            console.warn("[DEBUG] categoryButtons tidak ditemukan atau tidak didefinisikan!");
        }

        document.querySelectorAll('.category-section').forEach(section => {
            section.style.display = 'none';
        });

        // Tampilkan elemen kategori yang diminta
        const targetCategoryElement = document.getElementById(categoryName + 'Category');
        if (targetCategoryElement) {
            targetCategoryElement.style.display = 'block'; // Tampilkan elemen target
            // Geser Kontainer ke Kategori yang Diminta
            if (categoryContentWrapper) {
                targetCategoryElement.scrollIntoView({
                    behavior: 'smooth', block: 'start', inline: 'start'
                });
                currentCategory = categoryName;

                console.log(`Menggeser ke kategori: ${categoryName}`);
            } else {
                console.warn(`[DEBUG] categoryContentWrapper tidak ditemukan.`);
            }
        } else {
            console.warn(`[DEBUG] Elemen kategori ${categoryName}Category tidak ditemukan.`);
            return; // Hentikan eksekusi jika elemen target tidak ada
        }

        if (playAllCustomPlaylistBtn) {
            playAllCustomPlaylistBtn.classList.add('hidden');
        }

        const userPlaylistUlElement = document.getElementById('userPlaylistUl'); // Asumsi ID 'userPlaylistUl' untuk daftar lagu playlist default
        if (userPlaylistUlElement) {
            userPlaylistUlElement.style.display = 'none';
        }
        const customPlaylistsUlElement = document.getElementById('customPlaylistsUl'); // Asumsi ID untuk daftar nama playlist kustom
        if (customPlaylistsUlElement) {
            customPlaylistsUlElement.style.display = 'none';
        }


        if (categoryName === 'music') {
            // Prioritas 1: spesifik (dari klik album/playlist) diminta untuk ditampilkan.
            if (songsToShow) {
                musicCategory.querySelector('.page-description').textContent = pageDescription || 'Daftar Lagu';
                renderMusicList(songsToShow, musicListUl);
                currentPlayingList = songsToShow;
                activeCustomPlaylistId = null; // Penting: Reset activeCustomPlaylistId
            }
            // Prioritas 2:  mode 'menambahkan ke playlist kustom' sedang aktif (klik dari item playlist "Tambah Lagu")
            else if (activeCustomPlaylistId) {
                const activePlaylist = customPlaylists.find(p => p.id === activeCustomPlaylistId);
                if (activePlaylist) {
                    musicCategory.querySelector('.page-description').textContent = pageDescription || `Tambah Lagu ke: ${activePlaylist.name}`;
                    renderMusicList(allMusicFiles, musicListUl); // Tampilkan SEMUA lagu dengan tombol tambah
                    currentPlayingList = allMusicFiles;
                } else {
                    console.warn(`[DEBUG] Playlist aktif dengan ID ${activeCustomPlaylistId} tidak ditemukan.`);
                    activeCustomPlaylistId = null;
                    musicCategory.querySelector('.page-description').textContent = '';
                    renderMusicList(allMusicFiles, musicListUl);
                    currentPlayingList = allMusicFiles;
                }
            }
            // Prioritas 3: Default, tampilkan semua musik
            else {
                musicCategory.querySelector('.page-description').textContent = '';
                renderMusicList(allMusicFiles, musicListUl);
                currentPlayingList = allMusicFiles;
                activeCustomPlaylistId = null;
            }
        } else if (categoryName === 'artist') {
            artistCategory.querySelector('.page-description').textContent = '';
            renderArtistList();
            currentPlayingList = [];
            activeCustomPlaylistId = null;
        } else if (categoryName === 'album') {
            albumCategory.querySelector('.page-description').textContent = '';
            buildAlbumList();
            renderAlbumList();
            currentPlayingList = [];
            activeCustomPlaylistId = null;
        } else if (categoryName === 'playlist') {
            // --- LOGIKA UTAMA UNTUK OPSI B: Selalu Tampilkan ISI userPlaylist ---
            playlistCategory.querySelector('.page-description').textContent = ''; // Judul untuk playlist default
            const validPlaylist = userPlaylist.filter(track => allMusicFiles.some(f => f.id === track.id && f.file instanceof File));
            userPlaylist = validPlaylist;

            renderMusicList(userPlaylist, userPlaylistUl, true); // Tampilkan daftar lagu dari userPlaylist
            currentPlayingList = userPlaylist; // Set daftar putar saat ini ke userPlaylist
            activeCustomPlaylistId = null; // Reset agar tidak mengganggu


            if (userPlaylistUlElement) {

                userPlaylistUlElement.style.display = 'block';
            }

            if (customPlaylistsUlElement) {
                customPlaylistsUlElement.style.display = 'none'; // Sembunyikan daftar nama playlist kustom
            }
        } else if (categoryName === 'cut-audio') {
            cutAudioCategory.querySelector('.page-description').textContent = 'Potong Audio';
            // Panggil fungsi rendering khusus untuk cut-audio.
            currentPlayingList = [];
            activeCustomPlaylistId = null;
        }

        updateActiveSongInUI();
        console.log("[DEBUG] Fungsi displayCategory selesai.");
    }

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            const category = button.dataset.category;
            console.log("Category button clicked:", category);

            displayCategory(category);
        });
    });


    if (categoryContentWrapper) {
        categoryContentWrapper.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollPos = categoryContentWrapper.scrollLeft;
                const wrapperWidth = categoryContentWrapper.offsetWidth;
                const activeIndex = Math.round(scrollPos / wrapperWidth);
                const newActiveCategoryName = categoryButtons[activeIndex] ? categoryButtons[activeIndex].dataset.category: null;

                if (newActiveCategoryName && newActiveCategoryName !== currentCategory) {
                    console.log(`[DEBUG] Scroll terdeteksi, kategori baru: ${newActiveCategoryName}`);
                    displayCategory(newActiveCategoryName);
                }
            },
                180);
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
        .then(registration => {
            console.log('Service worker terdaftar');
        })
        .catch(error => {
            console.error('Gagal mendaftarkan service worker', error);
        });
    } else {
        console.log('Service worker tidak didukung');
    }

}); //AKHIR DARI document.addEventListener('DOMContentLoaded')