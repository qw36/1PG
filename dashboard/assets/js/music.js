$(async () => {
  const music = new MusicWrapper();
  await music.updateList();

  // separated based on this binding
  $('#trackSearch').on('click', async () => {
    const searchQuery = $('.q-control input').val();
    await music.play(searchQuery);
  });  
  $('#toggleTrack').on('click', () => music.toggle());
  $('#stopTrack').on('click', () => music.stop());  
  $('#skipTrack').on('click', () => music.skip());
  $('#shuffleList').on('click', () => music.shuffle());
  
  // separated based on this binding
  $('#volume input').on('change', async function() {
    const value = $(this).val(); // value from 0 - 100
    await music.setVolume(value / 100);
  });  
  $('#seekTrack input').on('change', async function() {
    const seconds = $(this).val();
    await music.seek(seconds);
  });
});
