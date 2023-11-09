const PlaylistSongsHandler = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "playlistSongs",
  version: "1.0.0",
  register: async (
    server,
    { songsService, playlistsService, playlistSongsService, validator }
  ) => {
    const playlistSongsHandler = new PlaylistSongsHandler(
      songsService,
      playlistsService,
      playlistSongsService,
      validator
    );
    server.route(routes(playlistSongsHandler));
  },
};
