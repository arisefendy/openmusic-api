const UserAlbumLikes = require("./handler");
const routes = require("./routes");

module.exports = {
  name: "userAlbumLikes",
  version: "1.0.0",
  register: async (server, { userAlbumLikesService, albumsService }) => {
    const userAlbumLikes = new UserAlbumLikes(
      userAlbumLikesService,
      albumsService
    );
    server.route(routes(userAlbumLikes));
  },
};
