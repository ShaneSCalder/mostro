/* ============================ */
/* Monstro Streaming Script     */
/* js/monstro-streaming.js      */
/* ============================ */

document.addEventListener('DOMContentLoaded', function() {

    const songModalElement = document.getElementById('songModal');

    if (songModalElement) {
      songModalElement.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget; // Button that triggered the modal

        // Extract info from data-* attributes
        const songTitle = button.getAttribute('data-song-title');
        const artistName = button.getAttribute('data-artist-name');
        const albumName = button.getAttribute('data-album-name');
        const genre = button.getAttribute('data-genre');
        const imageSrc = button.getAttribute('data-image-src');
        const previewSrc = button.getAttribute('data-preview-src');
        const fullSrc = button.getAttribute('data-full-src');
        const mood = button.getAttribute('data-mood');
        const writer = button.getAttribute('data-writer');
        const producer = button.getAttribute('data-producer');
        const publisher = button.getAttribute('data-publisher');

        // Get modal elements by their IDs
        const modalTitle = songModalElement.querySelector('#songModalLabel');
        const modalSongTitleH4 = songModalElement.querySelector('#modalSongTitle');
        const modalArtistNameP = songModalElement.querySelector('#modalArtistName');
        const modalImage = songModalElement.querySelector('#modalSongImage');
        const modalPreviewAudio = songModalElement.querySelector('#modalPreviewAudio');
        const modalFullAudio = songModalElement.querySelector('#modalFullAudio');
        const modalAlbumDd = songModalElement.querySelector('#modalAlbumName');
        const modalGenreDd = songModalElement.querySelector('#modalGenre');
        const modalMoodDd = songModalElement.querySelector('#modalMood');
        const modalWriterDd = songModalElement.querySelector('#modalWriter');
        const modalProducerDd = songModalElement.querySelector('#modalProducer');
        const modalPublisherDd = songModalElement.querySelector('#modalPublisher');


        // Update the modal's content (with fallbacks)
        if (modalTitle) modalTitle.textContent = songTitle || 'Song Details';
        if (modalSongTitleH4) modalSongTitleH4.textContent = songTitle || 'N/A';
        if (modalArtistNameP) modalArtistNameP.textContent = artistName || 'N/A';
        if (modalImage) modalImage.src = imageSrc || 'https://via.placeholder.com/200x200/eee/888?text=Art'; // Fallback
        if (modalAlbumDd) modalAlbumDd.textContent = albumName || '-';
        if (modalGenreDd) modalGenreDd.textContent = genre || '-';
        if (modalMoodDd) modalMoodDd.textContent = mood || '-';
        if (modalWriterDd) modalWriterDd.textContent = writer || '-';
        if (modalProducerDd) modalProducerDd.textContent = producer || '-';
        if (modalPublisherDd) modalPublisherDd.textContent = publisher || '-';

        // Update audio sources safely
        const updateAudioSource = (audioElement, src) => {
            if (audioElement) {
                audioElement.innerHTML = ''; // Clear previous sources/text
                if (src) {
                    const sourceEl = document.createElement('source');
                    sourceEl.setAttribute('src', src);
                    // Attempt basic type detection or default
                    let type = 'audio/mpeg'; // Default MP3
                    if (src.endsWith('.ogg')) type = 'audio/ogg';
                    if (src.endsWith('.wav')) type = 'audio/wav';
                    sourceEl.setAttribute('type', type);
                    audioElement.appendChild(sourceEl);
                    audioElement.load(); // Important: reload the audio element
                } else {
                    // Optionally display a message if no source
                    // audioElement.innerHTML = '<span>Audio not available.</span>';
                }
            }
        };

        updateAudioSource(modalPreviewAudio, previewSrc);
        updateAudioSource(modalFullAudio, fullSrc);

      }); // End show.bs.modal listener

       // Stop audio when modal is hidden
       songModalElement.addEventListener('hide.bs.modal', function (event) {
           const modalPreviewAudio = songModalElement.querySelector('#modalPreviewAudio');
           const modalFullAudio = songModalElement.querySelector('#modalFullAudio');
           if (modalPreviewAudio) modalPreviewAudio.pause();
           if (modalFullAudio) modalFullAudio.pause();
       }); // End hide.bs.modal listener

    } // end check for songModalElement

    console.log("Monstro Streaming Page JS Loaded");

}); // End DOMContentLoaded