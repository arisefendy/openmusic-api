const autoBind = require("auto-bind");
const { mapPlaylistDB } = require("../../utils");

class PlaylistSongsHandler {
  constructor(songsService, playlistsService, playlistSongsService, validator) {
    this._songsService = songsService;
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    await this._playlistSongsService.addPlaylistSong({ playlistId, songId });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil ditambahkan ke playlist",
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongsHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const playlist =
      await this._playlistSongsService.getPlaylistSongs(playlistId);

    const mappingPlaylist = mapPlaylistDB(playlist.playlist, playlist.songs);

    const response = h.response({
      status: "success",
      data: {
        playlist: mappingPlaylist,
      },
    });
    return response;
  }

  async deletePlaylistSongHandler(request, h) {
    const { id } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistOwner(id, credentialId);
    await this._playlistSongsService.deletePlaylistSong(id, songId);

    const response = h.response({
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    });
    return response;
  }
}

module.exports = PlaylistSongsHandler;
