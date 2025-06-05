import { Genre } from '../tables/Genre.js';
import { ArtistGenre } from '../tables/ArtistGenre.js';
import { ActivityPeriod } from '../tables/ActivityPeriod.js';
import { Artist } from '../tables/Artist.js';
import pool from '../tables/DBConnection.js';

export class ArtistGeneration {
  constructor({
    name,
    biography = '',
    country = '',
    active = true,
    url_cover = '',
    creation_year,
    associated_genre,
    associated_subgenre,
    activity_ranges = []
  }) {
    this.name = name;
    this.biography = biography;
    this.country = country;
    this.active = active;
    this.url_cover = url_cover;
    this.creation_year = creation_year;
    this.associated_genre = associated_genre;
    this.associated_subgenre = associated_subgenre;
    this.activity_ranges = activity_ranges;

    this.errors = [];
    this.artistId = null;
  }

  async insert() {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const artist = new Artist({
        name: this.name,
        biography: this.biography,
        country: this.country,
        active: this.active,
        urlCover: this.url_cover,
        date: new Date(this.creation_year, 0, 1)
      });

      const artistInsertResult = await artist.insert();
      if (!artistInsertResult.success) {
        this.errors.push(`Artist insert error: ${artistInsertResult.message}`);
      } else {
        this.artistId = artistInsertResult.id;
      }

      if (!this.artistId) {
        this.errors.push('Artist ID not generated, skipping related inserts');
      } else {
        // Insert Activity Periods
        for (const [start, end] of this.activity_ranges) {
          const period = new ActivityPeriod({
            startP: start,
            endP: end,
            artist_id: this.artistId
          });
          const periodInsertResult = await period.insert();
          if (!periodInsertResult.success) {
            this.errors.push(`Activity period insert error (${start}-${end}): ${periodInsertResult.message}`);
          }
        }

        // Insert associated genre
        if (this.associated_genre) {
          const genreResult = await Genre.getIdByName(this.associated_genre);
          if (!genreResult.success) {
            this.errors.push(`Genre not found: ${this.associated_genre}`);
          } else {
            const genreId = genreResult.id;
            const ag = new ArtistGenre({ artist_id: this.artistId, genre_id: genreId });
            const agResult = await ag.insert();
            if (!agResult.success) {
              this.errors.push(`Genre insert error (${this.associated_genre}): ${agResult.message}`);
            }
          }
        }

        // Insert associated subgenre
        if (this.associated_subgenre) {
          const subgenreResult = await Genre.getIdByName(this.associated_subgenre);
          if (!subgenreResult.success) {
            this.errors.push(`Subgenre not found: ${this.associated_subgenre}`);
          } else {
            const subgenreId = subgenreResult.id;
            const subAg = new ArtistGenre({ artist_id: this.artistId, genre_id: subgenreId });
            const subAgResult = await subAg.insert();
            if (!subAgResult.success) {
              this.errors.push(`Subgenre insert error (${this.associated_subgenre}): ${subAgResult.message}`);
            }
          }
        }
      }

      if (this.errors.length > 0) {
        await client.query('ROLLBACK');
        return {
          success: false,
          message: 'Some errors occurred during creation',
          errors: this.errors
        };
      }

      await client.query('COMMIT');
      return {
        success: true,
        message: 'Artist and related data created successfully',
        artistId: this.artistId
      };

    } catch (outerError) {
      await client.query('ROLLBACK');
      return {
        success: false,
        message: 'Unexpected error during creation',
        errors: [outerError.message, ...this.errors]
      };
    } finally {
      client.release();
    }
  }
}
