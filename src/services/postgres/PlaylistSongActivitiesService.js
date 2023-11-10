const { nanoid } = require("nanoid");
const { Pool } = require("pg");

class PlaylistSongActivitiesService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylistSongActivities({
    playlistId,
    songId,
    userId,
    action,
    time,
  }) {
    const id = `activity-${nanoid(16)}`;

    const query = {
      text: "INSERT INTO playlist_song_activities VALUES($1, $2, $3, $4, $5, $6) RETURNING id",
      values: [id, playlistId, songId, userId, action, time],
    };

    await this._pool.query(query);
  }

  async getPlaylistSongActivities(playlistId) {
    const query = {
      text: `SELECT u.username, s.title, a.action, a.time FROM playlist_song_activities a
        LEFT JOIN users u ON u.id = a.user_id
        LEFT JOIN songs s ON s.id = a.song_id
        WHERE a.playlist_id = $1
        ORDER BY a.action`,
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    return result.rows;
  }
}

module.exports = PlaylistSongActivitiesService;
