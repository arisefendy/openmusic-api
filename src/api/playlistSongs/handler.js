const autoBind = require("auto-bind");
const { mapPlaylistDB } = require("../../utils");

class PlaylistSongsHandler {
  constructor(
    songsService,
    playlistsService,
    playlistSongsService,
    playlistSongActivitiesService,
    validator
  ) {
    this._songsService = songsService;
    this._playlistsService = playlistsService;
    this._playlistSongsService = playlistSongsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;
    this._validator = validator;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);

    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    await this._playlistSongsService.addPlaylistSong({ playlistId, songId });

    const action = "add";
    const time = new Date().toISOString();
    await this._playlistSongActivitiesService.addPlaylistSongActivities({
      playlistId,
      songId,
      userId: credentialId,
      action,
      time,
    });

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

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
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
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._playlistSongsService.deletePlaylistSong(playlistId, songId);

    const action = "delete";
    const time = new Date().toISOString();
    await this._playlistSongActivitiesService.addPlaylistSongActivities({
      playlistId,
      songId,
      userId: credentialId,
      action,
      time,
    });

    const response = h.response({
      status: "success",
      message: "Lagu berhasil dihapus dari playlist",
    });
    return response;
  }
}

module.exports = PlaylistSongsHandler;
