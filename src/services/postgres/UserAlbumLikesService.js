const { nanoid } = require("nanoid");
const { Pool } = require("pg");
const InvariantError = require("../../exceptions/InvariantError");

class UserAlbumLikesService {
  constructor() {
    this._pool = new Pool();
  }

  async likeAlbum(userId, albumId) {
    const id = `user-album-like-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id",
      values: [id, userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError("Gagal melakukan like");
    }

    return result.rows[0].id;
  }

  async unlikeAlbum(userId, albumId) {
    const query = {
      text: "DELETE from user_album_likes WHERE user_id = $1 AND album_id = $2 RETURNING id",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError("Gagal menghapus like");
    }
  }

  async getAlbumLikes(albumId) {
    const query = {
      text: "SELECT * FROM user_album_likes WHERE album_id = $1",
      values: [albumId],
    };

    const result = await this._pool.query(query);

    return result.rowCount;
  }

  async verifyAlbumLikes(userId, albumId) {
    const query = {
      text: "SELECT * FROM user_album_likes WHERE user_id = $1 AND album_id = $2",
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (result.rowCount) {
      throw new InvariantError("Gagal menyukai album yang sama");
    }
  }
}

module.exports = UserAlbumLikesService;
