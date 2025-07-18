// service-worker.js
importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.4.1/workbox-sw.js');

if (workbox) {
    console.log(`🎉 Workbox is loaded!`);

    // Precache file penting (tidak termasuk video)
    workbox.precaching.precacheAndRoute([
        { url: 'index2.html', revision: 'html-v5' }, 
        { url: 'style2.css', revision: 'css-v7' },
        { url: 'Font/Font-awesome/css/all.min.css', revision: 'fa-css-v1' },
        { url: 'script2.js', revision: 'js-v29' }, 
        { url: 'Filter/jsmediatags.min.js', revision: 'jsmedia-v1' }, 
        { url: 'service-worker.js', revision: 'sw-v11' }, 
        { url: 'manifest.json', revision: 'manifest-v2' },

        // Gambar
        { url: 'headphone-com.png', revision: 'img-headphone-v1' },
        { url: 'music.png', revision: 'img-music-v1' },
        { url: 'logoX.jpg', revision: 'img-logo-v1' },
        { url: 'sky.jpg', revision: 'img-v1' },
        { url: 'raworange.jpg', revision: 'img-v1' },
        { url: 'rawyeon.jpg', revision: 'img-v1' },
        { url: 'neonJeoa.jpg', revision: 'img-v1' },
        { url: 'rawkimura.jpeg', revision: 'img-v1' },
        { url: 'Official.jpg', revision: 'img-v1' },    
        { url: 'dc.jpeg', revision: 'img-v1' },    
        { url: 'slowmo.jpg', revision: 'img-v1' },
        { url: 'natural.jpg', revision: 'img-v1' },
        { url: 'jazz.jpeg', revision: 'img-v1' }, 
        { url: 'rap.jpeg', revision: 'img-v1' },    
        { url: 'remix.png', revision: 'img-v1' },

        // Font lokal (jika tidak pakai CDN)
        { url: 'Font/Font-awesome/webfonts/fa-solid-900.woff2', revision: 'fa-woff2-solid-v1' },
        { url: 'Font/Font-awesome/webfonts/fa-brands-400.woff2', revision: 'fa-woff2-brands-v1' },
        { url: 'Font/Font-awesome/webfonts/fa-regular-400.woff2', revision: 'fa-woff2-regular-v1' },
    ]);

    // Aktifkan klaim klien dan skip waiting
    workbox.core.clientsClaim();
    workbox.core.skipWaiting();

    // Cache file media seperti gambar, font, video saat diakses (tidak preload)
    workbox.routing.registerRoute(
        new RegExp('.*\\.(?:png|jpg|jpeg|svg|gif|woff2|woff|ttf|otf)$'),
        new workbox.strategies.CacheFirst({
            cacheName: 'static-assets-cache',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 50,
                    maxAgeSeconds: 30 * 24 * 60 * 60, // 30 hari
                }),
            ],
        })
    );

    // Video di-cache hanya saat dibuka, bukan saat preload
    workbox.routing.registerRoute(
        new RegExp('.*\\.(?:mp4|webm)$'),
        new workbox.strategies.CacheFirst({
            cacheName: 'video-cache',
            plugins: [
                new workbox.expiration.ExpirationPlugin({
                    maxEntries: 10,
                    maxAgeSeconds: 7 * 24 * 60 * 60, // 7 hari
                }),
            ],
        })
    );

} else {
    console.log(`🚨 Workbox failed to load. Offline capabilities might be limited.`);
}
