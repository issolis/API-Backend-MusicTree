import { Album } from '../tables/Album.js';
import { Artist } from '../tables/Artist.js'; // Asegúrate de que tiene un método para buscar por nombre
import pool from '../tables/DBConnection.js';

export class AlbumGeneration {
  static async createFromJson(data) {
    const { albums = [] } = data;
    const client = await pool.connect();
    const errors = [];
    const insertedAlbums = [];

    try {
      await client.query('BEGIN');

      for (const albumData of albums) {
        const {
          artist_name,
          title,
          release_date,
          duration,
          url_cover
        } = albumData;

        try {
          const artistResult = await Artist.getIdByName(artist_name);
          if (!artistResult.success) {
            errors.push(`Artist not found: ${artist_name}`);
            continue;
          }

          const album = new Album({
            title,
            release_date,
            duration,
            url_cover,
            artist_id: artistResult.id
          });

          const albumInsertResult = await album.insert(client); // Pasamos client
          if (!albumInsertResult.success) {
            errors.push(`Failed to insert album "${title}": ${albumInsertResult.message}`);
          } else {
            insertedAlbums.push(albumInsertResult.id);
          }
        } catch (err) {
          errors.push(`Exception while processing album "${title}": ${err.message}`);
        }
      }

      if (errors.length > 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Some albums failed to insert',
          errors
        };
      }

      await client.query('COMMIT');
      return {
        success: true,
        message: 'All albums inserted successfully',
        albumIds: insertedAlbums
      };
    } catch (err) {
      await client.query('ROLLBACK');
      return {
        success: false,
        message: 'Unexpected error during album insertion',
        errors: [err.message, ...errors]
      };
    } finally {
      client.release();
    }
  }
}
