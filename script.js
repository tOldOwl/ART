// =========================================================================
// 1. MULTI-ARTIST AUTOMATIC YOUTUBE RECONCILER
// =========================================================================
const API_KEY = 'AIzaSyBuXqiFnTh8Qb_aY3rd_-yb-HNcJmkOvA4';

// =========================================================================
// ARTIST UPLOAD PLAYLISTS
// =========================================================================

const ARTIST_PLAYLISTS = [
    {
        name: 'Chloe Art',
        id: 'UUtoIqaAuvP6rWCvFOdxKVpA'
    },
    {
        name: 'Jooni Art',
        id: 'UUjkGAyhG0Q6H4_gzdfTMg-g'
    },
    {
        name: 'URArt',
        id: 'UU3hCdJZXe9k52K6FIzUBLeA'
    }
];


// =========================================================================
// NUMBER OF VIDEOS
// =========================================================================

const VIDEOS_PER_ARTIST = 10;


// =========================================================================
// LOAD ALL YOUTUBE VIDEOS
// =========================================================================

async function loadLatestVideos() {

    const videoFeed =
        document.getElementById('youtube-video-container');

    if (!videoFeed) {
        console.error(
            'youtube-video-container was not found.'
        );
        return;
    }


    // Clear the existing contents
    videoFeed.innerHTML = '';


    // Array containing videos from all three artists
    const allVideos = [];


    // ---------------------------------------------------------------------
    // GET 10 VIDEOS FROM EACH ARTIST
    // ---------------------------------------------------------------------

    for (const artist of ARTIST_PLAYLISTS) {

        const url =
            'https://www.googleapis.com/youtube/v3/playlistItems' +
            '?part=snippet' +
            '&playlistId=' +
            encodeURIComponent(artist.id) +
            '&maxResults=' +
            VIDEOS_PER_ARTIST +
            '&key=' +
            encodeURIComponent(API_KEY);


        try {

            const response = await fetch(url);


            // -------------------------------------------------------------
            // YOUTUBE REQUEST ERROR
            // -------------------------------------------------------------

            if (!response.ok) {

                const errorText =
                    await response.text();

                console.error(
                    'YouTube request failed for ' +
                    artist.name +
                    ': ' +
                    response.status,
                    errorText
                );

                continue;
            }


            const data =
                await response.json();


            // -------------------------------------------------------------
            // NO VIDEOS
            // -------------------------------------------------------------

            if (
                !data.items ||
                data.items.length === 0
            ) {

                console.warn(
                    'No videos found for ' +
                    artist.name
                );

                continue;
            }


            // -------------------------------------------------------------
            // ADD THE VIDEOS TO THE MASTER ARRAY
            // -------------------------------------------------------------

            for (const item of data.items) {

                const snippet =
                    item.snippet;


                // Ignore invalid/deleted videos
                if (
                    !snippet ||
                    !snippet.resourceId ||
                    !snippet.resourceId.videoId
                ) {
                    continue;
                }


                const videoId =
                    snippet.resourceId.videoId;


                // ---------------------------------------------------------
                // FIND BEST AVAILABLE THUMBNAIL
                // ---------------------------------------------------------

                let thumbnail = '';


                if (
                    snippet.thumbnails &&
                    snippet.thumbnails.maxres
                ) {

                    thumbnail =
                        snippet.thumbnails.maxres.url;

                } else if (
                    snippet.thumbnails &&
                    snippet.thumbnails.high
                ) {

                    thumbnail =
                        snippet.thumbnails.high.url;

                } else if (
                    snippet.thumbnails &&
                    snippet.thumbnails.medium
                ) {

                    thumbnail =
                        snippet.thumbnails.medium.url;

                } else if (
                    snippet.thumbnails &&
                    snippet.thumbnails.default
                ) {

                    thumbnail =
                        snippet.thumbnails.default.url;
                }


                // ---------------------------------------------------------
                // ADD VIDEO
                // ---------------------------------------------------------

                allVideos.push({

                    artist:
                        artist.name,

                    videoId:
                        videoId,

                    title:
                        snippet.title,

                    publishedAt:
                        snippet.publishedAt,

                    thumbnail:
                        thumbnail
                });
            }


        } catch (error) {

            console.error(
                'Failed to load videos for ' +
                artist.name,
                error
            );
        }
    }


    // =========================================================================
    // SORT ALL 30 VIDEOS BY PUBLICATION DATE
    // =========================================================================

    allVideos.sort(function (a, b) {

        return (
            new Date(b.publishedAt) -
            new Date(a.publishedAt)
        );

    });


    // =========================================================================
    // CREATE THE VIDEO CARDS
    // =========================================================================

    for (const video of allVideos) {

        const card =
            document.createElement('div');


        card.className =
            'youtube-card-item';


        // -------------------------------------------------------------
        // FORMAT DATE
        // -------------------------------------------------------------

        const publishedDate =
            new Date(video.publishedAt);


        const formattedDate =
            publishedDate.toLocaleDateString(
                undefined,
                {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }
            );


        // -------------------------------------------------------------
        // YOUTUBE URL
        // -------------------------------------------------------------

        const videoUrl =
            'https://www.youtube.com/watch?v=' +
            encodeURIComponent(video.videoId);


        // -------------------------------------------------------------
        // CARD
        // -------------------------------------------------------------

        card.innerHTML = `

            <div class="card-header">

                <h3>
                    ${escapeHTML(video.title)}
                </h3>

            </div>


            <div class="card-thumbnail">

                <a
                    href="${videoUrl}"
                    target="_blank"
                    rel="noopener noreferrer"
                >

                    <img
                        src="${video.thumbnail}"
                        alt="${escapeHTML(video.artist)} - ${escapeHTML(video.title)}"
                    >

                </a>

            </div>


            <div class="card-footer">

                <p class="artist-name">
                    ${escapeHTML(video.artist)}
                </p>

                <p class="video-date">
                    ${formattedDate}
                </p>

            </div>

        `;


        // Put the card inside the bordered feed block
        videoFeed.appendChild(card);
    }


    // =========================================================================
    // REPORT HOW MANY VIDEOS WERE LOADED
    // =========================================================================

    console.log(
        'YouTube videos loaded:',
        allVideos.length
    );


    // =========================================================================
    // NO VIDEOS MESSAGE
    // =========================================================================

    if (allVideos.length === 0) {

        videoFeed.innerHTML = `

            <p class="youtube-feed-message">
                No YouTube videos could be loaded.
            </p>

        `;

        return;
    }


    // =========================================================================
    // INITIALIZE THE SCROLL BUTTONS
    // =========================================================================

    initializeYouTubeScroll(videoFeed);
}


// =========================================================================
// HORIZONTAL SCROLL BUTTONS
// =========================================================================

function initializeYouTubeScroll(videoFeed) {

    const leftArrow =
        document.querySelector(
            '.youtube-scroll-left'
        );


    const rightArrow =
        document.querySelector(
            '.youtube-scroll-right'
        );


    // ---------------------------------------------------------------------
    // LEFT BUTTON
    // ---------------------------------------------------------------------

    if (leftArrow) {

        leftArrow.onclick = function () {

            videoFeed.scrollBy({

                left: -600,

                behavior: 'smooth'

            });

        };
    }


    // ---------------------------------------------------------------------
    // RIGHT BUTTON
    // ---------------------------------------------------------------------

    if (rightArrow) {

        rightArrow.onclick = function () {

            videoFeed.scrollBy({

                left: 600,

                behavior: 'smooth'

            });

        };
    }
}


// =========================================================================
// HTML SAFETY
// =========================================================================

function escapeHTML(value) {

    const div =
        document.createElement('div');


    div.textContent =
        value;


    return div.innerHTML;
}


// =========================================================================
// INITIALIZE PAGE
// =========================================================================

function initializePage() {

    // Keep this if another part of your website uses it.
    if (
        typeof populateArtSlots ===
        'function'
    ) {

        populateArtSlots();
    }


    loadLatestVideos();
}


// =========================================================================
// START
// =========================================================================

if (
    document.readyState ===
    'loading'
) {

    document.addEventListener(
        'DOMContentLoaded',
        initializePage
    );

} else {

    initializePage();
}
