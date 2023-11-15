/* eslint-disable camelcase */
const mapAlbumsDB = ({ id, name, year, cover }, song) => ({
  id,
  name,
  year,
  coverUrl: cover,
  songs: song,
});

const mapSongsDB = ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

const mapPlaylistDB = ({ id, name, username }, song) => ({
  id,
  name,
  username,
  songs: song,
});

module.exports = { mapAlbumsDB, mapSongsDB, mapPlaylistDB };
