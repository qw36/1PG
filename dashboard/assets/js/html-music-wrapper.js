class HTMLMusicWrapper {
  #music;

  set apiError(error) {
    (error)
      ? $('#musicAPIError').removeClass('d-none')
      : $('#musicAPIError').addClass('d-none');

    $('#musicAPIError').text(error?.message);
  }

  constructor(musicClient) {
    this.#music = musicClient;

    setInterval(() => this.updateSlider(), 1000); // correct binding
  }

  timestamp(seconds) {
    const track = this.#music.list[0];
    if (!track) return '00:00';

    seconds ??= track?.seconds;

    const remainderSeconds = seconds % 60;
    const minutes = Math.floor(seconds / 60);
    return `${minutes.toString().padStart(2, '0')}:${remainderSeconds.toString().padStart(2, '0')}`;
  }

  updateSlider(position) {
    const track = this.#music.list[0];
    const isDraggingTrack = $('#seekInput input:focus');
    if (this.#music.paused || !track) return;

    const current = $('#seekTrack input').val();  
    const newPosition = position ?? (+current + 1);

    $('#seekTrack input').val(newPosition);
    $('#seekTrack .current').text(this.timestamp(position));
  }

  #htmlTrack(track) {
    return `
      <div class="media">
        <img class="mr-3" src="${track.thumbnail}">
        <div class="media-body">
          <div class="float-left">
            <h5 class="mt-0">${track.title}</h5>
            <p class="lead">${track.author.name}</p>
          </div>
          <div class="float-right">
            <span class="text-muted">${track.duration.timestamp}</span>
            <button class="remove btn text-danger">x</button>
          </div>
        </div>
      </div>
    `;
  }

  updateList() {
    $('.track-list').html(
      this.#music.list.map(this.#htmlTrack).join()
    );

    const track = this.#music.list[0];
    $('.now-playing').attr('hidden', track);
    $('.now-playing .current').text(this.timestamp(this.#music.position));
    $('.now-playing .duration').text(this.timestamp());
    
    $('#seekTrack input').attr('max', track?.duration.seconds);
    
    $('.track-list .remove').on('click', async () => {
      const index = $('.track-list .remove').index('.remove');
      await this.#music.remove(index);
    });

    if (track) {
      $('.now-playing img').attr('src', track.thumbnail);
      $('.now-playing h2').attr('src', track.title);
      $('.now-playing p').attr('src', track.author.name);
    }
  }

  toggle() {
    $('#toggleTrack i').toggleClass('fa-play');
    $('#toggleTrack i').toggleClass('fa-pause');
  }
}
