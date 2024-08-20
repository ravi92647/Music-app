import React, { useState } from 'react';
import SongList from './SongList';
import AddSongForm from './AddSongForm';

function Playlist() {
  const [songs, setSongs] = useState([]);

  const addSong = (song) => {
    setSongs([...songs, song]);
  };

  return (
    <div>
      <AddSongForm addSong={addSong} />
      <SongList songs={songs} />
    </div>
  );
}

export default Playlist;
