class MusicWrapper {
  #endpoint = `/api/guilds/${guildId}/music`;
  #html = new HTMLMusicWrapper(this);

  paused = false;
  position = 0;
  list = [];

  async #fetch(action) {
    this.apiError = null;

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
      this.#html.apiError = error;
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
    this.paused = !this.paused;
    await this.#fetch(`toggle`);
    
    this.#html.toggle();
  }
  async seek(seconds) {
    await this.#fetch(`seek?to=${seconds}`);
    await this.updateList();

    this.#html.updateSlider(seconds);
  }

  async shuffle() {
    await this.#fetch(`shuffle`);
    await this.updateList();
  }
  async remove(index) {
    await this.#fetch(`remove?index=${index}`);
    await this.updateList();
  }

  async setVolume(value) {
    await this.#fetch(`volume?v=${value}`);
  }

  async updateList() {
    this.list = await this.#fetch(`list`);
    this.#html.updateList();
  }
}
