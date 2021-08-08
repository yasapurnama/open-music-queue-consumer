const { Pool } = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistNameById(playlistId) {
    const query = {
      text: 'SELECT name FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rowCount) {
      throw new InvariantError('Gagal mengambil nama playlist');
    }

    return result.rows[0].name;
  }
}

module.exports = PlaylistsService;
