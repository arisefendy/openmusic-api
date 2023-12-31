const autoBind = require("auto-bind");

class PlaylistSongActivitiesHandler {
  constructor(playlistsService, playlistSongActivitiesService) {
    this._playlistsService = playlistsService;
    this._playlistSongActivitiesService = playlistSongActivitiesService;

    autoBind(this);
  }

  async getPlaylistActivitiesHandler(request, h) {
    const { id: playlistId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistsService.getPlaylistById(playlistId);
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const activities =
      await this._playlistSongActivitiesService.getPlaylistSongActivities(
        playlistId
      );

    const response = h.response({
      status: "success",
      data: {
        playlistId,
        activities,
      },
    });
    response.code(200);
    return response;
  }
}

module.exports = PlaylistSongActivitiesHandler;
