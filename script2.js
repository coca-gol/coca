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
    //   const textToTranslateV8 = document.getElementById('textv8');
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
    const textToTranslateV21 = document.getElementById('textv21');
    const textToTranslateV22 = document.getElementById('textv22');
    const textToTranslateV23 = document.getElementById('textv23');
    const textToTranslateV24 = document.getElementById('textv24');
    const textToTranslateV25 = document.getElementById('textv25');
    const textToTranslateV26 = document.getElementById('textv26');
    const textToTranslateV27 = document.getElementById('textv27');

    const textToTranslateV000 = document.getElementById('textv000');
    const textToTranslateV001 = document.getElementById('textv001');
    const textToTranslateV002 = document.getElementById('textv002');
    const textToTranslateV003 = document.getElementById('textv003');
    const textToTranslateV004 = document.getElementById('textv004');
    const textToTranslateV005 = document.getElementById('textv005');
    const textToTranslateV006 = document.getElementById('textv006');
    const textToTranslateV007 = document.getElementById('textv007');
    const textToTranslateV008 = document.getElementById('textv008');
    const textToTranslateV009 = document.getElementById('textv009');


    const textToTranslateV1000 = document.getElementById('textv1000');
    const textToTranslateV1001 = document.getElementById('textv1001');
    const textToTranslateV1002 = document.getElementById('textv1002');
    const textToTranslateV1003 = document.getElementById('textv1003');
    const textToTranslateV1004 = document.getElementById('textv1004');
    const textToTranslateV1005 = document.getElementById('textv1005');
    const textToTranslateV1006 = document.getElementById('textv1006');
    const textToTranslateV1007 = document.getElementById('textv1007');
    const textToTranslateV1008 = document.getElementById('textv1008');
    const textToTranslateV1009 = document.getElementById('textv1009');
    const textToTranslateV1010 = document.getElementById('textv1010');
    const textToTranslateV1011 = document.getElementById('textv1011');
    const textToTranslateV1012 = document.getElementById('textv1012');
    const textToTranslateV1013 = document.getElementById('textv1013');
    const textToTranslateV1014 = document.getElementById('textv1014');
    const textToTranslateV1015 = document.getElementById('textv1015');
    const textToTranslateV1016 = document.getElementById('textv1016');
    const textToTranslateV1017 = document.getElementById('textv1017');
    const textToTranslateV1018 = document.getElementById('textv1018');
    const textToTranslateV1019 = document.getElementById('textv1019');
    const textToTranslateV1020 = document.getElementById('textv1020');
    const textToTranslateV1021 = document.getElementById('textv1021');
    const textToTranslateV1022 = document.getElementById('textv1022');
    const textToTranslateV1023 = document.getElementById('textv1023');
    const textToTranslateV1024 = document.getElementById('textv1024');
    const textToTranslateV1025 = document.getElementById('textv1025');
    const textToTranslateV1026 = document.getElementById('textv1026');
    const textToTranslateV1027 = document.getElementById('textv1027');
    const textToTranslateV1028 = document.getElementById('textv1028');
    const textToTranslateV1029 = document.getElementById('textv1029');

    const textToTranslateV2000 = document.getElementById('textv2000');
    const textToTranslateV2001 = document.getElementById('textv2001');
    const textToTranslateV2002 = document.getElementById('textv2002');
    const textToTranslateV2003 = document.getElementById('textv2003');
    const textToTranslateV2004 = document.getElementById('textv2004');


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
            //        textv8: "Musik Berdasarkan artis",
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
            textv20: "Artis :",
            textv21: "Album :",
            textv22: "Durasi :",
            textv23: "Ukuran file :",
            textv24: "Jalur file :",
            textv25: "perbesar",
            textv26: "Potong Audio",
            textv27: "Pilih berkas audio Anda, atur titik pemotongan awal dan akhir, lalu simpan hasilnya!",
            textv2000: "UNDUH & KONVERSI",
            textv2001: "hasil pencarian..",
            textv2002: "video",
            textv2003: "audio",
            textv2004: "Unduh video favorit Anda dari berbagai platform populer. Konversikan sesuai kebutuhan hanya dengan beberapa klik! Lalu simpan secara offline. Format audio MP3, serta format video lainnya untuk berbagai keperluan. Dukungan Multi-Platform: Pahami keragaman sumber video yang Anda sukai. Fitur ini mendukung pengunduhan video dari berbagai platform populer seperti:- YouTube- Facebook- Instagram- Dan masih banyak lagi. Proses sederhana: Cukup salin dan tempel tautan video (URL) ke kolom yang disediakan, dan biarkan sistem bekerja secara otomatis.",
            textv000: "FAQ",
            textv001: "SYARAT & KETENTUAN",
            textv002: "1. Informasi yang diKumpulkan Karena sifat aplikasi ini yang berfokus pada pengunaan offline. meminimalkan pengumpulan data pribadi. Berikut ini adalah informasi yang mungkin kami kumpulkan:",
            textv003: "2. Bagaimana layanan ini Menggunakan Informasi Anda, Data yang dikumpulkan digunakan secara eksklusif untuk tujuan berikut?",
            textv004: "3. Penjelasan tentang Izin. aplikasi memerlukan beberapa izin agar dapat berfungsi dengan baik. Berikut penjelasannya :",
            textv005: "4. Fokus Privasi pada Fitur Utama",
            textv006: "5. Keamanan Data & Pihak Ketiga, menerapkan langkah-langkah keamanan teknis yang wajar untuk melindungi data yang diproses. layanan ini tidak membagikan data pribadi Anda dengan pihak ketiga.",
            textv007: "6. Perubahan Kebijakan Privasi, layanan dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. aplikasi akan memberi tahu Anda tentang perubahan apa pun dengan mengeposkan Kebijakan Privasi baru di halaman ini atau melalui pemberitahuan dalam aplikasi !",
            textv008: "7. Hubungi Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, jangan ragu untuk menghubungi di [Alamat Email Dukungan].",

            textv1000: "akses seluruh koleksi musik Anda kapan pun dan di mana pun tanpa perlu khawatir tentang batasan data atau sinyal yang buruk. Simpan saja lagu Anda di dalam aplikasi dan nikmati mendengarkan dengan lancar. ( cut audio ) Potong Audio Sesuai Selera Anda Fitur pemotongan audio memberi Anda kendali penuh atas bagian favorit dari lagu apa pun. Ingin membuat nada dering unik dari chorus favorit Anda, atau sekadar mendengarkan intro yang ikonik? Dengan alat pemotong audio Anda dapat dengan mudah memilih segmen tertentu dari file audio dan menyimpannya secara terpisah. Presisi tinggi memastikan Anda mendapatkan potongan yang sempurna setiap saat.( downloader ) Unduh dan Simpan dalam Dua Format Populer Anda dapat memilih di antara dua format populer sesuai kebutuhan Anda :",
            textv1001: "MP3: Ideal untuk file audio yang ringkas dengan kualitas suara yang sangat baik. Sempurna untuk didengarkan di beberapa perangkat dan menghemat ruang penyimpanan.",
            textv1002: "MP4: Meskipun sering dikaitkan dengan video, format MP4 juga dapat menyimpan audio berkualitas tinggi. Ini sangat berguna jika Anda mengunduh konten yang mungkin memiliki metadata yang lebih kaya atau jika Anda berencana untuk menggunakannya dalam proyek video nanti. Dengan kombinasi pemutaran offline, pemotongan audio yang presisi, dan opsi pengunduhan yang fleksibel, pemutar musik ini adalah solusi terbaik untuk semua kebutuhan audio Anda.",
            textv1003: "komitmen untuk melindungi privasi dan keamanan data pribadi Anda. Kebijakan Privasi ini menjelaskan informasi apa yang dikumpulkan, bagaimana informasi tersebut digunakan, dan hak-hak yang Anda miliki terkait data Anda saat menggunakan aplikasi. Tujuan utama adalah menyediakan pemutar musik offline yang ringan. Transparansi adalah kuncinya, dan membuat Anda merasa aman saat menggunakan layanan ini.",
            textv1004: "• layanan ini TIDAK memindai, mengunggah, atau menyimpan koleksi musik pribadi Anda di perangkat Anda.",
            textv1005: "Informasi yang Tidak diKumpulkan Secara Aktif :",
            textv1006: "• layanan ini Tidak mengumpulkan informasi identitas pribadi seperti nama, alamat email, atau nomor telepon Anda, kecuali Anda secara sukarela menghubungi untuk dukungan teknis.",
            textv1007: "• Informasi yang Dikumpulkan Secara Otomatis (Data Non-Pribadi) :",
            textv1008: "• Data Diagnostik & Laporan Kerusakan: layanan ini mengumpulkan data teknis anonim saat aplikasi mengalami kesalahan atau kerusakan. Informasi ini mencakup jenis perangkat, versi sistem operasi, dan log kesalahan. Data ini penting untuk memperbaiki bug dan meningkatkan stabilitas.",
            textv1009: "• Data Penggunaan Fitur (Anonim): layanan dapat mengumpulkan data statistik anonim tentang fitur mana yang paling sering digunakan (misalnya, seberapa sering fitur audio trim digunakan). Ini membantu memahami kebutuhan pengguna dan berfokus pada pengembangan fitur yang relevan.",
            textv1010: "Informasi Spesifik Fitur :",
            textv1011: "• Fitur Pengunduh: Saat Anda menggunakan fitur ini, aplikasi perlu memproses URL yang Anda masukkan. layanan TIDAK menyimpan riwayat URL yang Anda unduh beserta identitas Anda. Namun, catatan teknis sementara dapat dibuat di server untuk memproses permintaan unduhan.",
            textv1012: "• Memastikan dan Memelihara Layanan: Agar semua fitur aplikasi berfungsi dengan baik.",
            textv1013: "• Meningkatkan Kualitas Aplikasi: Data diagnostik dan laporan kerusakan membantu tim kami mengidentifikasi dan memperbaiki masalah teknis dengan cepat.",
            textv1014: "• Memahami Kebutuhan Pengguna: Penggunaan data anonim  hanya digunakan untuk membuat keputusan pengembangan fitur di masa mendatang.",
            textv1015: "• Memproses permintaan Anda: URL yang dimasukkan ke fitur pengunduh digunakan untuk satu tujuan saja: mengunduh file yang Anda minta ke penyimpanan lokal perangkat Anda.",
            textv1016: "Izin Akses Penyimpanan (BACA/TULIS_PENYIMPANAN_EKSTERNAL):",
            textv1017: "Mengapa ini diperlukan? Izin ini diperlukan agar aplikasi dapat :",
            textv1018: "• Memindai dan menampilkan file musik di perangkat Anda.",
            textv1019: "• Simpan berkas audio yang telah Anda potong menggunakan fitur Potong Audio.",
            textv1020: "• Simpan file yang Anda unduh melalui fitur Pengunduh.",
            textv1021: "• Privasi Anda: Aplikasi ini hanya akan mengakses file audio. Kami tidak mengakses, mengubah, atau mengumpulkan foto, dokumen, atau file pribadi lainnya.",
            textv1022: "• Izin Akses Internet (INTERNET)",
            textv1023: "Mengapa ini diperlukan? Izin ini hanya diperlukan untuk :",
            textv1024: "• Fungsi Pengunduh untuk terhubung ke server dan mengunduh file dari URL yang Anda berikan.",
            textv1025: "• Kirim laporan kerusakan anonim.",
            textv1026: "• Pemutar Musik & Pemotong Audio Offline: Semua proses pemindaian, pemutaran, dan pemotongan audio terjadi sepenuhnya secara lokal di perangkat Anda (offline). Tidak ada file audio—baik asli maupun yang diedit—yang pernah diunggah atau dikirim ke server kami.",
            textv1027: "Fitur Pengunduh:",
            textv1028: "• layanan hanya bertindak sebagai perantara untuk mengunduh konten dari URL yang Anda berikan.",
            textv1029: "PENTING (Penafian Hak Cipta) Anda bertanggung jawab penuh atas konten yang Anda unduh. Pastikan Anda memiliki hak atau izin untuk mengunduh dan menyimpan konten tersebut. Aplikasi ini ditujukan untuk digunakan dengan konten bebas hak cipta atau konten yang Anda miliki secara sah. Pelanggaran hak cipta merupakan tanggung jawab pengguna.",

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
            //         textv8: "Music by artist",
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
            textv20: "Artist :",
            textv21: "Album :",
            textv22: "Duration :",
            textv23: "File size :",
            textv24: "File path :",
            textv25: "zoom",
            textv26: "Cut Audio",
            textv27: "Select your audio file, set the start and end cut points, then save the result!",

            textv2000: "DOWNOAD & CONVERT",
            textv2001: "search results..",
            textv2002: "video",
            textv2003: "audio",
            textv2004: "Download your favorite videos from various popular platforms. Convert them as needed in just a few clicks! Then save them offline. MP3 audio format, as well as other video formats for various purposes. Multi-Platform Support: Understand the diversity of video sources you enjoy. This feature supports downloading videos from various popular platforms such as:- YouTube- Facebook- Instagram- And many more. Simple process: Just copy and paste the video link (URL) into the field provided, and let the system do the work automatically.",

            textv000: "ABOUT MAKING",
            textv001: "TERMS & CONDITIONS",
            textv002: "1. Information Collected Due to the nature of this application which focuses on offline use. minimizes the collection of personal data. The following is the information that we may collect :",
            textv003: "2. How does this service Use Your Information, The data collected is used exclusively for the following purposes ?",
            textv004: "3. Explanation of Permissions. The application requires several permissions to function properly. Here is the explanation :",
            textv005: "4. Privacy Focus on Key Features :",
            textv006: "5. Data Security & Third Parties, implement reasonable technical security measures to protect the data processed. This service does not share your personal data with third parties.",
            textv007: "6. Changes to the Privacy Policy, the service may update this Privacy Policy from time to time. The application will notify you of any changes by posting the new Privacy Policy on this page or through an in-app notification !",
            textv008: "7. Contact If you have any questions about this Privacy Policy, please feel free to contact us at [Support Email Address].",


            textv1000: "access your entire music collection anytime, anywhere without having to worry about data caps or poor signal. Just save your songs within the app and enjoy seamless listening. ( cut audio ) Cut Audio to Your Taste The audio cutting feature gives you complete control over your favorite part of any song. Want to create a unique ringtone from your favorite chorus, or just listen to the iconic intro? With the audio cutter tool you can easily select a specific segment of an audio file and save it separately. High precision ensures you get the perfect cut every time. ( downloader ) Download and Save in Two Popular Formats You can choose between two popular formats as per your requirement:",
            textv1001: "MP3: Ideal for compact audio files with excellent sound quality. Perfect for listening on multiple devices and saving storage space.",
            textv1002: "MP4: While often associated with video, the MP4 format can also store high-quality audio. This is especially useful if you’re downloading content that may have richer metadata or if you plan to use it in a video project later. With a combination of offline playback, precise audio trimming, and flexible download options, this music player is the ultimate solution for all your audio needs.",
            textv1003: "commitment to protecting the privacy and security of your personal data. This Privacy Policy explains what information is collected, how it is used, and the rights you have regarding your data when using the app. The main goal is to provide a lightweight offline music player. Transparency is key, and making you feel safe when using the service.",
            textv1004: "• This service does NOT scan, upload, or store your personal music collection on your device.",
            textv1005: "Information Not Actively Collected :",
            textv1006: "• This service does not collect personally identifiable information such as your name, email address, or phone number, unless you voluntarily contact us for technical support.",
            textv1007: "Information Collected Automatically (Non-Personal Data) :",
            textv1008: "• Diagnostic Data & Crash Reports: This service collects anonymous technical data when the app experiences errors or crashes. This information includes device type, operating system version, and error logs. This data is important for fixing bugs and improving stability.",
            textv1009: "• Feature Usage Data (Anonymous): the service may collect anonymous statistical data about which features are used most frequently (e.g., how often the audio trim feature is used). This helps understand user needs and focus on developing relevant features.",
            textv1010: "• Feature-Specific Information",
            textv1011: "• Downloader Feature: When you use this feature, the application needs to process the URL you entered. The service does NOT store the history of the URLs you download along with your identity. However, a temporary technical log may be created on the server to process the download request.",
            textv10l2: "• Ensuring and Maintaining Services: To ensure all application features function properly.",
            textv1013: "• Improve Application Quality: Diagnostic data and crash reports to help quickly identify and fix technical issues.",
            textv1014: "• Understanding User Needs: Use of anonymous data is only used to make decisions about future feature development.",
            textv1015: "• Processing your request: The URL entered into the downloader feature is used for one purpose only: downloading the file you requested to your device's local storage.",
            textv1016: "• Storage Access Permission (READ/WRITE_EXTERNAL_STORAGE):.",
            textv1017: "Why is this necessary? This permission is necessary so that the app can :",
            textv1018: "• Scan and display music files on your device.",
            textv1019: "• Save audio files that you have trimmed using the Trim Audio feature.",
            textv1020: "• Save files that you download through the Downloader feature.",
            textv1021: "• Your Privacy: This app will only access audio files. The service does not access, modify, or collect photos, documents, or other personal files.",
            textv1022: "• Internet Access Permission (INTERNET)",
            textv1023: "Why is this necessary? This permission is only required for :",
            textv1024: "• The Downloader function to connect to the server and download files from the URL you provide.",
            textv1025: "• Send anonymous crash reports.",
            textv1026: "• Offline Music Player & Audio Cutter: All audio scanning, playing, and cutting processes happen entirely locally on your device (offline). No audio files—either original or edited—are ever uploaded or sent to our servers.",
            textv1027: "• Downloader Feature :",
            textv1028: "• the service only acts as an intermediary to download content from the URL you provide.",
            textv1029: "Important (Copyright Disclaimer) You are solely responsible for the content you download. Make sure you have the rights or permission to download and store the content. This app is intended for use with copyright-free content or content that you legally own. Copyright infringement is the responsibility of the user."

        },
        tgl: {
            textv01: "Pilipinas- (Filipina)",
            //         textv02: "Tema",
            textv03: "Trim Audio",
            textv04: "Downloader",
            textv05: "Sleep Timer",
            textv06: "Tanggalin ang Playlist",
            textv07: "Impormasyon",
            textv2: "Musika",
            textv3: "Mga Artista",
            textv4: "Mga Album",
            textv5: "Mga Playlist",
            textv6: "Mga artista",
            textv7: "I-scan ang Mga Folder ng Musika",
            //      textv8: "Musika ng Artist",
            //        textv9: "Musika ayon sa Album",
            //        textv10: "Aking Mga Playlist",
            textv11: "Mga Paboritong Kanta",
            textv12: "Walang Nagpapatugtog",
            textv10: "Walang Nagpapatugtog",
            textv13: "Walang Nagpapatugtog",
            textv14: "Impormasyon ng Kanta",
            textv15: "Gumawa ng Playlist bago",
            textv16: "Mga Artista",
            textv17: "PUMILI NG ORAS",
            textv18: "Sigurado ka bang gusto mong tanggalin ang playlist na ito?",
            textv19: "Pamagat:",
            textv20: "Artista :",
            textv21: "Album :",
            textv22: "Tagal :",
            textv23: "Laki ng file :",
            textv24: "Path ng file :",
            textv25: "mag-zoom",
            textv26: "Putulin ang audio",
            textv27: "Piliin ang iyong audio file, itakda ang mga start at end cut point, pagkatapos ay i-save ang resulta!",
            textv2000: "DOWNOAD & CONVERT",
            textv2001: "mga resulta ng paghahanap..",
            textv2002: "video",
            textv2003: "audio",
            textv2004: "I-download ang iyong mga paboritong video mula sa iba't ibang sikat na platform. I-convert ang mga ito kung kinakailangan sa ilang mga pag-click lamang! Pagkatapos ay i-save ang mga ito offline. MP3 audio format, pati na rin ang iba pang mga format ng video para sa iba't ibang layunin. Multi-Platform Support: Unawain ang pagkakaiba-iba ng mga pinagmumulan ng video na iyong tinatamasa. Sinusuportahan ng feature na ito ang pag-download ng mga video mula sa iba't ibang sikat na platform tulad ng:- YouTube- Facebook- Instagram- At marami pa. at hayaang awtomatikong gawin ng system ang gawain.",

            textv000: "TUNGKOL SA PAGGAWA",
            textv001: "TERMS & CONDITIONS",
            textv002: "1. Impormasyong Nakolekta Dahil sa katangian ng application na ito na nakatutok sa offline na paggamit. pinapaliit ang pangongolekta ng personal na data. Narito ang impormasyong maaari naming kolektahin:",
            textv003: "2. Paano ginagamit ng serbisyong ito ang Iyong Impormasyon, Ang data na nakolekta ay ginagamit ng eksklusibo para sa mga sumusunod na layunin?",
            textv004: "3. Paliwanag ng Mga Pahintulot. ang application ay nangangailangan ng ilang mga pahintulot upang gumana nang maayos. Narito ang paliwanag:",
            textv005: "4. Pagtuon sa Privacy sa Mga Pangunahing Tampok",
            textv006: "5. Seguridad ng Data at Mga Third Party, nagpapatupad ng mga makatwirang teknikal na hakbang sa seguridad upang protektahan ang naprosesong data. hindi ibinabahagi ng serbisyong ito ang iyong personal na data sa mga ikatlong partido.",
            textv007: "6. Mga pagbabago sa Patakaran sa Privacy, maaaring i-update ng serbisyo ang Patakaran sa Privacy na ito paminsan-minsan. aabisuhan ka ng application ng anumang mga pagbabago sa pamamagitan ng pag-post ng bagong Patakaran sa Privacy sa pahinang ito o sa pamamagitan ng isang in-app na abiso!",
            textv008: "7. Makipag-ugnayan Kung mayroon kang anumang mga katanungan tungkol sa Patakaran sa Privacy na ito, mangyaring huwag mag-atubiling makipag-ugnayan sa amin sa [Support Email Address].",

            textv1000: "i-access ang iyong buong koleksyon ng musika anumang oras, kahit saan nang hindi kailangang mag-alala tungkol sa mga caps ng data o mahinang signal. I-save lang ang iyong mga kanta sa loob ng app at i-enjoy ang tuluy-tuloy na pakikinig. ( cut audio ) I-cut ang Audio sa Iyong Panlasa Ang audio cutting feature ay nagbibigay sa iyo ng kumpletong kontrol sa paborito mong bahagi ng anumang kanta. Gusto mo bang lumikha ng natatanging ringtone mula sa iyong paboritong chorus, o makinig lang sa isang iconic na tool sa paggupit ng isang partikular na audio na madaling i-save ang iyong segment? Tinitiyak ng mataas na katumpakan na makukuha mo ang perpektong hiwa sa bawat oras ( downloader ) I-download at I-save sa Dalawang Popular na Format Maaari kang pumili sa pagitan ng dalawang sikat na format ayon sa iyong kinakailangan :",
            textv1001: "MP3: Tamang-tama para sa mga compact na audio file na may mahusay na kalidad ng tunog. Perpekto para sa pakikinig sa maraming device at pagtitipid ng espasyo sa imbakan.",
            textv1002: "MP4: Bagama't madalas na nauugnay sa mga video, ang format na MP4 ay maaari ding mag-imbak ng mataas na kalidad na audio. Ito ay lalong kapaki-pakinabang kung magda-download ka ng nilalaman na maaaring may mas mahusay na metadata o kung plano mong gamitin ito sa isang video project sa ibang pagkakataon. Gamit ang kumbinasyon ng offline na pag-playback, tumpak na audio trimming, at nababaluktot na mga opsyon sa pag-download, ang music player na ito ang pinakamahusay na solusyon para sa lahat ng iyong mga pangangailangan sa audio.",
            textv1003: "pangako sa pagprotekta sa privacy at seguridad ng iyong personal na data. Ipinapaliwanag ng Patakaran sa Privacy na ito kung anong impormasyon ang kinokolekta, kung paano ito ginagamit, at ang mga karapatan mo tungkol sa iyong data kapag ginagamit ang app. Ang pangunahing layunin ay magbigay ng magaan na offline na music player. Ang transparency ay susi, at ginagawa kang ligtas kapag ginagamit ang serbisyo",
            textv1004: "• HINDI ini-scan, ina-upload, o iniimbak ng serbisyong ito ang iyong personal na koleksyon ng musika sa iyong device.",
            textv1005: "Hindi Aktibong Nakolekta ang Impormasyon:",
            textv1006: "• ang serbisyong ito ay hindi nangongolekta ng personal na nakakapagpakilalang impormasyon gaya ng iyong pangalan, email address, o numero ng telepono, maliban kung kusang-loob kang makipag-ugnayan sa amin para sa teknikal na suporta.",
            textv1007: "• Awtomatikong Kinokolektang Impormasyon (Di-Personal na Data):",
            textv1008: "• Diagnostic Data at Mga Ulat ng Pag-crash: ang serbisyong ito ay nangongolekta ng hindi kilalang teknikal na data kapag ang app ay nakaranas ng isang error o nag-crash. Kasama sa impormasyong ito ang uri ng device, bersyon ng operating system, at mga log ng error. Ang data na ito ay mahalaga para sa pag-aayos ng mga bug at pagpapabuti ng katatagan.",
            textv1009: "• Data sa Paggamit ng Feature (Anonymous): maaaring mangolekta ang serbisyo ng anonymous na istatistikal na data tungkol sa kung aling mga feature ang pinakamadalas na ginagamit (halimbawa, kung gaano kadalas ginagamit ang feature na audio trim). Nakakatulong ito na maunawaan ang mga pangangailangan ng user at tumuon sa pagbuo ng mga nauugnay na feature.",
            textv1010: "Tiyak na Impormasyon sa Tampok:",
            textv1011: "• Feature ng Downloader: Kapag ginamit mo ang feature na ito, kailangang iproseso ng app ang URL na iyong ipinasok. HINDI nag-iimbak ang serbisyo ng kasaysayan ng mga URL na iyong dina-download kasama ng iyong pagkakakilanlan. Gayunpaman, maaaring gumawa ng pansamantalang teknikal na mga log sa server upang iproseso ang mga kahilingan sa pag-download.",
            textv1012: "• Pagtiyak at Pagpapanatili ng Serbisyo: Upang matiyak na gumagana nang maayos ang lahat ng feature ng app.",
            textv1013: "• Pagpapabuti ng Kalidad ng App: Nakakatulong ang diagnostic data at mga ulat ng pag-crash sa aming team na mabilis na matukoy at ayusin ang mga teknikal na isyu.",
            textv1014: "• Pag-unawa sa Mga Pangangailangan ng User: Ang anonymous na data ay ginagamit lamang upang gumawa ng mga desisyon tungkol sa pagbuo ng tampok sa hinaharap.",
            textv1015: "• Pinoproseso ang iyong kahilingan: Ang URL na inilagay sa feature ng downloader ay ginagamit para sa isang layunin lamang: upang i-download ang file na iyong hiniling sa lokal na storage ng iyong device.",
            textv1016: "Pahintulot sa Pag-access sa Storage (READ/WRITE_EXTERNAL_STORAGE):",
            textv1017: "Bakit ito kinakailangan? Ang pahintulot na ito ay kinakailangan upang ang app ay maaaring:",
            textv1018: "• I-scan at ipakita ang mga file ng musika sa iyong device.",
            textv1019: "• I-save ang mga audio file na iyong na-trim gamit ang feature na Trim Audio.",
            textv1020: "• I-save ang mga file na iyong dina-download sa pamamagitan ng tampok na Downloader.",
            textv1021: "• Ang Iyong Privacy: Maa-access lang ng app na ito ang mga audio file. Hindi namin ina-access, binabago, o kinokolekta ang mga larawan, dokumento, o iba pang personal na file.",
            textv1022: "• Pahintulot sa Internet Access (INTERNET)",
            textv1023: "Bakit ito kailangan? Ang pahintulot na ito ay kailangan lamang para sa:",
            textv1024: "• Downloader function upang kumonekta sa server at mag-download ng mga file mula sa URL na iyong ibinigay.",
            textv1025: "• Magpadala ng mga anonymous na ulat ng pag-crash.",
            textv1026: "• Offline Music Player at Audio Cutter: Lahat ng audio scanning, play, at cutting process ay ganap na nangyayari nang lokal sa iyong device (offline). Walang mga audio file—orihinal man o na-edit—ang na-upload o ipinadala sa aming mga server.",
            textv1027: "Features Downloader:",
            textv1028: "• ang serbisyo ay gumaganap lamang bilang isang tagapamagitan upang mag-download ng nilalaman mula sa URL na iyong ibinigay.",
            textv1029: "Mahalaga (Copyright Disclaimer) Ikaw ang tanging may pananagutan para sa nilalaman na iyong dina-download. Tiyaking mayroon kang karapatan o pahintulot na i-download at iimbak ang nilalaman. Ang application na ito ay inilaan para sa paggamit ng walang copyright na nilalaman o nilalaman na legal mong pagmamay-ari. Ang paglabag sa copyright ay responsibilidad ng user."

        },
        viet: {
            textv01: "Tiếng Việt- (Vietnam)",
            //          textv02: "Giao diện",
            textv03: "Cắt âm thanh",
            textv04: "Trình tải xuống",
            textv05: "Hẹn giờ ngủ",
            textv06: "Xóa danh sách phát",
            textv07: "Thông tin",
            textv2: "Nhạc",
            textv3: "Nghệ sĩ",
            textv4: "Album",
            textv5: "Danh sách phát",
            textv6: "Nghệ sĩ",
            textv7: "Quét thư mục nhạc",
            //        textv8: "Nhạc theo nghệ sĩ",
            //         textv9: "Nhạc theo album",
            //       textv10: "Danh sách phát của tôi",
            textv11: "Bài hát yêu thích",
            textv12: "Hiện không có bài hát nào đang phát",
            textv10: "Hiện không có bài hát nào đang phát",
            textv13: "Hiện không có bài hát nào đang phát",
            textv14: "thông tin bài hát",
            textv15: "tạo danh sách phát mới",
            textv16: "Nghệ sĩ",
            textv17: "chọn thời gian",
            textv18: "Bạn có chắc chắn muốn xóa danh sách phát này không?",
            textv19: "Tiêu đề :",
            textv20: "Nghệ sĩ :",
            textv21: "Album :",
            textv22: "Thời lượng :",
            textv23: "Kích thước tệp :",
            textv24: "Đường dẫn tệp :",
            textv25: "phóng",
            textv26: "Cắt âm thanh",
            textv27: "Chọn tệp âm thanh của bạn, đặt điểm cắt bắt đầu và kết thúc, sau đó lưu kết quả!",

            textv000: "GIỚI THIỆU VỀ VIỆC LÀM",
            textv001: "ĐIỀU KHOẢN & ĐIỀU KIỆN",
            textv002: "1. Thông tin được thu thập Do bản chất của ứng dụng này tập trung vào việc sử dụng ngoại tuyến. giảm thiểu việc thu thập dữ liệu cá nhân. Sau đây là thông tin chúng tôi có thể thu thập:",
            textv003: "2. Dịch vụ này sử dụng thông tin của bạn như thế nào, dữ liệu được thu thập chỉ được sử dụng cho các mục đích sau?",
            textv004: "3. Giải thích về quyền. ứng dụng yêu cầu một số quyền để hoạt động bình thường. Sau đây là giải thích:",
            textv005: "4. Quyền riêng tư tập trung vào các tính năng chính",
            textv006: "5. Bảo mật dữ liệu & Bên thứ ba, triển khai các biện pháp bảo mật kỹ thuật hợp lý để bảo vệ dữ liệu được xử lý. dịch vụ này không chia sẻ dữ liệu cá nhân của bạn với bên thứ ba.",
            textv007: "6. Thay đổi Chính sách quyền riêng tư, dịch vụ có thể cập nhật Chính sách quyền riêng tư này theo thời gian. ứng dụng sẽ thông báo cho bạn về bất kỳ thay đổi nào bằng cách đăng Chính sách quyền riêng tư mới trên trang này hoặc thông qua ứng dụng thông báo!",
            text008: "7. Liên hệ Nếu bạn có bất kỳ câu hỏi nào về Chính sách bảo mật này, vui lòng liên hệ với chúng tôi theo địa chỉ [Địa chỉ email hỗ trợ].",

            textv2000: "TẢI XUỐNG & CHUYỂN ĐỔI",
            textv2001: "kết quả tìm kiếm..",
            textv2002: "video",
            textv2003: "âm thanh",
            textv2004: "Tải xuống video yêu thích của bạn từ nhiều nền tảng phổ biến. Chuyển đổi chúng khi cần chỉ với vài cú nhấp chuột! Sau đó lưu chúng ngoại tuyến. Định dạng âm thanh MP3, cũng như các định dạng video khác cho nhiều mục đích khác nhau. Hỗ trợ đa nền tảng: Hiểu được sự đa dạng của các nguồn video bạn yêu thích. Tính năng này hỗ trợ tải xuống video từ nhiều nền tảng phổ biến như: YouTube, Facebook, Instagram, Và nhiều nền tảng khác. Quy trình đơn giản: Chỉ cần sao chép và dán liên kết video (URL) vào trường được cung cấp và để hệ thống tự động thực hiện công việc.",

            textv1000: "truy cập toàn bộ bộ sưu tập nhạc của bạn mọi lúc, mọi nơi mà không phải lo lắng về giới hạn dữ liệu hoặc tín hiệu kém. Chỉ cần lưu bài hát của bạn trong ứng dụng và tận hưởng việc nghe nhạc liền mạch. (cắt âm thanh) Cắt âm thanh theo sở thích của bạn Tính năng cắt âm thanh cho phép bạn kiểm soát hoàn toàn phần yêu thích của mình trong bất kỳ bài hát nào. Bạn muốn tạo nhạc chuông độc đáo từ điệp khúc yêu thích của mình hoặc chỉ nghe phần giới thiệu mang tính biểu tượng? Với công cụ cắt âm thanh, bạn có thể dễ dàng chọn một phân đoạn cụ thể của tệp âm thanh và lưu riêng. Độ chính xác cao đảm bảo bạn luôn có được bản cắt hoàn hảo. (trình tải xuống) Tải xuống và lưu ở hai định dạng phổ biến Bạn có thể chọn giữa hai định dạng phổ biến theo yêu cầu của mình :",
            textv1001: "MP3: Lý tưởng cho các tệp âm thanh nhỏ gọn với chất lượng âm thanh tuyệt vời. Hoàn hảo để nghe trên nhiều thiết bị và tiết kiệm dung lượng lưu trữ.",
            textv1002: "MP4: Mặc dù thường được liên kết với video, định dạng MP4 cũng có thể lưu trữ âm thanh chất lượng cao. Định dạng này đặc biệt hữu ích nếu bạn tải xuống nội dung có thể có siêu dữ liệu phong phú hơn hoặc nếu bạn có kế hoạch sử dụng nội dung đó trong dự án video sau này. Với sự kết hợp giữa phát lại ngoại tuyến, cắt âm thanh chính xác và các tùy chọn tải xuống linh hoạt, trình phát nhạc này là giải pháp tối ưu cho mọi nhu cầu âm thanh của bạn.",
            textv1003: "cam kết bảo vệ quyền riêng tư và bảo mật dữ liệu cá nhân của bạn. Chính sách bảo mật này giải thích thông tin nào được thu thập, cách sử dụng thông tin đó và các quyền bạn có liên quan đến dữ liệu của mình khi sử dụng ứng dụng. Mục tiêu chính là cung cấp trình phát nhạc ngoại tuyến nhẹ. Minh bạch là chìa khóa và giúp bạn cảm thấy an toàn khi sử dụng dịch vụ.",
            textv1004: "• dịch vụ này KHÔNG quét, tải lên hoặc lưu trữ bộ sưu tập nhạc cá nhân của bạn trên thiết bị của bạn.",
            textv1005: "Thông tin không được thu thập chủ động:",
            textv1006: "• dịch vụ này không thu thập thông tin nhận dạng cá nhân như tên, địa chỉ email hoặc số điện thoại của bạn, trừ khi bạn tự nguyện liên hệ với chúng tôi để được hỗ trợ kỹ thuật.",
            textv1007: "• Tự động thu thập Thông tin (Dữ liệu phi cá nhân):",
            textv1008: "• Dữ liệu chẩn đoán & Báo cáo sự cố: dịch vụ này thu thập dữ liệu kỹ thuật ẩn danh khi ứng dụng gặp lỗi hoặc sự cố. Thông tin này bao gồm loại thiết bị, phiên bản hệ điều hành và nhật ký lỗi. Dữ liệu này rất quan trọng để sửa lỗi và cải thiện tính ổn định.",
            textv1009: "• Dữ liệu sử dụng tính năng (Ẩn danh): dịch vụ có thể thu thập dữ liệu thống kê ẩn danh về những tính năng được sử dụng thường xuyên nhất (ví dụ: tần suất sử dụng tính năng cắt âm thanh). Điều này giúp hiểu được nhu cầu của người dùng và tập trung vào việc phát triển các tính năng có liên quan.",
            textv1010: "Thông tin cụ thể về tính năng:",
            textv1011: "• Tính năng tải xuống: Khi bạn sử dụng tính năng này, ứng dụng cần xử lý URL bạn nhập. dịch vụ KHÔNG lưu trữ lịch sử các URL bạn tải xuống cùng với danh tính của bạn. Tuy nhiên, nhật ký kỹ thuật tạm thời có thể được tạo trên máy chủ để xử lý các yêu cầu tải xuống.",
            textv1012: "• Đảm bảo và duy trì dịch vụ: Để đảm bảo rằng tất cả các tính năng của ứng dụng hoạt động bình thường.",
            textv1013: "• Cải thiện chất lượng ứng dụng: Dữ liệu chẩn đoán và báo cáo sự cố giúp nhóm của chúng tôi nhanh chóng xác định và khắc phục các sự cố kỹ thuật.",
            textv1014: "• Hiểu nhu cầu của người dùng: Dữ liệu ẩn danh chỉ được sử dụng để đưa ra quyết định về việc phát triển tính năng trong tương lai.",
            textv1015: "• Xử lý yêu cầu của bạn: URL được nhập vào tính năng tải xuống chỉ được sử dụng cho một mục đích duy nhất: tải tệp bạn yêu cầu xuống bộ nhớ cục bộ của thiết bị.",
            textv1016: "Quyền truy cập bộ nhớ (ĐỌC/GHI_BỘ NHỚ NGOÀI):",
            textv1017: "Tại sao điều này lại cần thiết? Quyền này là bắt buộc để ứng dụng có thể:",
            textv1018: "• Quét và hiển thị các tệp nhạc trên thiết bị của bạn.",
            textv1019: "• Lưu các tệp âm thanh mà bạn đã cắt bằng Trim Audio tính năng.",
            textv1020: "• Lưu các tệp bạn tải xuống bằng Trình tải xuống tính năng Trim Audio.",
            textv1021: "• Quyền riêng tư của bạn: Ứng dụng này chỉ truy cập các tệp âm thanh. Chúng tôi không truy cập, sửa đổi hoặc thu thập ảnh, tài liệu hoặc các tệp cá nhân khác.",
            textv1022: "• Quyền truy cập Internet (INTERNET)",
            textv1023: "Tại sao cần phải có quyền này? Quyền này chỉ cần thiết cho:",
            textv1024: "• Chức năng tải xuống để kết nối với máy chủ và tải xuống các tệp từ URL mà bạn cung cấp.",
            textv1025: "• Gửi báo cáo sự cố ẩn danh.",
            textv1026: "• Trình phát nhạc ngoại tuyến & Trình cắt âm thanh: Tất cả các quy trình quét, phát và cắt âm thanh đều diễn ra hoàn toàn cục bộ trên thiết bị của bạn (ngoại tuyến). Không có tệp âm thanh nào—dù là bản gốc hay đã chỉnh sửa—được tải lên hoặc gửi đến máy chủ của chúng tôi.",
            textv1027: "Tính năng của Trình tải xuống:",
            textv1028: "• dịch vụ chỉ đóng vai trò là trung gian để tải xuống nội dung từ URL bạn cung cấp.",
            textv1029: "Quan trọng (Tuyên bố miễn trừ bản quyền) Bạn hoàn toàn chịu trách nhiệm về nội dung bạn tải xuống. Đảm bảo bạn có quyền hoặc được phép tải xuống và lưu trữ nội dung. Ứng dụng này dành cho mục đích sử dụng với nội dung không có bản quyền hoặc nội dung mà bạn sở hữu hợp pháp. Vi phạm bản quyền là trách nhiệm của người dùng."
        },
        jwa: {
            textv01: "jawa",
            //          textv02: "Tema",
            textv03: "Pangkas Audio",
            textv04: "Ngunduh",
            textv05: "wektu turu",
            textv06: "Busak Daftar Lagu",
            textv07: "Informasi",
            textv2: "Musik",
            textv3: "Artis",
            textv4: "Album",
            textv5: "Daftar lagu",
            textv6: "Artis",
            textv7: "Tambahke Musik",
            //         textv8: "Musik dening Artis",
            //         textv9: "Musik miturut Album",
            //       textv10: "Daftar laguku",
            textv11: "Lagu Favorit",
            textv12: "Ora ana lagu sing lagi diputer",
            textv10: "Ora ana lagu sing lagi diputer",
            textv13: "Ora ana lagu sing lagi diputer",
            textv14: "Informasi Lagu",
            textv15: "Gawe daftar lagu anyar",
            textv16: "Artis",
            textv17: "PILEH WEKTU",
            textv18: "Apakah Anda yakin ingin menghapus daftar putar ini?",
            textv19: "Musik",
            textv25: "perbesar",
            textv26: "Pangkas Audio",
            textv27: "Pilih file audio, atur titik wiwitan lan pungkasan, banjur simpen hasile!",

            textv2000: "UNDUH & KONVERSI",
            textv2001: "asil telusuran..",
            textv2002: "video",
            textv2003: "audio",
            textv2004: "Ngunduh video favorit saka macem-macem platform populer. Ngonversi video kaya sing dibutuhake mung sawetara klik! Banjur simpen ing offline. Format audio MP3, uga format video liyane kanggo macem-macem tujuan. Dhukungan Multi-Platform: Ngerti macem-macem sumber video sing sampeyan senengi. Fitur iki ndhukung ndownload video saka macem-macem platform populer kayata: - YouTube- Facebook- Instagram- Lan akeh liyane. lan supaya sistem nindakake karya kanthi otomatis.",

            textv000: "FAQ",
            textv001: "SYARAT & KETENTUAN",
            textv002: "1. Informasi sing Dikumpulake. Amarga aplikasi iki fokus ing offline, kita nyilikake pangumpulan data pribadhi. Iki informasi sing bisa diklumpukake:",
            textv003: "2. Kepiye Layanan Iki Gunakake Informasi Sampeyan? Data sing diklumpukake digunakake khusus kanggo tujuan ing ngisor iki?",
            textv004: "3. Panjelasan Idin. Aplikasi mbutuhake sawetara ijin supaya bisa mlaku kanthi bener. Iki panjelasan:",
            textv005: "4. Fokus Privasi ing Fitur Utama",
            textv006: "5. Keamanan Data & Pihak Katelu. Kita ngetrapake langkah-langkah keamanan teknis sing cukup kanggo nglindhungi data sing diproses. Layanan iki ora nuduhake data pribadhi karo pihak katelu.",
            textv007: "6. Owah-owahan Kebijakan Privasi. Layanan bisa nganyari Kebijakan Privasi iki saka wektu kanggo wektu. Aplikasi bakal menehi kabar babagan owah-owahan kanthi ngirim Kebijakan Privasi anyar ing kaca iki utawa liwat kabar ing-app!",
            textv008: "7. Hubungi Yen sampeyan duwe pitakon babagan Kebijakan Privasi iki, hubungi kita ing [Alamat Email Dhukungan].",
            textv1000: "Akses kabeh koleksi musik kapan wae, ing ngendi wae tanpa kuwatir babagan tutup data utawa sinyal sing kurang. Cukup simpen lagu ing app lan seneng ngrungokake kanthi lancar. (potong audio) Cut Audio kanggo Rasa Sampeyan Fitur motong audio menehi kontrol lengkap ing bagean favorit saka lagu apa wae. Pengin nggawe nada dering unik saka paduan suara favorit, utawa mung ngrungokake intro pilihan lan bagean audio sing bisa dipisahake kanthi gampang? Presisi dhuwur njamin sampeyan entuk potongan sing sampurna saben-saben (downloader) Ngundhuh lan Simpen ing Rong Format Popular Sampeyan bisa milih ing antarane rong format populer sing cocog karo kabutuhan:",
            tdxtv1001: "MP3: Cocog kanggo file audio kompak kanthi kualitas swara sing apik banget. Sampurna kanggo ngrungokake ing macem-macem piranti lan ngirit ruang panyimpenan.",
            textv1002: "MP4: Sanajan asring digandhengake karo video, format MP4 uga bisa nyimpen audio kanthi kualitas dhuwur. Iki utamané migunani yen sampeyan ndownload konten sing bisa uga duwe metadata sing luwih sugih utawa yen sampeyan pengin nggunakake ing proyek video mengko. Kanthi kombinasi puter maneh puter maneh Offline, pemotongan audio sing tepat, lan pilihan download sing fleksibel nggawe pamuter musik iki minangka solusi sing sampurna kanggo kabeh kabutuhan audio.",

            textv1003: "Komitmen kanggo nglindhungi privasi lan keamanan data pribadhi. Kabijakan Privasi iki nerangake informasi apa sing diklumpukake, carane digunakake, lan hak-hak sing sampeyan duwe babagan data nalika nggunakake app. Tujuan utamane yaiku nyedhiyakake pamuter musik offline sing entheng. Transparansi minangka kunci, lan nggawe sampeyan rumangsa aman nalika nggunakake layanan iki.",
            textv1004: "• Layanan iki ora mindai, ngunggah, utawa nyimpen koleksi musik pribadi ing piranti sampeyan.",
            textv1005: "Informasi Ora Dikumpulake Aktif:",
            textv1006: "• Layanan iki ora ngumpulake informasi sing bisa dingerteni pribadhi kayata jeneng, alamat email, utawa nomer telpon, kajaba sampeyan kanthi sukarela ngubungi dhukungan teknis.",

            textv1007: "• Informasi sing Dikumpulake kanthi Otomatis (Data Non-Pribadi):",

            textv1008: "• Data Diagnostik & Laporan Kacilakan: Layanan iki ngumpulake data teknis anonim nalika app ngalami kesalahan utawa kacilakan. Informasi iki kalebu jinis piranti, versi sistem operasi, lan log kesalahan. Data iki penting kanggo ndandani kewan omo lan ningkatake stabilitas.",
            textv1009: "• Data Panggunaan Fitur (Anonim): Layanan bisa ngumpulake data statistik anonim babagan fitur sing paling kerep digunakake (contone, sepira kerepe fitur trim audio digunakake). Iki mbantu kita ngerti kabutuhan pangguna lan fokus ing ngembangake fitur sing cocog.",
            textv1010: "Informasi Spesifik Fitur:",
            textv1011: "• Fitur Downloader: Nalika sampeyan nggunakake fitur iki, app kudu ngolah URL sing sampeyan lebokake. Layanan ora nyimpen riwayat URL sing diundhuh utawa identitas sampeyan. Nanging, log teknis sementara bisa uga digawe ing server kanggo ngolah panjaluk download.",
            textv1012: "• Njamin lan Njaga Layanan: Kanggo mesthekake kabeh fitur app bisa mlaku kanthi bener.",
            textv1013: "• Ngapikake Kualitas Aplikasi: Data diagnostik lan laporan kacilakan mbantu tim ngenali lan ndandani masalah teknis kanthi cepet.",
            textv1014: "• Ngerteni Kebutuhan Pangguna: Data anonim mung digunakake kanggo nggawe keputusan babagan pangembangan fitur ing mangsa ngarep.",
            textv1015: "• Ngolah panjalukan sampeyan: URL sing dilebokake ing fitur ngundhuh mung digunakake kanggo siji waé: ngundhuh file sing dijaluk menyang panyimpenan lokal piranti.",
            textv1016: "Izin Akses Panyimpenan (WACANA/WRITE_EXTERNAL_STORAGE):",
            textv1017: "Napa iki perlu? Ijin iki dibutuhake supaya app bisa:",
            textv18: "• Pindai lan deleng file musik ing piranti sampeyan.",
            textv19: "• Simpen file audio sing wis dipotong nganggo fitur Trim Audio.",
            textv1020: "• Simpen file sing di unduh nggunakake fitur Downloader utowo pengunduhan.",
            textv1021: "• Privasi Panjenengan: Aplikasi iki mung bakal ngakses file audio. Kita ora ngakses, ngowahi, utawa ngumpulake foto, dokumen, utawa file pribadi liyane.",
            textv1022: "• Izin Akses Internet (INTERNET)",
            textv1023: "Napa iki dibutuhake? Ijin iki mung dibutuhake kanggo:",
            textv1024: "• Fungsi pangundhuh kanggo nyambung menyang server lan ngundhuh file saka URL sing diwenehake.",
            textv1025: "• Kirimi laporan kacilakan anonim.",
            textv1026: "• Pamuter Musik Offline & Pemotong Audio: Kabeh proses pemindaian, puter maneh, lan pemotongan audio dumadi sacara lokal ing piranti sampeyan (offline). Ora ana file audio—sing asli utawa sing wis diowahi—sing tau diunggah utawa dikirim menyang server kita.",
            textv1027: "Fitur Pengunduhan:",
            textv1028: "• Layanan mung tumindak minangka perantara kanggo ngundhuh konten saka URL sing diwenehake.",
            textv1029: "Penting (Penyangkalan Hak Cipta) Sampeyan mung tanggung jawab kanggo konten sing diundhuh. Mangga priksa manawa sampeyan duwe hak utawa ijin kanggo ngundhuh lan nyimpen konten kasebut. Aplikasi iki dimaksudake kanggo nggunakake konten utawa konten sing bebas hak cipta sing sampeyan duweni kanthi sah. Pelanggaran hak cipta dadi tanggung jawab pangguna."
        },
        jpg: {
            textv01: "日本- (Japan)",
            //            textv02: "テーマ",
            textv03: "音声をカット",
            textv04: "ダウンラダー",
            textv05: "スリープタイマー",
            textv06: "プレイリストを削除",
            textv07: "情報",
            textv2: "音楽",
            textv3: "アーティスト",
            textv4: "アルバム",
            textv5: "プレイリスト",
            textv6: "アーティスト",
            textv7: "音楽フォルダをスキャン",
            //       textv8: "アーティストによる音楽",
            //        textv9: "アルバム別の音楽",
            //       textv10: "私のプレイリスト",
            textv11: "好きな曲",
            textv12: "曲が再生されていません",
            textv10: "曲が再生されていません",
            textv13: "曲が再生されていません",
            textv14: "曲情報",
            textv15: "新しいプレイリストを作成する",
            textv16: "アーティスト",
            textv17: "時間を選択",
            textv18: "このプレイリストを削除してもよろしいですか?",
            textv19: "タイトル :",
            textv20: "アーティスト :",
            textv21: "アルバム :",
            textv22: "再生時間 :",
            textv23: "ファイルサイズ :",
            textv24: "ファイルパス :",
            textv25: "ズーム",
            textv26: "音声をカット",
            textv27: "オーディオ ファイルを選択し、開始と終了のカット ポイントを設定して、結果を保存します。",

            textv2000: "ダウンロード＆変換",
            textv2001: "検索結果",
            textv2002: "動画",
            textv2003: "音声",
            textv2004: "様々な人気プラットフォームからお気に入りの動画をダウンロードできます。数回クリックするだけで、必要に応じて変換できます！ダウンロード後はオフラインで保存できます。MP3オーディオ形式に加え、様々な用途に対応する動画形式にも対応しています。マルチプラットフォームサポート：様々な動画ソースに対応しています。この機能は、YouTube、Facebook、Instagramなど、様々な人気プラットフォームからの動画ダウンロードをサポートしています。簡単な手順：動画リンク（URL）をコピーして、指定されたフィールドに貼り付けるだけで、システムが自動的に処理を行います。",

            textv000: "製造について",
            textv001: "利用規約",
            textv002: "1. 収集される情報 このアプリケーションはオフラインでの使用に重点を置いているため、個人データの収集を最小限に抑えています。収集される可能性のある情報は以下のとおりです。",
            textv003: "2. このサービスはお客様の情報をどのように使用しますか? 収集されたデータは以下の目的にのみ使用されます。",
            textv004: "3. 権限の説明。アプリケーションが正常に動作するために、いくつかの権限が必要です。以下に説明します",
            textv005: "4. プライバシーの主要機能への重点",
            textv006: "5. データセキュリティと第三者：処理されたデータを保護するために、合理的な技術的セキュリティ対策を実施します。本サービスは、お客様の個人データを第三者と共有することはありません。",
            textv007: "6. プライバシーポリシーの変更。本サービスは、このプライバシーポリシーを随時更新することがあります。アプリケーションは、このページに新しいプライバシーポリシーを掲載するか、アプリ内通知を通じて変更を通知します。",
            textv008: "7. お問い合わせ 本プライバシーポリシーについてご質問がある場合は、[サポートメールアドレス]までお気軽にお問い合わせください。",
            textv1000: "データ上限や信号不良を心配することなく、いつでもどこでもあなたの音楽コレクション全体にアクセスできます。アプリ内で曲を保存するだけで、シームレスなリスニングを楽しめます。 (オーディオをカット) 好みに合わせてオーディオをカット オーディオカット機能を使用すると、曲のお気に入りの部分を完全に制御できます。お気に入りのコーラスからユニークな着信音を作成したり、象徴的なイントロだけを聞きたいですか？オーディオカッターツールを使用すると、オーディオファイルの特定のセグメントを簡単に選択し、個別に保存できます。高精度により、毎回完璧なカットが得られます。 (ダウンローダー) 2つの一般的な形式でダウンロードして保存 要件に応じて、2つの一般的な形式から選択できます。",
            textv1001: "MP3：優れた音質を保ちながらコンパクトなオーディオファイルに最適です。複数のデバイスで再生でき、ストレージ容量を節約するのに最適です。",
            textv1002: "MP4：動画で使われることが多いMP4形式ですが、高音質のオーディオも保存できます。これは、メタデータが豊富なコンテンツをダウンロードする場合や、後で動画プロジェクトで使用する予定がある場合に特に便利です。オフライン再生、正確なオーディオトリミング、柔軟なダウンロードオプションを備えたこの音楽プレーヤーは、あらゆるオーディオニーズに応える究極のソリューションです。",
            textv1003: "お客様の個人データのプライバシーとセキュリティ保護への取り組み。本プライバシーポリシーは、アプリの使用時に収集される情報、その使用方法、およびお客様のデータに関する権利について説明しています。主な目標は、軽量なオフライン音楽プレーヤーを提供することです。透明性が鍵であり、サービスをご利用いただく際に安心していただけるよう努めています。",
            textv1004: "• このサービスでは、個人の音楽コレクションをデバイス上でスキャン、アップロード、または保存することはありません。",
            textv1005: "積極的に収集されない情報 :",
            textv1006: "• このサービスでは、お客様が自発的に技術サポートのために当社に連絡しない限り、お客様の名前、電子メール アドレス、電話番号などの個人を特定できる情報を収集しません。",
            textv1007: "• 自動的に収集される情報（非個人データ）:",
            textv1008: "• 診断データとクラッシュレポート：このサービスは、アプリにエラーやクラッシュが発生した際に匿名の技術データを収集します。収集される情報には、デバイスの種類、オペレーティングシステムのバージョン、エラーログが含まれます。これらのデータは、バグの修正や安定性の向上に重要です。",
            textv1009: "• 機能使用状況データ（匿名）：本サービスは、どの機能が最も頻繁に使用されているか（例：オーディオトリミング機能の使用頻度）に関する匿名の統計データを収集する場合があります。これは、ユーザーのニーズを把握し、関連機能の開発に注力する上で役立ちます。",
            textv1010: "機能固有の情報 :",
            textv1011: "• ダウンローダー機能：この機能を使用する場合、アプリケーションは入力したURLを処理する必要があります。本サービスは、ダウンロードしたURLの履歴をお客様のIDと共に保存することはありません。ただし、ダウンロードリクエストを処理するために、一時的な技術ログがサーバー上に作成される場合があります。",
            textv1012: "• サービスの確保と維持:すべてのアプリケーション機能が適切に機能することを保証する",
            textv1013: "• アプリの品質を向上: 診断データとクラッシュ レポートは、当社のチームが技術的な問題を迅速に特定して修正するのに役立ちます。",
            textv1014: "• ユーザーのニーズを理解する: 匿名データは、将来の機能開発の決定を行うためにのみ使用されます。",
            text1015: "• リクエストの処理: ダウンローダー機能に入力された URL は、要求したファイルをデバイスのローカル ストレージにダウンロードするという 1 つの目的にのみ使用されます。",
            textv1016: "ストレージアクセス権限（READ/WRITE_EXTERNAL_STORAGE）:",
            textv1017: "なぜこれが必要なのでしょうか？この許可はアプリが :",
            textv1018: "• デバイス上の音楽ファイルをスキャンして表示します。",
            textv1019: "• 「オーディオのトリム」機能を使用してトリミングしたオーディオ ファイルを保存します。",
            textv1020: "• ダウンローダー機能を使用してダウンロードしたファイルを保存します。",
            textv1021: "• プライバシー：このアプリは音声ファイルのみにアクセスします。写真、文書、その他の個人ファイルにアクセスしたり、変更したり、収集したりすることはありません。",
            textv1022: "• インターネットアクセス許可（インターネット）",
            textv1023: "なぜこれが必要なのですか？この許可は次の場合にのみ必要です:",
            textv1024: "• サーバーに接続し、指定した URL からファイルをダウンロードするダウンローダー機能。",
            textv1025: "匿名のクラッシュレポートを送信してください。",
            textv1026: "• オフライン音楽プレーヤー＆オーディオカッター：オーディオのスキャン、再生、カットはすべてデバイス上でローカル（オフライン）で行われます。オリジナルまたは編集済みのオーディオファイルは、当社のサーバーにアップロードまたは送信されることはありません。",
            textv1027: "ダウンロード機能:",
            textv1028: "• このサービスは、指定した URL からコンテンツをダウンロードするための仲介役としてのみ機能します。",
            textv1029: "重要（著作権に関する免責事項）ダウンロードしたコンテンツについては、ご自身の責任となります。コンテンツをダウンロードおよび保存する権利または許可をお持ちであることをご確認ください。本アプリケーションは、著作権フリーのコンテンツまたは法的に所有するコンテンツでの使用を目的としています。著作権侵害の責任はユーザーにあります。"
        },
        chi: {
            textv01: "中国-China ( Aks )",
            //          textv02: "主题",
            textv03: "剪切音频",
            textv04: "下载器",
            textv05: "睡眠定时器",
            textv06: "删除播放列表",
            textv07: "情報信息",
            textv2: "音乐",
            textv3: "音乐艺术家",
            textv4: "专辑",
            textv5: "播放列表",
            textv6: "音乐艺术家",
            textv7: "扫描音乐文件夹",
            //      textv8: "艺术家的音乐",
            //        textv9: "音乐基于",
            //        textv10: "我的播放列表",
            textv11: "最喜欢的歌曲",
            textv12: "没有播放任何歌曲",
            textv10: "没有播放任何歌曲",
            textv13: "没有播放任何歌曲",
            textv14: "歌曲信息",
            textv15: "创建新的播放列表",
            textv16: "音乐艺术家",
            textv17: "选择时间",
            textv18: "您确定要删除此播放列表吗？",
            textv19: "标题 :",
            textv20: "翻译 :",
            textv21: "专辑：",
            textv22: "时长：",
            textv23: "文件大小：",
            textv24: "文件路径：",
            textv25: "飞涨",
            textv26: "剪切音频",
            textv27: "选择您的音频文件，设置开始和结束剪切点，然后保存结果!",

            textv2000: "下载并转换",
            textv2001: "搜索结果...",
            textv2002: "视频",
            textv2003: "音频",
            textv2004: "从各种热门平台下载您喜爱的视频。只需点击几下即可根据需要进行转换！然后离线保存。支持 MP3 音频格式以及其他用于各种用途的视频格式。多平台支持：了解您喜爱的视频来源的多样性。此功能支持从各种热门平台下载视频，例如：YouTube、Facebook、Instagram 等等。操作简单：只需将视频链接 (URL) 复制并粘贴到提供的字段中，系统即可自动完成下载。",

            textv000: "关于制作",
            textv001: "条款和条件",
            textv002: "1. 信息收集。由于本应用侧重于离线使用，因此我们尽量减少个人数据的收集。以下是我们可能收集的信息：",
            textv003: "2. 本服务如何使用您的信息？收集的数据仅用于以下目的？",
            textv004: "3. 权限说明。本应用需要多项权限才能正常运行。以下是说明：",
            textv005: "4. 隐私保护重点关注关键功能",
            textv006: "5. 数据安全和第三方保护。本服务实施合理的技术安全措施来保护所处理的数据。本服务不会与第三方共享您的个人数据。",
            textv007: "6. 隐私政策的变更。本服务可能会不时更新本隐私政策。本应用将通过在本页面或应用内发布新的隐私政策来通知您任何变更。通知！",
            textv008: "7. 联系方式 如果您对本隐私政策有任何疑问，请随时通过 [支持邮箱地址] 与我们联系。",

            textv1000: "随时随地访问您的全部音乐收藏，无需担心流量上限或信号弱。只需在应用中保存您的歌曲，即可享受不间断的聆听体验。（音频剪切）根据您的喜好剪切音频 音频剪切功能让您可以完全控制任何歌曲中您最喜欢的部分。想要用您最喜欢的副歌创建独特的铃声，还是只想听听标志性的音频剪切工具轻松保存您的片段？高精度确保您每次都能获得完美的剪辑。（下载器）以两种流行格式下载和保存 您可以根据需要在两种流行格式之间进行选择：",
            textv1001: "MP3：适用于紧凑且音质出色的音频文件。非常适合在多台设备上收听并节省存储空间。",
            textv1002: "MP4：虽然 MP4 格式通常与视频相关联，但它也可以存储高质量的音频。如果您下载的内容可能具有更好的元数据或如果您计划稍后在视频项目中使用它。这款音乐播放器集离线播放、精准音频剪辑和灵活的下载选项于一体，是满足您所有音频需求的最佳解决方案。",
            textv1003: "我们致力于保护您个人数据的隐私和安全。本隐私政策解释了我们会收集哪些信息、如何使用这些信息以及您在使用本应用时对数据拥有的权利。我们的主要目标是提供一款轻量级的离线音乐播放器。透明度至关重要，让您在使用服务时感到安全。",
            textv1004: "• 此服务不会扫描、上传或存储您的个人音乐收藏。",
            textv1005: "不主动收集信息:",
            textv1006: "• 此服务不会收集您的姓名、电子邮件地址或电话号码等个人身份信息，除非您自愿联系我们寻求技术支持。",
            textv1007: "• 自动收集的信息（非个人信息）数据）：",
            textv1008: "• 诊断数据和崩溃报告：当应用遇到错误或崩溃时，此服务会收集匿名技术数据。这些信息包括设备类型、操作系统版本和错误日志。这些数据对于修复错误和提高稳定性非常重要。",
            textv1009: "• 功能使用情况数据（匿名）：此服务可能会收集关于哪些功能最常用的匿名统计数据（例如，音频修剪功能的使用频率）。这有助于我们了解用户需求并专注于开发相关功能。",
            textv1010: "功能特定信息：",
            textv1011: "• 下载器功能：当您使用此功能时，应用需要处理您输入的 URL。此服务不会存储您下载的 URL 历史记录以及您的身份信息。但是，可能会在服务器上创建临时技术日志以处理下载请求。",
            textv1012: "• 服务保障和维护：为确保所有应用功能正常运行正确处理。",
            textv1013: "• 应用质量改进：诊断数据和崩溃报告可帮助我们的团队快速识别和修复技术问题。",
            textv1014: "• 了解用户需求：匿名数据仅用于未来功能开发的决策。",
            textv1015: "• 正在处理您的请求：下载器功能中输入的 URL 仅用于一个目的：将您请求的文件下载到设备的本地存储。",
            textv1016: "存储访问权限 (READ/WRITE_EXTERNAL_STORAGE)：",
            textv1017: "为什么需要此权限？需要此权限才能使应用能够：",
            textv1018: "• 扫描并显示您设备上的音乐文件。",
            textv1019: "• 保存您使用“修剪音频”功能修剪的音频文件。",
            atextv1020: "• 保存您使用下载器功能下载的文件。",
            textv1021: "• 您的隐私：本应用只能访问音频文件。我们不会访问、修改或收集照片、文档或其他个人文件。",
            textv1022: "• 互联网访问 (INTERNET)权限",
            textv1023: "为什么需要此权限？此权限仅适用于：",
            textv1024: "• 下载器功能，用于连接到服务器并从您提供的 URL 下载文件。",
            textv1025: "• 发送匿名崩溃报告。",
            textv1026: "• 离线音乐播放器和音频剪辑器：所有音频扫描、播放和剪辑过程均在您的设备本地（离线）进行。任何音频文件（无论是原始文件还是编辑过的）都不会上传或发送到我们的服务器。",
            textv1027: "下载器功能：",
            textv1028: "• 该服务仅充当从您提供的 URL 下载内容的中介。",
            textv1029: "重要（版权免责声明）您对所下载的内容负全部责任。请确保您拥有下载和存储内容的权利或权限。本应用旨在用于无版权内容或您合法拥有的版权归用户所有。版权侵权由用户自行承担。"

        },
        es: {
            textv01: "Español",
            //            textv02: "tema",
            textv03: "cortar audio",
            textv04: "descargador",
            textv05: "temporizador de apagado",
            textv06: "eliminar lista de reproducción",
            textv07: "información",
            textv2: "Música",
            textv3: "Artista",
            textv4: "Álbum",
            textv5: "Lista",
            textv6: "Artista",
            textv7: "escanear carpeta de música",
            //       textv8: "música por artista",
            //       textv9: "música por álbum",
            //      textv10: "mi lista de reproducción",
            textv11: "canción favorita",
            textv12: "No se reproducen canciones",
            textv10: "No se reproducen canciones",
            textv13: "No se reproducen canciones",
            textv14: "información de la canción",
            textv15: "crear una nueva lista de reproducción",
            textv16: "Artista",
            textv17: "SELECCIONAR HORA",
            textv18: "Estás seguro de que quieres eliminar esta lista de reproducción?",
            textv19: "Título :",
            textv20: "Interpretar :",
            textv21: "Álbum :",
            textv22: "Dauer :",
            textv23: "Tamaño de fecha :",
            textv24: "Fechaipfad :",
            textv25: "zoom",
            textv26: "Cortar audio",
            textv27: "¡Selecciona tu archivo de audio, establece los puntos de corte de inicio y final, luego guarda el resultado!",

            textv2000: "DESCARGAR Y CONVERTIR",
            textv2001: "Resultados de búsqueda...",
            textv2002: "vídeo",
            textv2003: "audio",
            textv2004: "Descarga tus vídeos favoritos de diversas plataformas populares. ¡Conviértelos cuando quieras con solo unos clics! Después, guárdalos sin conexión. Formato de audio MP3, así como otros formatos de vídeo para diversos fines. Compatibilidad multiplataforma: Comprende la diversidad de fuentes de vídeo que disfrutas. Esta función permite descargar vídeos de diversas plataformas populares como YouTube, Facebook, Instagram y muchas más. Proceso sencillo: simplemente copia y pega el enlace del vídeo (URL) en el campo proporcionado y deja que el sistema lo haga automáticamente.",

            textv000: "SOBRE LA CREACIÓN",
            textv001: "TÉRMINOS Y CONDICIONES",
            textv002: "1. Información recopilada. Debido a que esta aplicación se centra en el uso sin conexión, minimizamos la recopilación de datos personales. Esta es la información que podemos recopilar:",
            textv003: "2. ¿Cómo utiliza este servicio su información? Los datos recopilados se utilizan exclusivamente para los siguientes fines",
            textv004: "3. Explicación de los permisos. La aplicación requiere varios permisos para funcionar correctamente. Esta es la explicación:",
            textv005: "4. Enfoque en la privacidad de las funciones clave",
            textv006: "5. Seguridad de datos y terceros. Implementamos medidas de seguridad técnicas razonables para proteger los datos procesados. Este servicio no comparte sus datos personales con terceros",
            textv007: "6. Cambios en la Política de Privacidad. El servicio puede actualizar esta Política de Privacidad ocasionalmente. La aplicación le notificará cualquier cambio mediante la publicación de una nueva Política de Privacidad en esta página o a través de una notificación en la aplicación. ¡Notificación!",
            textv008: "7. Contacto. Si tiene alguna pregunta sobre esta Política de Privacidad, no dude en contactarnos a [Dirección de correo electrónico de soporte].",

            textv1000: "Accede a toda tu colección de música en cualquier momento y lugar sin preocuparte por el límite de datos ni la mala señal. Simplemente guarda tus canciones en la app y disfruta de una escucha fluida. (Cortar audio) Corta el audio a tu gusto. La función de corte de audio te da control total sobre tu parte favorita de cualquier canción. ¿Quieres crear un tono de llamada único con tu estribillo favorito o simplemente escuchar la intro icónica? Con la herramienta de corte de audio, puedes seleccionar fácilmente un segmento específico de un archivo de audio y guardarlo por separado. La alta precisión garantiza un corte perfecto en todo momento. (Descargador) Descarga y guarda en dos formatos populares. Puedes elegir entre dos formatos populares según tus necesidades.",
            textv1001: "MP3: Ideal para archivos de audio compactos con excelente calidad de sonido. Perfecto para escuchar en múltiples dispositivos y ahorrar espacio de almacenamiento.",
            textv1002: "MP4: Aunque a menudo se asocia con el vídeo, el formato MP4 también puede almacenar audio de alta calidad. Esto es especialmente útil si descargas contenido con metadatos más completos o si planeas usarlo en un proyecto de vídeo más adelante. Con una combinación de reproducción sin conexión, recorte de audio preciso y opciones de descarga flexibles, este reproductor de música es la solución definitiva para todas tus necesidades de audio.",
            textv1003: "Nos comprometemos a proteger la privacidad y seguridad de su información personal. Esta política de privacidad explica qué información se recopila, cómo se utiliza y qué derechos tiene sobre sus datos al usar la aplicación. El objetivo principal es ofrecer un reproductor de música sin conexión ligero. La transparencia es fundamental y garantiza su seguridad al usar el servicio.",
            textv1004: "• Este servicio NO escanea, carga ni almacena su colección personal de música en su dispositivo.",
            textv1005: "Información no recopilada activamente:",
            textv1006: "• Este servicio no recopila información personal identificable, como su nombre, dirección de correo electrónico o número de teléfono, a menos que nos contacte voluntariamente para obtener asistencia técnica.",
            textv1007: "• Información recopilada automáticamente (datos no personales):",
            textv1008: "• Datos de diagnóstico e informes de fallos: este servicio recopila datos técnicos anónimos cuando la aplicación experimenta errores o se bloquea. Esta información incluye el tipo de dispositivo, la versión del sistema operativo y los registros de errores. Estos datos son importantes para corregir errores y mejorar la estabilidad.",
            textv1009: "• Datos de uso de funciones (anónimos): El servicio puede recopilar datos estadísticos anónimos sobre las funciones que se utilizan con más frecuencia (por ejemplo, la frecuencia con la que se usa la función de recorte de audio). Esto nos ayuda a comprender las necesidades de los usuarios y a centrarnos en el desarrollo de funciones relevantes.",
            textv1010: "Información específica de la función:",
            textv1011: "• Función de descarga: Al usar esta función, la aplicación debe procesar la URL que ingresó. El servicio NO almacena un historial de las URL que descarga ni de su identidad. Sin embargo, se pueden crear registros técnicos temporales en el servidor para procesar las solicitudes de descarga.",
            textv1012: "• Asegurar y mantener el servicio: Para garantizar que todas las funciones de la aplicación funcionen correctamente.",
            textv1013: "• Mejorar la calidad de la aplicación: Los datos de diagnóstico y los informes de fallos ayudan a nuestro equipo a identificar y solucionar rápidamente los problemas técnicos.",
            textv1014: "• Comprender las necesidades de los usuarios: Los datos de uso anónimos solo se utilizan para tomar decisiones. sobre el desarrollo de futuras funciones.",
            textv1015: "• Procesando tu solicitud: La URL introducida en el descargador se utiliza con un único propósito: descargar el archivo solicitado al almacenamiento local de tu dispositivo.",
            textv1016: "Permiso de acceso al almacenamiento (LECTURA/ESCRITURA_ALMACENAMIENTO_EXTERNO):",
            textv1017: "¿Por qué es necesario? Este permiso es necesario para que la aplicación pueda:",
            textv1018: "• Escanear y mostrar archivos de música en tu dispositivo.",
            textv1019: "• Guardar archivos de audio que hayas recortado con la función Recortar audio.",
            textv1020: "• Guardar archivos que descargues con el descargador.",
            textv1021: "• Tu privacidad: Esta aplicación solo accederá a archivos de audio. No accedemos, modificamos ni recopilamos fotos, documentos ni otros archivos personales.",
            textv1022: "• Permiso de acceso a Internet (INTERNET)",
            textv1023: "¿Por qué es necesario? Este permiso solo se necesita para:",
            textv1024: "• Funcionalidad de descarga para conectarse al servidor y descargar archivos desde la URL que proporciones.",
            textv1025: "• Enviar informes de fallos anónimos.",
            textv1026: "• Reproductor de música y cortador de audio sin conexión: Todos los procesos de escaneo, reproducción y corte de audio se realizan completamente localmente en tu dispositivo (sin conexión). Ningún archivo de audio, ni original ni editado, se carga ni se envía a nuestros servidores.",
            textv1027: "Funciones del descargador:",
            textv1028: "• El servicio solo actúa como intermediario para descargar contenido desde la URL que proporciones.",
            textv1029: "Importante (Descargo de responsabilidad por derechos de autor) Eres el único responsable del contenido que descargas. Asegúrate de tener los derechos o el permiso para descargar y almacenar el contenido. Esta aplicación está diseñada para usarse con contenido libre de derechos de autor o contenido que tú Poseer legalmente los derechos de autor. La infracción de los derechos de autor es responsabilidad del usuario."
        },
        fr: {
            textv01: "Français",
            //           textv02: "thème",
            textv03: "couper l'audio",
            textv04: "téléchargeur",
            textv05: "minuterie de sommeil",
            textv06: "supprimer la playlist",
            textv07: "information",
            textv2: "Musique",
            textv3: "Artiste",
            textv4: "Album",
            textv5: "liste de lecture",
            textv6: "Artiste",
            textv7: "scanner le dossier de musique",
            //        textv8: "musique par artiste",
            //       textv9: "musique par album",
            //       textv10: "ma playlist",
            textv11: "chanson préférée",
            textv12: "aucune chanson n'est jouée",
            textv10: "aucune chanson n'est jouée",
            textv13: "aucune chanson n'est jouée",
            textv14: "informations sur la chanson",
            textv15: "créer une nouvelle playlist",
            textv16: "Artiste",
            textv17: "sélectionner l'heure",
            textv18: "Êtes-vous sûr de vouloir supprimer cette playlist ?",
            textv19: "Titre :",
            textv20: "Interprète :",
            textev21: "album :",
            textv22: "Dauer :",
            textv23: "Tamaño de fecha :",
            textv24: "Fechaipfad :",
            textv25: "zoom",
            textv26: "Couper l'Audio",
            textv27: "Sélectionnez votre fichier audio, définissez les points de coupe de début et de fin, puis enregistrez le résultat!",
            textv2000: "TÉLÉCHARGER ET CONVERTIR",
            textv2001: "Résultats de recherche…",
            textv2002: "Vidéo",
            textv2003: "Audio",
            textv2004: "Téléchargez vos vidéos préférées depuis différentes plateformes populaires. Convertissez-les selon vos besoins en quelques clics ! Enregistrez-les ensuite hors ligne. Format audio MP3, ainsi que d’autres formats vidéo pour divers usages. Prise en charge multiplateforme : Comprenez la diversité de vos sources vidéo. Cette fonctionnalité prend en charge le téléchargement de vidéos depuis différentes plateformes populaires telles que: YouTube, Facebook, Instagram, et bien d’autres. Processus simple : copiez et collez simplement le lien de la vidéo (URL) dans le champ prévu à cet effet, et le système s’occupe automatiquement du reste.",
            textv000: "FAQ",
            textv001: "CONDITIONS GÉNÉRALES",
            textv002: "1. Informations collectées. En raison de la nature hors ligne de cette application, nous minimisons la collecte de données personnelles. Voici les informations que nous pouvons collecter :",
            textv003: "2. Comment ce service utilise-t-il vos informations? Les données collectées sont utilisées exclusivement aux fins suivantes?",
            textv004: "3. Explication des autorisations. L’application nécessite plusieurs autorisations pour fonctionner correctement. Voici une explication :",
            textv005: "4. Confidentialité : fonctionnalités clés",
            textv006: "5. Sécurité des données et tiers. Nous mettons en œuvre des mesures de sécurité techniques raisonnables pour protéger les données que nous traitons. Ce service ne partage pas vos données personnelles avec des tiers.",
            textv007: "6. Modifications de la politique de confidentialité. Le service peut mettre à jour cette politique de confidentialité de temps à autre. L’application vous informera de toute modification en publiant la nouvelle politique de confidentialité sur cette page ou via un message intégré à l’application. Notification!",
            textv008: "7. Contact. Pour toute question concernant la présente Politique de confidentialité, n'hésitez pas à nous contacter à l'adresse [Adresse e-mail du support].",

            textv1000: "Accédez à toute votre collection musicale à tout moment et où que vous soyez, sans vous soucier des limites de données ou d'un signal faible. Enregistrez simplement vos morceaux dans l'application et profitez d'une écoute fluide. (Coupure audio) Coupez l'audio à votre goût. La fonction de découpage audio vous offre un contrôle total sur vos passages préférés de n'importe quelle chanson. Envie de créer une sonnerie unique à partir de votre refrain préféré ou simplement d'écouter cette intro emblématique ? Grâce à l'outil de découpage audio, vous pouvez facilement sélectionner des segments spécifiques d'un fichier audio et les enregistrer séparément. La haute précision garantit un découpage parfait à chaque fois. (Téléchargeur) Téléchargez et enregistrez dans deux formats populaires. Vous pouvez choisir entre deux formats populaires pour répondre à vos besoins :",
            textv1001: "MP3 : Idéal pour les fichiers audio compacts avec une excellente qualité sonore. Parfait pour écouter sur plusieurs appareils et économiser de l'espace de stockage.",
            textv1002: "MP4 : Bien que souvent associé à la vidéo, le format MP4 permet également de stocker de l'audio de haute qualité. Ceci est particulièrement utile si vous téléchargez du contenu aux métadonnées plus riches ou si vous prévoyez de l'utiliser dans un projet vidéo. plus tard. Grâce à la lecture hors ligne, au découpage audio précis et aux options de téléchargement flexibles, ce lecteur de musique est la solution idéale pour tous vos besoins audio.",

            textv1003: "Nous nous engageons à protéger la confidentialité et la sécurité de vos données personnelles. Cette politique de confidentialité explique quelles informations sont collectées, comment elles sont utilisées et vos droits concernant vos données lorsque vous utilisez l'application. L'objectif principal est de fournir un lecteur de musique hors ligne léger.» La transparence est essentielle et vous permet d'utiliser ce service en toute sécurité.",
            textv1004: "• Ce service n'analyse, ne télécharge et ne stocke PAS votre collection musicale personnelle sur votre appareil.",

            textv1005: "Informations non collectées activement :",

            textv1006: "• Ce service ne collecte pas d'informations personnelles identifiables telles que votre nom, votre adresse e-mail ou votre numéro de téléphone, sauf si vous contactez volontairement le support technique.",

            textv1007: "• Informations collectées automatiquement (données non personnelles) :",

            textv1008: "• Données de diagnostic et rapports de plantage : Ce service collecte des données techniques anonymes lorsque l'application rencontre une erreur ou un plantage. Ces informations incluent le type d'appareil, la version du système d'exploitation et les journaux d'erreurs. Ces données sont importantes pour corriger les bugs et améliorer la stabilité.",

            textv1009: "• Données d'utilisation des fonctionnalités (anonymes) : Le service peut collecter des données statistiques anonymes sur les fonctionnalités les plus fréquemment utilisées (par exemple, la fréquence d'utilisation de la fonction de découpage audio). Cela permet de comprendre les besoins des utilisateurs et de se concentrer sur le développement de fonctionnalités pertinentes.",

            textv1010: "Informations spécifiques aux fonctionnalités :",
            textv1011: "• Fonctionnalité de téléchargement : Lorsque vous utilisez cette fonctionnalité, l’application doit traiter l’URL que vous saisissez. Le service ne conserve pas l’historique de vos URL téléchargées ni votre identité. Cependant, un journal technique temporaire peut être créé sur le serveur pour traiter les demandes de téléchargement.",
            textv1012: "• Garantie et maintenance du service : Pour garantir le bon fonctionnement de toutes les fonctionnalités de l’application.",
            textv1013: "• Amélioration de la qualité de l’application : Les données de diagnostic et les rapports d’incident aident notre équipe à identifier et à résoudre rapidement les problèmes techniques.",
            textv1014: "• Compréhension des besoins des utilisateurs : Les données anonymes sont utilisées uniquement pour prendre des décisions concernant le développement futur des fonctionnalités.",
            textv1015: "• Traitement de votre demande : L’URL saisie dans la fonctionnalité de téléchargement est utilisée à une seule fin : télécharger le fichier demandé sur le stockage local de votre appareil.",
            textv1016: "Autorisation d’accès au stockage (LECTURE/ÉCRITURE_STOCKAGE_EXTERNE) :",
            textv1017: "Pourquoi? Nécessaire? Cette autorisation est requise pour que l'application puisse :",
            textv18: "• Analyser et afficher les fichiers musicaux sur votre appareil.",
            textv19: "• Enregistrer les fichiers audio que vous avez découpés à l'aide de la fonctionnalité Coupure audio.",
            textv1020: "• Enregistrer les fichiers que vous avez téléchargés à l'aide de la fonctionnalité Téléchargeur",
            textv1021: "• Votre vie privée : Cette application accède uniquement aux fichiers audio. Nous n'accédons pas, ne modifions pas et ne collectons pas les photos, documents ou autres fichiers personnels.",
            textv1022: "• Autorisation d'accès à Internet (INTERNET).",
            textv1023: "Pourquoi est-ce nécessaire? Cette autorisation est requise uniquement pour :",
            textv1024: "• Fonctionnalité de téléchargement permettant de se connecter au serveur et de télécharger des fichiers depuis l’URL que vous fournissez.",
            textv1025: "• Envoyer des rapports d’erreur anonymes.",
            textv1026: "• Lecteur de musique hors ligne et découpe audio : Tous les processus d’analyse, de lecture et de découpe audio s’effectuent entièrement en local sur votre appareil (hors ligne). Aucun fichier audio, qu’il soit original ou modifié, n’est téléchargé ni envoyé sur nos serveurs.",
            textv1027: "Fonctionnalités de téléchargement :",
            textv1028: "• Le service agit uniquement comme intermédiaire pour télécharger du contenu depuis l’URL que vous fournissez.",
            textv1029: "Important (Avis de non-responsabilité relatif aux droits d’auteur) Vous êtes seul responsable du contenu que vous téléchargez. Assurez-vous de disposer des droits ou de l’autorisation nécessaires pour télécharger et stocker ce contenu. Cette application est destinée à être utilisée avec du contenu libre de droits ou dont vous êtes légalement propriétaire. Toute violation des droits d’auteur relève de la responsabilité de l’utilisateur."
        },
        ita: {
            textv01: "italia",
            //           textv02: "Tema",
            textv03: "Taglia audio",
            textv04: "Downloader",
            textv05: "Timer di spegnimento",
            textv06: "Elimina playlist",
            textv07: "Informazioni",
            textv2: "Musica",
            textv3: "Artisti",
            textv4: "Album",
            textv5: "Playlist",
            textv6: "Artisti",
            textv7: "Scansiona cartelle musicali",
            //        textv8: "Musica per artista",
            //       textv9: "Musica per album",
            //       textv10: "Le mie playlist",
            textv11: "Brani preferiti",
            textv12: "Nessun brano in riproduzione al momento",
            textv10: "Nessun brano in riproduzione al momento",
            textv13: "Nessun brano in riproduzione al momento",
            textv14: "informazioni sulla canzone",
            textv15: "creare una nuova playlist",
            textv16: "Artisti",
            textv17: "SELEZIONA ORA",
            textv18: "Sei sicuro di voler eliminare questa playlist?",
            textv19: "Titolo :",
            textv20: "Artistab:",
            textv21: "Album :",
            textv22: "Durata :",
            textv23: "Dimensione file :",
            textv24: "Percorso file :",
            textv25: "ingrandire",
            textv26: "Tagliare l'Audio",
            textv27: "Seleziona il tuo file audio, imposta i punti di taglio iniziale e finale, quindi salva il risultato!",
            textv2000: "SCARICA E CONVERTI",
            textv2001: "risultati di ricerca...",
            textv2002: "video",
            textv2003: "audio",
            textv2004: "Scarica i tuoi video preferiti da diverse piattaforme popolari. Convertili secondo le tue esigenze in pochi clic! Poi salvali offline. Formato audio MP3, così come altri formati video per vari scopi. Supporto multipiattaforma: scopri la varietà di fonti video che ti piacciono. Questa funzione supporta il download di video da diverse piattaforme popolari come: - YouTube - Facebook - Instagram - e molte altre. Procedura semplice: basta copiare e incollare il link del video (URL) nel campo apposito e lasciare che il sistema faccia il lavoro automaticamente.",
            textv000: "INFORMAZIONI SU MAKING",
            textv001: "TERMINI E CONDIZIONI",
            textv002: "1. Informazioni raccolte. Data la natura di questa applicazione, focalizzata sull'utilizzo offline, la raccolta di dati personali viene ridotta al minimo. Ecco le informazioni che potremmo raccogliere:",
            textv003: "2. Come utilizza questo servizio le tue informazioni? I dati raccolti vengono utilizzati esclusivamente per i seguenti scopi?",
            textv004: "3. Spiegazione delle autorizzazioni. L'applicazione richiede diverse autorizzazioni per funzionare correttamente. Ecco la spiegazione:",
            textv005: "4. Privacy: attenzione alle funzionalità chiave",
            textv006: "5. Sicurezza dei dati e terze parti: implementa misure di sicurezza tecniche ragionevoli per proteggere i dati trattati. Questo servizio non condivide i tuoi dati personali con terze parti.",
            textv007: "6. Modifiche all'Informativa sulla privacy: il servizio potrebbe aggiornare la presente Informativa sulla privacy di volta in volta. L'applicazione ti informerà di eventuali modifiche pubblicando una nuova Informativa sulla privacy su questa pagina o tramite un'app. notifica!",
            textv008: "7. Contatti Per qualsiasi domanda sulla presente Informativa sulla privacy, non esitate a contattarci all'indirizzo [indirizzo email di supporto].",


            textv1000: "Accedi a tutta la tua collezione musicale sempre e ovunque, senza preoccuparti di limiti di dati o segnale debole. Salva i tuoi brani all'interno dell'app e goditi un ascolto impeccabile. (taglio audio) Taglia l'audio secondo i tuoi gusti. La funzione audio ti offre il pieno controllo sulla tua parte preferita di qualsiasi brano. Separazione a secco. L'elevata precisione garantisce un taglio perfetto ogni volta. (downloader) Scarica e salva in due formati popolari. Puoi scegliere tra due formati popolari in base alle tue esigenze:",
            textv1001: "MP3: ideale per file audio compatti con un'eccellente qualità audio. Perfetto per l'ascolto su più dispositivi e per risparmiare spazio di archiviazione.",
            textv1002: "MP4: sebbene spesso associato al video, il formato MP4 può anche memorizzare audio di alta qualità. Questo è particolarmente utile se si scaricano contenuti che potrebbero avere metadati più ricchi o se si prevede di utilizzarli in un progetto video in seguito. Con una combinazione di riproduzione offline, ritaglio audio preciso e opzioni di download flessibili, questo lettore musicale è la soluzione definitiva per tutte le esigenze audio.",
            textv1003: "Ci impegniamo a proteggere la privacy e la sicurezza dei tuoi dati personali. Questa informativa sulla privacy spiega quali informazioni vengono raccolte, come vengono utilizzate e quali diritti hai sui tuoi dati quando utilizzi l'app. L'obiettivo principale è offrire un lettore musicale offline leggero. La trasparenza è essenziale e garantisce la tua sicurezza durante l'utilizzo del servizio.",
            textv1004: "Informazioni non raccolte attivamente:",
            texv1005: "• Questo servizio NON analizza, carica o memorizza la tua raccolta musicale personale sul tuo dispositivo.",
            textv1006: "• Questo servizio non raccoglie informazioni personali identificabili come nome, indirizzo email o numero di telefono, a meno che tu non ci contatti volontariamente per ricevere supporto tecnico.",
            textv1007: "• Informazioni raccolte automaticamente (dati non personali):",
            textv1008: "• Dati diagnostici e segnalazioni di arresti anomali: questo servizio raccoglie dati tecnici anonimi quando l'app riscontra errori o arresti anomali. Queste informazioni includono il tipo di dispositivo, la versione del sistema operativo e i registri degli errori. Questi dati sono importanti per correggere bug e migliorare la stabilità.",
            textv1009: "• Dati sull'utilizzo delle funzionalità (anonimi): il servizio potrebbe raccogliere dati statistici anonimi sulle funzionalità utilizzate più frequentemente (ad esempio, la frequenza di utilizzo della funzionalità di ritaglio audio). Questo ci aiuta a comprendere le esigenze degli utenti e a concentrarci sullo sviluppo di funzionalità pertinenti.",
            textv1010: "Informazioni specifiche sulle funzionalità:",
            textv1011: "• Funzionalità di download: quando utilizzi questa funzionalità, l'app deve elaborare l'URL inserito. Il servizio NON memorizza la cronologia degli URL scaricati né la tua identità. Tuttavia, potrebbero essere creati log tecnici temporanei sul server per elaborare le richieste di download.",
            textv1012: "• Garanzia e manutenzione del servizio: per garantire il corretto funzionamento di tutte le funzionalità dell'app.",
            textv1013: "• Miglioramento della qualità dell'app: i dati diagnostici e i report sugli arresti anomali aiutano il nostro team a identificare e risolvere rapidamente i problemi tecnici.",
            textv1014: "• Comprensione delle esigenze degli utenti: i dati di utilizzo anonimi vengono utilizzati solo per prendere decisioni su sviluppo di funzionalità future.",
            textv1015: "• Elaborazione della richiesta: l'URL inserito nella funzione di download viene utilizzato per un solo scopo: scaricare il file richiesto nella memoria locale del dispositivo.",
            textv1015: "Autorizzazione di accesso alla memoria (LETTURA/SCRITTURA_MEMORIA_ESTERNA):",
            textv1017: "Perché è necessaria? Questa autorizzazione è necessaria affinché l'app possa:",
            textv1018: "• Scansionare e visualizzare i file musicali sul dispositivo.",
            textv1019: "• Salvare i file audio che hai tagliato utilizzando la funzione Taglia audio.",
            textv1020: "• Salvare i file scaricati tramite la funzione di download.",
            textv1021: "• La tua privacy: questa app accederà solo ai file audio. Non accediamo, modifichiamo o raccogliamo foto, documenti o altri file personali.",
            textv1022: "• Autorizzazione di accesso a Internet (INTERNET)",
            textv1023: "Perché è necessario? Questa autorizzazione è necessaria solo per :",
            textv1024: "• Funzione di download per connettersi a un server e scaricare file da un URL fornito.",
            textv1025: "• Invia segnalazioni di crash anonime.",
            textv1026: "• Lettore musicale offline e audio cutter: tutti i processi di scansione, riproduzione e taglio audio avvengono interamente in locale sul tuo dispositivo (offline). Nessun file audio, né originale né modificato, viene mai caricato o inviato ai nostri server.",
            textv1027: "Funzionalità del downloader:",
            textv1028: "• il servizio funge solo da intermediario per scaricare contenuti dall'URL fornito.",
            textv1029: "Importante (Informativa sul copyright) sei l'unico responsabile dei contenuti scaricati. Assicurati di avere i diritti o l'autorizzazione per scaricare e archiviare i contenuti. Questa app è pensata per l'uso con contenuti liberi da copyright o di tua proprietà legale. La violazione del copyright è responsabilità dell'utente."
        },
        Grm: {
            textv01: "Deutsch- (jerman)",
            //           textv02: "Design",
            textv03: "Audio kürzen",
            textv04: "Downloader",
            textv05: "Sleep Timer",
            textv06: "Playlist löschen",
            textv07: "Informationen",
            textv2: "Musik",
            textv3: "Interpreten",
            textv4: "Alben",
            textv5: "Playlists",
            textv6: "Interpreten",
            textv7: "Musikordner durchsuchen",
            //        textv8: "Musik nach Interpret",
            //        textv9: "Musik nach Album",
            //       textv10: "Meine Playlists",
            textv11: "Lieblingslieder",
            textv12: "Aktuell keine Lieder",
            textv10: "Aktuell keine Lieder",
            textv13: "Aktuell keine Lieder",
            textv14: "Songinformationen",
            textv15: "eine neue Playlist erstellen",
            textv16: "Interpreten",
            textv17: "SELEZIONA ORA",
            textv18: "Seien Sie sicher, dass Sie diese Playlist entfernen möchten?",
            textv19: "Titel :",
            textv20: "Interpret :",
            textv21: "Album :",
            textv22: "Dauer :",
            textv23: "Dateigröße :",
            textv24: "Dateipfad :",
            textv25: "zoom",
            textv26: "Audio Schneiden",
            textv27: "Wählen Sie Ihre Audiodatei aus, legen Sie die Start- und Endschnittpunkte fest und speichern Sie das Ergebnis!",

            textv2000: "HERUNTERLADEN & KONVERTIEREN",
            textv2001: "Suchergebnisse…",
            textv2002: "Video",
            textv2003: "Audio",
            textv2004: "Laden Sie Ihre Lieblingsvideos von verschiedenen gängigen Plattformen herunter. Konvertieren Sie sie nach Bedarf mit nur wenigen Klicks! Speichern Sie sie anschließend offline. MP3-Audioformat sowie andere Videoformate für verschiedene Zwecke. Multiplattform-Unterstützung: Entdecken Sie die Vielfalt Ihrer Lieblingsvideoquellen. Diese Funktion unterstützt das Herunterladen von Videos von verschiedenen gängigen Plattformen wie YouTube, Facebook, Instagram und vielen mehr. Einfacher Vorgang: Kopieren Sie einfach den Videolink (URL) und fügen Sie ihn in das dafür vorgesehene Feld ein. Das System erledigt den Rest automatisch.",

            textv000: "ÜBER DIE PRODUKTION",
            textv001: "AGB",
            textv002: "1. Erfasste Informationen: Aufgrund der Offline-Nutzung dieser Anwendung wird die Erfassung personenbezogener Daten minimiert. Folgende Informationen können erfasst werden:",
            textv003: "2. Wie verwendet dieser Dienst Ihre Daten? Die erhobenen Daten werden ausschließlich für die folgenden Zwecke verwendet?",
            textv004: "3. Erläuterung der Berechtigungen: Die Anwendung benötigt verschiedene Berechtigungen, um ordnungsgemäß zu funktionieren. Hier die Erläuterung:",
            textv005: "4. Datenschutz im Fokus: Wichtige Funktionen",
            textv006: "5. Datensicherheit und Drittanbieter: Wir setzen angemessene technische Sicherheitsmaßnahmen zum Schutz der verarbeiteten Daten ein. Dieser Dienst gibt Ihre personenbezogenen Daten nicht an Dritte weiter.",
            textv007: "6. Änderungen der Datenschutzrichtlinie: Der Dienst kann diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren. Die Anwendung informiert Sie über Änderungen, indem sie eine neue Datenschutzrichtlinie auf dieser Seite oder über eine In-App-Funktion veröffentlicht. Benachrichtigung!",
            textv008: "7. Kontakt: Bei Fragen zu dieser Datenschutzrichtlinie wenden Sie sich bitte an [Support-E-Mail-Adresse].",

            textv1000: "Greifen Sie jederzeit und überall auf Ihre gesamte Musiksammlung zu, ohne sich um Datenlimits oder einen schlechten Empfang sorgen zu müssen. Speichern Sie Ihre Songs einfach in der App und genießen Sie nahtloses Hören. (Audio schneiden) Schneiden Sie Audio nach Ihrem Geschmack zu. Die Audio-Schneidefunktion gibt Ihnen die vollständige Kontrolle über Ihren Lieblingsteil eines Songs. Möchten Sie aus Ihrem Lieblingsrefrain einen einzigartigen Klingelton erstellen oder einfach nur das legendäre Intro hören? Mit dem Audio-Cutter-Tool können Sie ganz einfach ein bestimmtes Segment einer Audiodatei auswählen und separat speichern. Hohe Präzision sorgt dafür, dass Sie jedes Mal den perfekten Schnitt erhalten. (Downloader) Herunterladen und Speichern in zwei gängigen Formaten Sie können je nach Bedarf zwischen zwei gängigen Formaten wählen:",
            textv1001: "MP3: Ideal für kompakte Audiodateien mit hervorragender Klangqualität. Perfekt zum Hören auf mehreren Geräten und zum Sparen von Speicherplatz.",
            textv1002: "MP4: Obwohl MP4 oft mitVideos in Verbindung gebracht wird, kann es auch hochwertige Audiodateien speichern. Das ist besonders nützlich, wenn Sie Inhalte mit umfangreichen Metadaten herunterladen oder diese später in einem Videoprojekt verwenden möchten. Mit einer Kombination aus Offline-Wiedergabe, präzisem Audio-Trimmen und flexiblen Download-Optionen ist dieser Musikplayer die ultimative Lösung für all Ihre Audioanforderungen.",
            textv1003: "Verpflichtung zum Schutz der Privatsphäre und Sicherheit Ihrer persönlichen Daten. Diese Datenschutzrichtlinie erläutert, welche Informationen gesammelt werden, wie sie verwendet werden und welche Rechte Sie in Bezug auf Ihre Daten bei der Nutzung der App haben. Das Hauptziel ist die Bereitstellung eines leichten Offline-Musikplayers. Transparenz ist entscheidend und sorgt dafür, dass Sie sich bei der Nutzung des Dienstes sicher fühlen.",
            textv1004: "• Dieser Dienst scannt, lädt oder speichert Ihre persönliche Musiksammlung NICHT auf Ihrem Gerät.",
            textv1005: "Nicht aktiv erhobene Informationen:",
            textv1006: "• Dieser Dienst erfasst keine personenbezogenen Daten wie Ihren Namen, Ihre E-Mail-Adresse oder Telefonnummer, es sei denn, Sie kontaktieren uns freiwillig für technischen Support.",
            textv1007: "• Automatisch erfasste Informationen (nicht personenbezogene Daten):",
            textv1008: "• Diagnosedaten und Absturzberichte: Dieser Dienst erfasst anonyme technische Daten, wenn in der App ein Fehler auftritt oder sie abstürzt. Zu diesen Informationen gehören Gerätetyp, Betriebssystemversion und Fehlerprotokolle. Diese Daten sind wichtig für die Behebung von Fehlern und die Verbesserung der Stabilität.",
            textv1009: "• Funktionsnutzungsdaten (anonym): Der Dienst kann anonyme statistische Daten darüber erfassen, welche Funktionen am häufigsten genutzt werden (z. B. wie oft die Audio-Trimmfunktion verwendet wird). Dies hilft, die Nutzerbedürfnisse zu verstehen und sich auf die Entwicklung relevanter Funktionen zu konzentrieren.",
            textv1010: "Funktionsspezifische Informationen:",
            textv1011: "• Downloader-Funktion: Wenn Sie diese Funktion nutzen, muss die App die eingegebene URL verarbeiten. Der Dienst speichert KEINEN Verlauf der von Ihnen heruntergeladenen URLs zusammen mit Ihrer Identität. Es können jedoch temporäre technische Protokolle auf dem Server erstellt werden, um Download-Anfragen zu verarbeiten.",
            textv1012: "• Sicherstellung und Wartung des Dienstes: Um sicherzustellen, dass alle Funktionen der App ordnungsgemäß funktionieren.",
            textv1013: "• Verbesserung der App-Qualität: Diagnosedaten und Absturzberichte helfen unserem Team, technische Probleme schnell zu identifizieren und zu beheben.",
            textv1014: "• Verständnis der Nutzerbedürfnisse: Anonyme Daten werden ausschließlich für Entscheidungen über die zukünftige Funktionsentwicklung verwendet.",
            textv1015: "• Bearbeitung Ihrer Anfrage: Die in die Downloader-Funktion eingegebene URL wird nur für einen Zweck verwendet: das Herunterladen der angeforderten Datei auf den lokalen Speicher Ihres Geräts.",
            textv1016: "Speicherzugriffsberechtigung (LESEN/SCHREIBEN_EXTERNAL_STORAGE):",
            textv1017: "Warum ist das notwendig? Diese Berechtigung ist erforderlich, damit die App Folgendes tun kann:",
            textv1018: "• Musikdateien auf Ihrem Gerät scannen und anzeigen.",
            textv1019: "• Audiodateien speichern, die Sie mit der Funktion „Audio trimmen“ zugeschnitten haben.",
            textv1020: "• Dateien speichern, die Sie mit der Downloader-Funktion herunterladen.",
            textv1021: "• Ihre Privatsphäre: Diese App greift ausschließlich auf Audiodateien zu. Wir greifen nicht auf Fotos, Dokumente oder andere persönliche Dateien zu, ändern oder sammeln diese auch nicht.",
            textv1022: "• Berechtigung für den Internetzugang (INTERNET)",
            textv1023: "Warum ist diese Berechtigung erforderlich? Diese Berechtigung wird nur für Folgendes benötigt:",
            textv1024: "• Downloader-Funktion zum Herstellen einer Verbindung mit einem Server und Herunterladen von Dateien von einer von Ihnen angegebenen URL.",
            textv1025: "• Senden anonymer Absturzberichte.",
            textv1026: "• Offline-Musikplayer & Audio-Cutter: Alle Vorgänge zum Scannen, Abspielen und Schneiden von Audiodateien erfolgen vollständig lokal auf Ihrem Gerät (offline). Es werden keine Audiodateien – weder originale noch bearbeitete – hochgeladen oder an unsere Server gesendet.",
            textv1027: "Downloader-Funktionen: ",
            textv1028: "• Der Dienst fungiert lediglich als Vermittler für den Download von Inhalten von der von Ihnen angegebenen URL.“ bereitstellen.",
            textv1029: "Wichtig (Urheberrechtshinweis) Sie sind allein für die heruntergeladenen Inhalte verantwortlich. Stellen Sie sicher, dass Sie das Recht oder die Erlaubnis haben, die Inhalte herunterzuladen und zu speichern. Diese Anwendung ist für die Verwendung mit urheberrechtsfreien Inhalten oder Inhalten, deren rechtmäßiges Eigentum Sie sind, vorgesehen. Urheberrechtsverletzungen liegen in der Verantwortung des Nutzers."
        },
        bld: {
            textv01: "Nederland- (Belanda)",
            //          textv02: "Thema's",
            textv03: "Audio inkorten",
            textv04: "Downloader",
            textv05: "Slaaptimer",
            textv06: "Afspeellijst verwijderen",
            textv07: "Informatie",
            textv2: "Muziek",
            textv3: "Artiesten",
            textv4: "Albums",
            textv5: "Afspeellijsten",
            textv6: "Artiest",
            textv7: "Muziekmap scannen",
            //        textv8: "Muziek op artiest",
            //       textv9: "Muziek op album",
            //        textv10: "Mijn afspeellijsten",
            textv11: "Favoriete nummers",
            textv12: "Er worden momenteel geen nummers afgespeeld",
            textv10: "Er worden momenteel geen nummers afgespeeld",
            textv13: "Er worden momenteel geen nummers afgespeeld",
            textv14: "Nummerinformatie",
            textv15: "Nieuwe afspeellijst maken",
            textv16: "Artiest",
            textv17: "SELECTEER TIJD",
            textv17: "SELECTEER TIJD",
            textv18: "Weet u zeker dat u deze afspeellijst wilt verwijderen?",
            textv19: "Titel :",
            textv20: "Artiest :",
            textv21: "Album :",
            textv22: "Duur :",
            textv23: "Bestandsgrootte :",
            textv24: "Bestandspad :",
            textv25: "zoom",
            textv26: "Audio knippen",
            textv27: "Selecteer uw audiobestand, stel het begin- en eindpunt in en sla het resultaat op!",

            textv2000: "DOWNLOADEN & CONVERTEREN",
            textv2001: "Zoekresultaten...",
            textv2002: "Video",
            textv2003: "Audio",
            textv2004: "Download je favoriete video's van verschillende populaire platforms. Converteer ze indien nodig met slechts een paar klikken! Sla ze vervolgens offline op. MP3-audioformaat, evenals andere videoformaten voor diverse doeleinden. Ondersteuning voor meerdere platforms: Begrijp de diversiteit aan videobronnen die je leuk vindt. Deze functie ondersteunt het downloaden van video's van verschillende populaire platforms, zoals: YouTube, Facebook, Instagram en nog veel meer. Eenvoudig proces: Kopieer en plak de videolink (URL) in het daarvoor bestemde veld en het systeem doet het werk automatisch.",

            textv000: "OVER MAKEN",
            textv001: "ALGEMENE VOORWAARDEN",
            textv002: "1. Verzamelde informatie. Vanwege de aard van deze applicatie, die gericht is op offline gebruik, wordt de verzameling van persoonsgegevens tot een minimum beperkt. Dit is de informatie die we mogelijk verzamelen:",
            textv003: "2. Hoe gebruikt deze dienst uw gegevens? De verzamelde gegevens worden uitsluitend voor de volgende doeleinden gebruikt?",
            textv004: "3. Uitleg over machtigingen. De applicatie heeft verschillende machtigingen nodig om correct te functioneren. Dit is de uitleg:",
            textv005: "4. Privacy: focus op belangrijkste functies",
            textv006: "5. Gegevensbeveiliging en derden: implementeert redelijke technische beveiligingsmaatregelen om de verwerkte gegevens te beschermen. Deze dienst deelt uw persoonsgegevens niet met derden.",
            textv007: "6. Wijzigingen in het privacybeleid. De dienst kan dit privacybeleid van tijd tot tijd bijwerken. De applicatie zal u op de hoogte stellen van eventuele wijzigingen door een nieuw privacybeleid op deze pagina of via een in-app bericht te plaatsen. melding!",
            textv008: "7. Contact Als u vragen heeft over dit privacybeleid, kunt u contact met ons opnemen via [E-mailadres voor ondersteuning].",

            textv1000: "Heb altijd en overal toegang tot je volledige muziekcollectie zonder je zorgen te hoeven maken over datalimieten of een slecht signaal. Sla je nummers gewoon op in de app en geniet van een naadloze luisterervaring. (audio knippen) Knip audio naar jouw smaak. De audioknipfunctie geeft je volledige controle over je favoriete deel van elk nummer. Wil je een unieke ringtone maken van je favoriete refrein, of gewoon luisteren naar de iconische intro? Met de audiokniptool kun je eenvoudig een specifiek segment van een audiobestand selecteren en apart opslaan. Hoge precisie zorgt ervoor dat je elke keer de perfecte knipbeurt krijgt. (downloader) Downloaden en opslaan in twee populaire formaten. Je kunt kiezen uit twee populaire formaten, afhankelijk van je wensen:",
            textv1001: "MP3: Ideaal voor compacte audiobestanden met een uitstekende geluidskwaliteit. Perfect om op meerdere apparaten te luisteren en opslagruimte te besparen.",
            textv1002: "MP4: Hoewel vaak geassocieerd met video's, kan het MP4-formaat ook audio van hoge kwaliteit. Dit is vooral handig als u content downloadt met mogelijk rijkere metadata of als u deze later in een videoproject wilt gebruiken. Met een combinatie van offline afspelen, nauwkeurig audio bijsnijden en flexibele downloadopties is deze muziekspeler de ultieme oplossing voor al uw audiobehoeften.",
            textv1003: "Wij zetten ons in voor de bescherming van de privacy en veiligheid van uw persoonsgegevens. Dit privacybeleid legt uit welke informatie wordt verzameld, hoe deze wordt gebruikt en welke rechten u hebt met betrekking tot uw gegevens bij het gebruik van de app. Het hoofddoel is om een lichtgewicht offline muziekspeler te bieden. Transparantie is essentieel en zorgt ervoor dat u zich veilig voelt bij het gebruik van de service.",
            textv1004: "• deze service scant, uploadt of bewaart uw persoonlijke muziekcollectie NIET op uw apparaat.",
            textv1005: "Informatie die niet actief wordt verzameld:",
            textv1006: "• deze service verzamelt geen persoonlijk identificeerbare informatie zoals uw naam, e-mailadres of telefoonnummer, tenzij u vrijwillig contact met ons opneemt voor technische ondersteuning.",
            textv1007: "• Automatisch verzamelde informatie (niet-persoonlijke gegevens):",
            textv1008: "• Diagnostische gegevens en crashrapporten: deze service verzamelt anonieme technische gegevens wanneer de app een fout ervaart of crasht. Deze informatie omvat het apparaattype, de versie van het besturingssysteem en foutlogboeken. Deze gegevens zijn belangrijk voor het oplossen van bugs en het verbeteren van de stabiliteit.",
            textv1009: "• Gegevens over functiegebruik (anoniem): de service kan anonieme statistische gegevens verzamelen over welke functies het vaakst worden gebruikt (bijvoorbeeld hoe vaak de functie voor het inkorten van audio wordt gebruikt). Dit helpt de behoeften van gebruikers te begrijpen en zich te richten op de ontwikkeling van relevante functies.",
            textv1010: "Functiespecifieke informatie:",
            textv1011: "• Downloader-functie: wanneer u deze functie gebruikt, moet de app de URL die u invoert verwerken. De service slaat GEEN geschiedenis op van de URL's die u downloadt, samen met uw identiteit. Er kunnen echter tijdelijke technische logboeken op de server worden aangemaakt om downloads te verwerken verzoeken.",
            textv1012: "• De service waarborgen en onderhouden: Om ervoor te zorgen dat alle functies van de app naar behoren werken.",
            textv1013: "• De app-kwaliteit verbeteren: Diagnostische gegevens en crashrapporten helpen ons team om technische problemen snel te identificeren en op te lossen.",
            textv1014: "• Gebruikersbehoeften begrijpen: Anonieme gegevens worden alleen gebruikt om beslissingen te nemen over toekomstige functieontwikkeling.",
            textv1015: "• Uw verzoek verwerken: De URL die in de downloadfunctie is ingevoerd, wordt slechts voor één doel gebruikt: het downloaden van het door u aangevraagde bestand naar de lokale opslag van uw apparaat.",
            textv1016: "Toestemming voor opslagtoegang (LEZEN/SCHRIJVEN_EXTERNE_OPSLAG):",
            textv1017: "Waarom is dit nodig? Deze toestemming is vereist zodat de app het volgende kan doen:",
            textv1018: "• Muziekbestanden scannen en weergeven op uw apparaat.",
            textv1019: "• Audio opslaan bestanden die u hebt bijgesneden met de functie Audio bijsnijden.",
            textv1020: "• Sla de bestanden op die u downloadt via de downloadfunctie.",
            textv1021: "• Uw privacy: Deze app heeft alleen toegang tot audiobestanden. We openen, wijzigen of verzamelen geen foto's, documenten of andere persoonlijke bestanden.",
            textv1022: "• Toestemming voor internettoegang (INTERNET)",
            textv1023: "Waarom is dit nodig? Deze toestemming is alleen nodig voor:",
            textv1024: "• Downloadfunctie om verbinding te maken met de server en bestanden te downloaden vanaf de URL die u opgeeft.",
            textv1025: "• Anonieme crashrapporten verzenden.",
            textv1026: "• Offline muziekspeler en audioknipper: Alle scan-, afspeel- en knipprocessen voor audio gebeuren volledig lokaal op uw apparaat (offline). Er worden nooit audiobestanden geüpload of verzonden naar onze servers, noch origineel noch bewerkt.",
            textv1027: "Functies Downloader:",
            textv1028: "• De dienst fungeert slechts als tussenpersoon om content te downloaden van de URL die u opgeeft.",
            textv1029: "Belangrijk (Disclaimer auteursrecht) U bent als enige verantwoordelijk voor de content die u downloadt. Zorg ervoor dat u het recht of de toestemming hebt om de content te downloaden en op te slaan. Deze applicatie is bedoeld voor gebruik met auteursrechtvrije content of content waarvan u wettelijk eigenaar bent. Inbreuk op het auteursrecht is de verantwoordelijkheid van de gebruiker."
        },
        pgB: {
            textv01: "Português- (Brasil)",
            //          textv02: "Tema",
            textv03: "Cortar Áudio",
            textv04: "Downloader",
            textv05: "Temporizador de Suspensão",
            textv06: "Excluir Lista de Reprodução",
            textv07: "Informações",
            textv2: "Música",
            textv3: "Artistas",
            textv4: "Álbuns",
            textv5: "Listas de Reprodução",
            textv6: "Artista",
            textv7: "Verificar Pastas de Música",
            //        textv8: "Músicas por Artista",
            //         textv9: "Músicas por Álbum",
            //       textv10: "Minhas Listas de Reprodução",
            textv11: "Músicas Favoritas",
            textv12: "Nenhuma música está sendo reproduzida",
            textv10: "Nenhuma música está sendo reproduzida",
            textv13: "Nenhuma música está sendo reproduzida",
            textv14: "Informações da Música",
            textv15: "Criar uma nova playlist",
            textv16: "Artista",
            textv17: "SELECIONE O HORÁRIO",
            textv18: "Tem certeza de que deseja excluir esta playlist?",
            textv19: "Título :",
            textv20: "Artista :",
            textv21: "Álbumb:",
            textv22: "Duração :",
            textv23: "Tamanho do arquivo :",
            textv24: "Caminho do arquivo :",
            textv25: "zoom",
            textv26: "cortar áudio",
            textv27: "Selecione seu arquivo de áudio, defina os pontos de corte inicial e final e salve o resultado!",

            textv000: "SOBRE A CRIAÇÃO",
            textv001: "TERMOS E CONDIÇÕES",
            textv002: "1. Informações coletadas. Devido à natureza deste aplicativo, que se concentra no uso offline, minimizamos a coleta de dados pessoais. Aqui estão as informações que podemos coletar:",
            textv003: "2. Como este serviço usa suas informações? Os dados coletados são usados exclusivamente para os seguintes propósitos?",
            textv004: "3. Explicação das permissões. O aplicativo requer várias permissões para funcionar corretamente. Aqui está a explicação:",
            textv005: "4. Privacidade. Foco nos principais recursos",
            textv006: "5. Segurança de dados e terceiros. Implementa medidas técnicas de segurança razoáveis para proteger os dados processados. Este serviço não compartilha seus dados pessoais com terceiros.",
            textv007: "6. Alterações na Política de Privacidade. O serviço pode atualizar esta Política de Privacidade periodicamente. O aplicativo notificará você sobre quaisquer alterações publicando uma nova Política de Privacidade nesta página ou por meio de um aviso no aplicativo. notificação!",
            textv008: "7. Contato. Caso tenha alguma dúvida sobre esta Política de Privacidade, sinta-se à vontade para entrar em contato conosco pelo e-mail [Endereço de e-mail do suporte].",

            textv1000: "Acesse toda a sua coleção de músicas a qualquer hora, em qualquer lugar, sem se preocupar com limites de dados ou sinal fraco. Basta salvar suas músicas no aplicativo e curtir uma audição perfeita. ( cortar áudio ) Corte o áudio ao seu gosto O recurso de corte de áudio oferece controle total sobre sua parte favorita de qualquer música. Quer criar um toque exclusivo a partir do seu refrão favorito ou apenas ouvir a introdução icônica? Com a ferramenta de corte de áudio, você pode selecionar facilmente um segmento específico de um arquivo de áudio e salvá-lo separadamente. A alta precisão garante o corte perfeito sempre. ( downloader ) Baixe e salve em dois formatos populares Você pode escolher entre dois formatos populares de acordo com sua necessidade :",
            textv1001: "MP3: Ideal para arquivos de áudio compactos com excelente qualidade sonora. Perfeito para ouvir em vários dispositivos e economizar espaço de armazenamento.",
            textv1002: "MP4: Embora frequentemente associado a vídeos, o formato MP4 também pode armazenar áudio de alta qualidade. Isso é especialmente útil se você estiver baixando conteúdo que pode ter metadados mais ricos ou se planeja usá-lo em um projeto de vídeo posteriormente. Com uma combinação de reprodução offline, corte preciso de áudio e opções flexíveis de download, este reprodutor de música é a solução definitiva para todas as suas necessidades de áudio.",
            textv1003: "Estamos comprometidos em proteger a privacidade e a segurança das suas informações pessoais. Esta política de privacidade explica quais informações são coletadas, como são usadas e quais são seus direitos em relação aos seus dados ao usar o aplicativo. O objetivo principal é fornecer um reprodutor de música offline leve. A transparência é fundamental e garante que você se sinta seguro ao usar o serviço.",
            textv1004: "• este serviço NÃO escaneia, carrega ou armazena sua coleção pessoal de músicas no seu dispositivo.",
            textv1005: "Informações não coletadas ativamente:",
            textv1006: "• este serviço não coleta informações de identificação pessoal, como seu nome, endereço de e-mail ou número de telefone, a menos que você entre em contato conosco voluntariamente para obter suporte técnico.",
            textv1007: "• Informações coletadas automaticamente (dados não pessoais):",
            textv1008: "• Dados de diagnóstico e relatórios de falhas: este serviço coleta dados técnicos anônimos quando o aplicativo apresenta erros ou trava. Essas informações incluem o tipo de dispositivo, a versão do sistema operacional e os registros de erros. Esses dados são importantes para corrigir bugs e melhorar a estabilidade.",
            textv1009: "• Dados de uso de recursos (anônimos): o serviço pode coletar dados estatísticos anônimos sobre quais recursos são usados com mais frequência (por exemplo, com que frequência o recurso de corte de áudio é usado). Isso ajuda a entender as necessidades do usuário e a focar no desenvolvimento de características.",
            textv1010: "Informações específicas do recurso:",
            textv1011: "• Recurso de download: quando você usa este recurso, o aplicativo precisa processar a URL inserida. O serviço NÃO armazena um histórico das URLs baixadas, juntamente com sua identidade. No entanto, registros técnicos temporários podem ser criados no servidor para processar solicitações de download.",
            textv1012: "• Garantir e manter o serviço: para garantir que todos os recursos do aplicativo estejam funcionando corretamente.",
            textv1013: "• Melhorar a qualidade do aplicativo: dados de diagnóstico e relatórios de falhas ajudam nossa equipe a identificar e corrigir problemas técnicos rapidamente.",
            textv1014: "• Entender as necessidades do usuário: dados anônimos são usados apenas para tomar decisões sobre o desenvolvimento de recursos futuros.",
            textv1015: "• Processar sua solicitação: a URL inserida no recurso de download é usada para uma única finalidade: baixar o arquivo solicitado para o armazenamento local do seu dispositivo.",
            textv1016: "Permissão de acesso ao armazenamento (LEITURA/GRAVAÇÃO_ARMAZENAMENTO_EXTERNO):",
            textv1017: "Por que isso é necessário? Essa permissão é necessária para que o aplicativo possa:",
            textv1018: "• Escanear e exibir arquivos de música no seu dispositivo.",
            textv1019: "• Salvar arquivos de áudio que você cortou usando o recurso Cortar Áudio.",
            textv1020: "• Salve os arquivos que você baixar por meio do recurso Downloader.",
            textv1021: "• Sua privacidade: Este aplicativo acessará apenas arquivos de áudio. Não acessamos, modificamos ou coletamos fotos, documentos ou outros arquivos pessoais.",
            textv1022: "• Permissão de acesso à Internet (INTERNET)",
            textv1023: "Por que isso é necessário? Esta permissão é necessária apenas para:",
            textv1024: "• Função Downloader para conectar-se ao servidor e baixar arquivos da URL fornecida.",
            textv1025: "• Enviar relatórios de falhas anônimos.",
            textv1026: "• Reprodutor de música offline e cortador de áudio: Todos os processos de digitalização, reprodução e corte de áudio ocorrem inteiramente localmente no seu dispositivo (offline). Nenhum arquivo de áudio — original ou editado — é carregado ou enviado para nossos servidores.",
            textv1027: "Recursos Downloader:",
            textv1028: "• O serviço atua apenas como intermediário para baixar conteúdo da URL fornecida por você.",
            textv1029: "Importante (Isenção de Direitos Autorais) Você é o único responsável pelo conteúdo que baixa. Certifique-se de ter o direito ou a permissão para baixar e armazenar o conteúdo. Este aplicativo destina-se ao uso com conteúdo livre de direitos autorais ou conteúdo que você legalmente possui. A violação de direitos autorais é de responsabilidade do usuário."
        },
        slv: {
            textv01: "Россия- (Rusia)",
            //         textv02: "Тема",
            textv03: "Обрезать аудио",
            textv04: "Загрузчик",
            textv05: "Таймер сна",
            textv06: "Удалить плейлист",
            textv07: "Информация",
            textv2: "Музыка",
            textv3: "Исполнители",
            textv4: "Альбомы",
            textv5: "Плейлисты",
            textv6: "Исполнитель",
            textv7: "Сканировать папки с музыкой",
            //         textv8: "Музыка по исполнителю",
            //     textv9: "Музыка по альбому",
            //      textv10: "Мои плейлисты",
            textv11: "Избранные песни",
            textv12: "Сейчас нет воспроизводимых песен",
            textv10: "Сейчас нет воспроизводимых песен",
            textv13: "Сейчас нет воспроизводимых песен",
            textv14: "Информация о песне",
            textv15: "Создать новый плейлист",
            textv16: "Исполнитель",
            textv17: "ВЫБРАТЬ ВРЕМЯ",
            textv18: "Вы уверены, что хотите удалить этот плейлист?",
            textv19: "Название :",
            textv20: "Исполнительb:",
            textv21: "Альбом :",
            textv22: "Продолжительность :",
            textv23: "Размер файла :",
            textv24: "Путь к файлу :",
            textv25: "зум",
            textv26: "вырезать аудио",
            textv27: "Выберите аудиофайл, задайте начальную и конечную точки обрезки, затем сохраните результат!",

            textv2000: "СКАЧАТЬ И КОНВЕРТИРОВАТЬ",
            textv2001: "результаты поиска...",
            textv2002: "видео",
            textv2003: "аудио",
            textv2004: "Загружайте любимые видео с различных популярных платформ. Конвертируйте их по мере необходимости всего за несколько кликов! А затем сохраняйте офлайн. Аудиоформат MP3, а также другие видеоформаты для различных целей. Поддержка различных платформ: оцените разнообразие источников видео, которые вам нравятся. Эта функция поддерживает загрузку видео с различных популярных платформ, таких как: YouTube, Facebook, Instagram и многих других. Простой процесс: просто скопируйте и вставьте ссылку на видео (URL) в соответствующее поле, и система сделает всё автоматически",

            textv000: "О СОЗДАНИИ",
            textv001: "УСЛОВИЯ И ПОЛОЖЕНИЯ",
            textv002: "1. Информация, собираемая В связи с характером этого приложения, которое ориентировано на использование в автономном режиме. сводит к минимуму сбор персональных данных. Вот информация, которую мы можем собирать:",
            textv003: "2. Как этот сервис использует вашу информацию? Собранные данные используются исключительно для следующих целей?",
            textv004: "3. Объяснение разрешений. Для правильной работы приложению требуется несколько разрешений. Вот объяснение:",
            textv005: "4. Конфиденциальность, фокусирующаяся на ключевых функциях",
            textv006: "5. Безопасность данных и третьи лица, реализует разумные технические меры безопасности для защиты обработанных данных. этот сервис не передает ваши персональные данные третьим лицам.",
            textv007: "6. Изменения в Политике конфиденциальности. Сервис может время от времени обновлять эту Политику конфиденциальности. Приложение уведомит вас о любых изменениях, разместив новую Политику конфиденциальности на этой странице или через уведомление в приложении!",
            textv008: "7. Контакты Если у вас есть какие-либо вопросы об этой Политике конфиденциальности, свяжитесь с нами по адресу [Адрес электронной почты службы поддержки]",

            textv1000: "получайте доступ ко всей своей музыкальной коллекции в любое время и в любом месте, не беспокоясь об ограничениях данных или плохом сигнале. Просто сохраняйте свои песни в приложении и наслаждайтесь безупречным прослушиванием. (вырезать аудио) Вырезать аудио по своему вкусу Функция обрезки аудио дает вам полный контроль над любимой частью любой песни. Хотите создать уникальный рингтон из любимого припева или просто послушать культовое вступление? С помощью инструмента обрезки аудио вы можете легко выбрать определенный фрагмент аудиофайла и сохранить его отдельно. Высокая точность гарантирует, что вы каждый раз получите идеальную нарезку. (загрузчик) Загрузка и сохранение в двух популярных форматах Вы можете выбрать один из двух популярных форматов в соответствии с вашими требованиями :",
            textv1001: "MP3: Идеально подходит для компактных аудиофайлов с превосходным качеством звука. Идеально подходит для прослушивания на нескольких устройствах и экономии места на диске.",
            textv1002: "MP4: Хотя формат MP4 часто ассоциируется с видео, он также может хранить высококачественный звук. Это особенно полезно, если вы загружаете контент, который может иметь более подробные метаданные, или если вы планируете использовать его в видеопроекте позже. Благодаря сочетанию автономного воспроизведения, точной обрезки звука и гибких параметров загрузки этот музыкальный проигрыватель является оптимальным решением для всех ваших аудиопотребностей.",
            textv1003: "Мы стремимся защищать конфиденциальность и безопасность ваших персональных данных. Эта политика конфиденциальности объясняет, какая информация собирается, как она используется и какие права у вас есть на ваши данные при использовании приложения. Основная цель — предложить легкий офлайн-музыкальный проигрыватель. Прозрачность имеет важное значение и обеспечивает вашу безопасность при использовании сервиса.",

            textv1005: "Информация, которая не собирается активно:",
            textv1006: "• Эта служба не собирает персональные данные, такие как ваше имя, адрес электронной почты или номер телефона, если вы добровольно не обратитесь к нам за технической поддержкой.",
            textv1007: "• Автоматически собираемая информация (неперсональные данные):",
            textv1008: "• Диагностические данные и отчеты о сбоях: эта служба собирает анонимные технические данные, когда приложение сталкивается с ошибкой или сбоями. Эта информация включает тип устройства, версию операционной системы и журналы ошибок. Эти данные важны для исправления ошибок и повышения стабильности.",
            textv1009: "• Данные об использовании функций (анонимные): служба может собирать анонимные статистические данные о том, какие функции используются чаще всего (например, как часто используется функция обрезки звука). Это помогает понять потребности пользователей и сосредоточиться на разработке соответствующих функций.",
            textv1010: "Информация о конкретной функции:",
            textv1011: "• Функция загрузчика: при использовании этой функции приложению необходимо обработать введенный вами URL-адрес. Служба НЕ хранит историю загружаемых вами URL-адресов вместе с вашей личностью. Однако на сервере могут создаваться временные технические журналы для обработки запросов на загрузку.",
            textv1012: "• Обеспечение и поддержка работы службы: для обеспечения правильной работы всех функций приложения.",
            textv1013: "• Улучшение качества приложения: диагностические данные и отчеты о сбоях помогают нашей команде быстро выявлять и устранять технические проблемы.",
            textv1014: "• Понимание потребностей пользователей: анонимные данные используются только для принятия решений о разработке будущих функций.",
            textv1015: "• Обработка вашего запроса: URL-адрес, введенный в функцию загрузчика, используется только для одной цели: для загрузки запрошенного вами файла в локальное хранилище вашего устройства.",
            textv1016: "Разрешение на доступ к хранилищу (ЧТЕНИЕ/ЗАПИСЬ_ВНЕШНЕГО_ХРАНИЛИЩА):",
            textv1017: "Зачем это нужно? Это разрешение необходимо приложению для :",
            textv1018: "• Сканировать и отображать музыкальные файлы на вашем устройстве.",
            textv1019: "• Сохранять аудиофайлы, которые вы обрезали с помощью функции обрезки аудио.",
            textv1020: "• Сохранять файлы, которые вы загружаете с помощью функции загрузчика.",
            textv1021: "• Ваша конфиденциальность: это приложение будет иметь доступ только к аудиофайлам. Мы не получаем доступ, не изменяем и не собираем фотографии, документы или другие личные файлы.",
            textv1022: "• Разрешение на доступ в Интернет (ИНТЕРНЕТ)",
            textv1023: "Зачем это нужно? Это разрешение необходимо только для :",
            textv1024: "• Функции загрузчика для подключения к сервер и загрузите файлы с предоставленного вами URL-адреса.",
            textv1025: "• Отправлять анонимные отчеты о сбоях.",
            textv1026: "• Автономный музыкальный проигрыватель и аудиорезка: все процессы сканирования, воспроизведения и резки аудио происходят полностью локально на вашем устройстве (офлайн). Никакие аудиофайлы — как оригинальные, так и отредактированные — никогда не загружаются и не отправляются на наши серверы.",
            textv1027: "Возможности загрузчика:",
            textv1028: "• служба выступает только в качестве посредника для загрузки контента с предоставленного вами URL-адреса.",
            textv1029: "Важно (отказ от авторских прав) вы несете исключительную ответственность за загружаемый вами контент. Убедитесь, что у вас есть права или разрешение на загрузку и хранение контента. Это приложение предназначено для использования с контентом, не защищенным авторскими правами, или контентом, которым вы законно владеете. Нарушение авторских прав является ответственностью пользователя."

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
            //     if (textToTranslateV8) {
            //            textToTranslateV8.textContent = translationsV2[lang].textv8;
            //        }
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
            if (textToTranslateV21) {
                textToTranslateV21.textContent = translationsV2[lang].textv21;
            }
            if (textToTranslateV22) {
                textToTranslateV22.textContent = translationsV2[lang].textv22;
            }
            if (textToTranslateV23) {
                textToTranslateV23.textContent = translationsV2[lang].textv23;
            }
            if (textToTranslateV24) {
                textToTranslateV24.textContent = translationsV2[lang].textv24;
            }
            if (textToTranslateV25) {
                textToTranslateV25.textContent = translationsV2[lang].textv25;
            }
            if (textToTranslateV26) {
                textToTranslateV26.textContent = translationsV2[lang].textv26;
            }
            if (textToTranslateV27) {
                textToTranslateV27.textContent = translationsV2[lang].textv27;
            }


            if (textToTranslateV000) {
                textToTranslateV000.textContent = translationsV2[lang].textv000;
            }
            if (textToTranslateV001) {
                textToTranslateV001.textContent = translationsV2[lang].textv001;
            }
            if (textToTranslateV002) {
                textToTranslateV002.textContent = translationsV2[lang].textv002;
            }
            if (textToTranslateV003) {
                textToTranslateV003.textContent = translationsV2[lang].textv003;
            }
            if (textToTranslateV004) {
                textToTranslateV004.textContent = translationsV2[lang].textv004;
            }
            if (textToTranslateV005) {
                textToTranslateV005.textContent = translationsV2[lang].textv005;
            }
            if (textToTranslateV006) {
                textToTranslateV006.textContent = translationsV2[lang].textv006;
            }
            if (textToTranslateV007) {
                textToTranslateV007.textContent = translationsV2[lang].textv007;
            }
            if (textToTranslateV008) {
                textToTranslateV008.textContent = translationsV2[lang].textv008;
            }
            if (textToTranslateV009) {
                textToTranslateV009.textContent = translationsV2[lang].textv009;
            }



            if (textToTranslateV2000) {
                textToTranslateV2000.textContent = translationsV2[lang].textv2000;
            }
            if (textToTranslateV2001) {
                textToTranslateV2001.textContent = translationsV2[lang].textv2001;
            }
            if (textToTranslateV2002) {
                textToTranslateV2002.textContent = translationsV2[lang].textv2002;
            }
            if (textToTranslateV2003) {
                textToTranslateV2003.textContent = translationsV2[lang].textv2003;
            }
            if (textToTranslateV2004) {
                textToTranslateV2004.textContent = translationsV2[lang].textv2004;
            }



            if (textToTranslateV1000) {
                textToTranslateV1000.textContent = translationsV2[lang].textv1000;
            }
            if (textToTranslateV1001) {
                textToTranslateV1001.textContent = translationsV2[lang].textv1001;
            }
            if (textToTranslateV1002) {
                textToTranslateV1002.textContent = translationsV2[lang].textv1002;
            }
            if (textToTranslateV1003) {
                textToTranslateV1003.textContent = translationsV2[lang].textv1003;
            }
            if (textToTranslateV1004) {
                textToTranslateV1004.textContent = translationsV2[lang].textv1004;
            }
            if (textToTranslateV1005) {
                textToTranslateV1005.textContent = translationsV2[lang].textv1005;

            }
            if (textToTranslateV1006) {
                textToTranslateV1006.textContent = translationsV2[lang].textv1006;

            }
            if (textToTranslateV1007) {
                textToTranslateV1007.textContent = translationsV2[lang].textv1007;

            }
            if (textToTranslateV1008) {
                textToTranslateV1008.textContent = translationsV2[lang].textv1008;

            }
            if (textToTranslateV1009) {
                textToTranslateV1009.textContent = translationsV2[lang].textv1009;

            }
            if (textToTranslateV1010) {
                textToTranslateV1010.textContent = translationsV2[lang].textv1010;

            }
            if (textToTranslateV1011) {
                textToTranslateV1011.textContent = translationsV2[lang].textv1011;

            }
            if (textToTranslateV1012) {
                textToTranslateV1012.textContent = translationsV2[lang].textv1012;

            }
            if (textToTranslateV1013) {
                textToTranslateV1013.textContent = translationsV2[lang].textv1013;

            }
            if (textToTranslateV1014) {
                textToTranslateV1014.textContent = translationsV2[lang].textv1014;

            }
            if (textToTranslateV1015) {
                textToTranslateV1015.textContent = translationsV2[lang].textv1015;

            }
            if (textToTranslateV1016) {
                textToTranslateV1016.textContent = translationsV2[lang].textv1016;
            }
            if (textToTranslateV1017) {
                textToTranslateV1017.textContent = translationsV2[lang].textv1017;
            }
            if (textToTranslateV1018) {
                textToTranslateV1018.textContent = translationsV2[lang].textv1018;
            }
            if (textToTranslateV1019) {
                textToTranslateV1019.textContent = translationsV2[lang].textv1019;
            }
            if (textToTranslateV1020) {
                textToTranslateV1020.textContent = translationsV2[lang].textv1020;
            }
            if (textToTranslateV1021) {
                textToTranslateV1021.textContent = translationsV2[lang].textv1021;
            }
            if (textToTranslateV1022) {
                textToTranslateV1022.textContent = translationsV2[lang].textv1022;
            }
            if (textToTranslateV1023) {
                textToTranslateV1023.textContent = translationsV2[lang].textv1023;
            }
            if (textToTranslateV1024) {
                textToTranslateV1024.textContent = translationsV2[lang].textv1024;
            }
            if (textToTranslateV1025) {
                textToTranslateV1025.textContent = translationsV2[lang].textv1025;
            }
            if (textToTranslateV1026) {
                textToTranslateV1026.textContent = translationsV2[lang].textv1026;
            }
            if (textToTranslateV1027) {
                textToTranslateV1027.textContent = translationsV2[lang].textv1027;
            }
            if (textToTranslateV1028) {
                textToTranslateV1028.textContent = translationsV2[lang].textv1028;
            }
            if (textToTranslateV1029) {
                textToTranslateV1029.textContent = translationsV2[lang].textv1029;
            }

            // Opsional: Simpan bahasa yang dipilih di localStorage
            localStorage.setItem('selectedLangV2', lang);
        }
    }

    // Event Listener untuk tombol "BAHASA" (languageToggleV2)
    languageToggleV2.addEventListener('click', (e) => {
        e.preventDefault(); // Mencegah link dari melakukan navigasi atau scroll ke atas
        // Mengganti kelas 'open' pada languageOptionsV2
        languageOptionsV2.classList.toggle('open');
    });

    // Event Listener untuk pilihan bahasa di dalam daftar (languageOptionsV2)
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
            darkModeToggle.innerHTML = `<i class="${iconClass}"></i>&nbsp;Tema ${text}`;
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

    // Event Listener untuk tombol "Downloader" di sideMenu
    if (downloadConvertBtn) {
        downloadConvertBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showOverlayView(downloadConvertView); // Pastikan showOverlayView terdefinisi
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

    // Fungsi untuk menginisialisasi AudioContext (dipanggil saat interaksi pengguna pertama)
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
            backgroundVideoPlayer.classList.remove('is-loaded'); // Sembunyikan
            // Jika Anda pernah menggunakan srcObject (jarang untuk file lokal)
            if (backgroundVideoPlayer.srcObject) {
                backgroundVideoPlayer.srcObject = null;
            }
        }

        if (currentPlayingMediaBlobUrl) {
            URL.revokeObjectURL(currentPlayingMediaBlobUrl);
            currentPlayingMediaBlobUrl = null;
        }

        if (addToPlaylistBtn) addToPlaylistBtn.classList.remove('active');

        if ('clearAppBadge' in navigator) {
            navigator.clearAppBadge()
            .then(() => console.log('[Badging API] Badge cleared on UI reset'))
            .catch(error => console.error('[Badging API] Gagal menghapus badge:', error));
        }
    }

    // --- FUNGSI BARU UNTUK EKSTRAKSI THUMBNAIL

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
        'rmx': 'remix.png',
        'remix': 'remix.png',
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
        'dangdut': 'music.png',
        'lagu': 'rawkimura.jpeg',
        'foundations': 'pop.png',
        'denny': 'dc.jpeg',
        'music': 'music-com.png',
        'official': 'official.jpg',
        'jazz': 'jazz.jpeg',
        'dj': 'rawyeon.jpg',
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
    function renderMusicList(list, targetUl, isPlaylist = false) {
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
            const albumName = fileData.album || "Album Tidak diketahui"; // Fallback jika tidak ada info album

            if (!albumList[albumName]) {
                albumList[albumName] = [];
            }
            albumList[albumName].push(fileData);
        });
        console.log("Album List Built:",
            albumList);
    }

    function renderAlbumList() {
        albumListUl.innerHTML = ''; // Kosongkan daftar sebelumnya

        if (Object.keys(albumList).length === 0) {
            albumListUl.innerHTML = '<li class="no-items">Tidak ada album yang ditemukan.</li>';
            return;
        }

        const albumNames = Object.keys(albumList).sort((a, b) => a.localeCompare(b)); // Urutkan secara alfabetis

        albumNames.forEach(albumName => {
            const albumSongs = albumList[albumName];
            //  BARIS PENTING: Mendapatkan URL Thumbnail Album

            const albumThumbnailUrl = albumSongs[0]?.thumbnailUrl || '';
            const albumItem = document.createElement('li');
            albumItem.className = 'categorized-item';

            albumItem.dataset.albumName = albumName;

            const fallbackSvgContent = `<svg class="icon-album-fallback" viewBox="0 0 511.999 511.999" xmlns="http://www.03.org/03/svg" fill="rgb(0, 0, 0, 0.1);"><path style="fill:rgb(0, 0, 0, 0.2);" d="M502.817,324.13l-128.79-128.79l-111.921-35.666h-62.995l-39.422,164.092l177.326,175.135 C417.475,472.081,480.156,406.404,502.817,324.13z"></path> <path style="fill:#FFEDB5;" d="M247.33,142.141c-81.898-0.271-137.814,54.174-124.476,119.117 c12.803,62.345,84.973,110.211,160.851,109.144c75.012-1.055,129.733-49.683,122.749-110.756 C399.188,196.084,328.223,142.408,247.33,142.141z M280.3,349.036c-38.11,0.474-76.316-38.371-85.394-88.186 c-9.378-51.46,15.806-94.392,56.308-94.334c40.255,0.059,78.519,42.615,85.48,93.529C343.436,309.346,318.19,348.563,280.3,349.036z "></path> <path style="fill:#FEE187;" d="M406.456,259.646c-7.042-61.585-73.878-113.888-151.604-117.326v24.317 c38.898,2.513,75.093,44.027,81.844,93.405c6.74,49.304-18.504,88.523-56.394,88.993c-8.59,0.107-17.184-1.801-25.45-5.365v24.795 c9.48,1.396,19.135,2.074,28.855,1.938C358.719,369.347,413.439,320.719,406.456,259.646z"></path> </g></svg></svg>`;

            albumItem.innerHTML = `
            <div class="item-thumbnail" style="background-image: url('${albumThumbnailUrl}');">
            ${fallbackSvgContent} </div>
            <div class="item-info">
            <div class="item-title">${albumName}</div>
            <div class="item-count">${albumSongs.length} lagu</div>
            </div>
            <button class="play-all-btn" data-album-name="${albumName}" title="Putar semua lagu di album ini">
            </button>
            `;
            albumListUl.appendChild(albumItem);


            // Logika Fallback Gambar
            const thumbnailDiv = albumItem.querySelector('.item-thumbnail');
            if (albumThumbnailUrl) {
                // Cek jika albumThumbnailUrl tidak kosong
                const img = new Image();
                img.src = albumThumbnailUrl;
                img.onload = () => {};
                img.onerror = () => {
                    // Gambar gagal dimuat, tambahkan kelas untuk menampilkan ikon fallback
                    thumbnailDiv.classList.add('no-thumbnail');
                };
            } else {
                // Tidak ada URL thumbnail, langsung tambahkan kelas untuk menampilkan ikon fallback
                thumbnailDiv.classList.add('no-thumbnail');
            }

            // Akhir Logika Fallback
            albumItem.querySelector('.item-thumbnail').addEventListener('click', (e) => {
                const clickedAlbumName = e.currentTarget.parentNode.dataset.albumName;
                displaySongsInAlbum(clickedAlbumName);
            });

            albumItem.querySelector('.play-all-btn').addEventListener('click', (e) => {
                const albumToPlay = e.currentTarget.dataset.albumName;
                if (albumList[albumToPlay] && albumList[albumToPlay].length > 0) {
                    currentPlayingList = [...albumList[albumToPlay]];
                    currentTrackIndex = 0;
                    loadTrack(currentTrackIndex);

                    playPauseToggle(true);
                    displayCategory('music'); // Kembali ke tampilan musik untuk melihat playlist
                }
            });
        });
    }

    function displaySongsInAlbum(albumName) {
        if (albumList[albumName]) {
            const songsInAlbum = albumList[albumName];

            displayCategory('music', songsInAlbum, `Album dari : ${albumName} (${songsInAlbum.length} Lagu)`);

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
            albumCategory.querySelector('.page-description').textContent = '';
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
            // Penting: Pastikan 'fileURL' diakses di sini. Anda bisa menyimpannya sebagai variabel di scope luar
            // atau sebagai properti dari audioPlayer. Misalnya: audioPlayer.currentObjectURL
            // Untuk saat ini, asumsikan fileURL tersedia.
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
                renderVideoList(); // <-- Tambahan: Render ulang daftar video
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
    // --- MODIFIKASI FUNGSI clearAllMediaFromDB ---
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
            console.log("Search input changed. Searching for:", searchInput.value);
            const searchTerm = searchInput.value.toLowerCase();
            const filteredSongs = allMusicFiles.filter(track =>
                (parseTrackInfo(track.name).title.toLowerCase().includes(searchTerm) ||
                    parseTrackInfo(track.name).artist.toLowerCase().includes(searchTerm))
            );
            displayCategory('music');
            musicCategory.querySelector('.page-description').textContent = `Hasil Pencarian untuk "${searchInput.value}"`;
            renderMusicList(filteredSongs, musicListUl);
            currentPlayingList = filteredSongs;
            updateActiveSongInUI();
        });
    }


    // ============================================
    // OVERLAY All PAGE  DOWN - CUT - ABS
    // ===========================================

    cutAudioFileInput.addEventListener('change', async (event) => {
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

            const apiEndpoint = 'http://127.0.0.1:5000/api/download'; // Alamat API back-end

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
        navigator.serviceWorker.register('#')
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