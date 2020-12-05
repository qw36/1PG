class MusicWrapper {
  #endpoint = `/api/guilds/${guildId}/music`;

  set apiError(error) {
    $('#musicAPIError').removeClass('d-none');
    console.dir(error);
    console.log(error.error);
    console.log(error.message);
    $('#musicAPIError').text(error?.message);
  }

  paused = false;
  list = [];

  async #fetch(action) {
    try {
      const res = await fetch(
        `${this.#endpoint}/${action}`,
        { headers: { 'Authorization': key }}
      );
      const json = await res.json();
      if (res.status === 400)
        throw json;

      return json;
    } catch (error) {
      this.apiError = error;
    }
  }

  async play(query) {
    await this.#fetch(`play?q=${query}`);
    await this.updateList();
  }

  async stop() {
    await this.#fetch(`stop`);
    await this.updateList();
  }

  async skip() {
    await this.#fetch(`skip`);
    await this.updateList();
  }

  async toggle() {
    this.paused = false;
    await this.#fetch(`toggle`);
  }

  async remove(index) {
    await this.#fetch(`remove?index=${index}`);
    await this.updateList();
  }

  async setVolume(value) {
    await this.#fetch(`volume?v=${value}`);
  }

  async seek(percentage) {
    const relativeSeconds = (percentage / 100) * this.list[0]?.duration.seconds;
    await this.#fetch(`seek?to=${relativeSeconds}`);
    await this.updateList();
  }

  async updateList() {
    this.list = await this.#fetch(`list`);

    $('.track-list').html(
      this.list.map(this.#htmlTrack).join()
    );

    const track = this.list[0];
    $('.now-playing').attr('hidden', this.list.length <= 0);
    $('.now-playing .current').text(track.duration.seconds);
    $('.now-playing .duration').text(track.duration.timestamp);
  }

  #htmlTrack(track) {
    console.log(track);
    return `
      <div class="media">
        <img class="mr-3" src="${track.thumbnail}">
        <div class="media-body">
          <div class="float-left">
            <h5 class="mt-0">${track.title}</h5>
            <p class="lead">${track.author.name}></p>
          </div>
          <div class="float-right">
            <span class="text-muted">${track.duration.timestamp}</span>
            <button class="remove btn text-danger">x</button>
          </div>
        </div>
      </div>
    `;
  }
}

const music = new MusicWrapper();

$(async () => {
  await music.updateList();
});

$('#trackSearch').on('click', async () => {
  const searchQuery = $('.q-control input').val();
  await music.play(searchQuery);
});

$('#stopTrack').on('click', async () => {
  await music.stop();
});

$('#toggleTrack').on('click', async function() {
  $('#toggleTrack i').toggleClass('fa-play');
  $('#toggleTrack i').toggleClass('fa-pause');

  await music.toggle();
});

$('#volume input').on('change', async function() {
  const value = $(this).val(); // value from 0 - 100
  await music.setVolume(value / 100);
});

$('#seekTrack input').on('change', async function() {
  const value = $(this).val();
  await music.seek(value);
});

$('.remove').on('click', async function() {
  const index = $(this).index('.remove');
  await music.remove(index);
});
