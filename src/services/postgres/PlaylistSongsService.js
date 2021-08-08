const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistSongsService {
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  async getPlaylistSongs(playlistId) {
    try {
      const result = await this._cacheService.get(`playlistSongs:${playlistId}`);
      return JSON.parse(result);
    } catch (error) {
      const query = {
        text: `SELECT songs.id, songs.title, songs.performer
        FROM songs
        INNER JOIN playlistsongs ON playlistsongs.song_id = songs.id
        INNER JOIN playlists ON playlists.id = playlistsongs.playlist_id
        WHERE playlists.id = $1`,
        values: [playlistId],
      };

      const result = await this._pool.query(query);

      if (!result.rowCount) {
        throw new InvariantError('Gagal mengambil lagu dari playlist');
      }

      await this._cacheService.set(`playlistSongs:${playlistId}`, JSON.stringify(result.rows));
      return result.rows;
    }
  }
}

module.exports = PlaylistSongsService;
