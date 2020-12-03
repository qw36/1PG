class MusicWrapper {
  #endpoint = `/api/guilds/${guildId}/music`;

  set apiError(value) {
    $('#musicAPIError').removeClass('d-none');
    $('#musicAPIError').text(value?.message);
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
      if (json.code === 400)
        throw new TypeError(json);
      return json;
    } catch (error) {
      this.apiError = error;
    }
  }

  async play(query) {
    const track = await this.#fetch(`play?q=${query}`);
    this.list.push(track);
  }

  async stop() {
    await this.#fetch(`stop`);
    await this.updateList();
  }

  async skip() {
    await this.#fetch(`skip`);
    this.list.shift();
  }

  async toggle() {
    this.paused = false;
    await this.#fetch(`toggle`);
  }

  async remove(index) {
    await this.#fetch(`remove?index=${index}`);
    this.list.splice(index, 1);
  }

  async updateList() {
    this.list = await this.#fetch(`list`);
    console.log(this.list);

    $('.track-list').html(JSON.stringify(this.list));
  }
}

const music = new MusicWrapper();

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

$('.remove').on('click', async function() {
  const index = $(this).index('.remove');
  await music.remove(index);
});