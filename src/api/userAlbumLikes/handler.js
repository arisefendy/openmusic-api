const autoBind = require("auto-bind");

class UserAlbumLikes {
  constructor(userAlbumLikesService, albumsService) {
    this._userAlbumLikesService = userAlbumLikesService;
    this._albumsService = albumsService;

    autoBind(this);
  }

  async postAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._userAlbumLikesService.verifyAlbumLikes(credentialId, albumId);
    await this._userAlbumLikesService.likeAlbum(credentialId, albumId);

    const response = h.response({
      status: "success",
      message: "Berhasil menyukai album",
    });
    response.code(201);
    return response;
  }

  async deleteAlbumLikeHandler(request, h) {
    const { id: albumId } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._albumsService.getAlbumById(albumId);
    await this._userAlbumLikesService.unlikeAlbum(credentialId, albumId);

    const response = h.response({
      status: "success",
      message: "Batal menyukai album",
    });
    return response;
  }

  async getAlbumLikesHandler(request, h) {
    const { id: albumId } = request.params;

    await this._albumsService.getAlbumById(albumId);
    const likes = await this._userAlbumLikesService.getAlbumLikes(albumId);

    const response = h.response({
      status: "success",
      data: {
        likes,
      },
    });
    return response;
  }
}

module.exports = UserAlbumLikes;
