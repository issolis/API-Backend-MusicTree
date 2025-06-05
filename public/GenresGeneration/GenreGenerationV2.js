import { Genre } from '../tables/Genre.js';
import { ID } from '../Calculations/ID.js';
import { MGPC } from '../Calculations/MGPC.js';
import { SubgenreRelation } from '../tables/SubgenreRelation.js';
import { MGPCRelation } from '../tables/MGPCRelation.js';
import { Cluster } from '../tables/Cluster.js';
import { ClusterGenreRelation } from '../tables/ClusterGenreRelation.js';

export class GenreGenerationV2 {
  constructor({
    name,
    description,
    activate_ID,
    BPM_lower_limit,
    BPM_upper_limit,
    average_mode,
    compass_time,
    tone,
    color,
    average_duration,
    is_subgenre,
    father_genre,
    country,
    creation_year,
    typical_volume,
    relationships = [],
    subjective_influence = [],
    associated_cluster
  }) {
    this.name = name;
    this.description = description;
    this.activate_ID = activate_ID;
    this.BPM_lower_limit = BPM_lower_limit;
    this.BPM_upper_limit = BPM_upper_limit;
    this.average_mode = average_mode;
    this.compass_time = compass_time;
    this.tone = tone;
    this.color = color;
    this.average_duration = average_duration;
    this.is_subgenre = Boolean(is_subgenre);
    this.father_genre = father_genre;
    this.country = country;
    this.creation_year = creation_year;
    this.typical_volume = typical_volume;
    this.relationships = relationships;
    this.subjective_influence = subjective_influence;
    this.associated_cluster = associated_cluster;
    this.errors = [];
  }

  async insert() {
    try {
      const fLetter = this.is_subgenre ? 'S' : 'G';
      const id = await ID.generateUniqueId(fLetter, 'genre');
      if (!id) this.errors.push('Failed to generate unique ID for genre');

      const genreData = {
        id,
        name: this.name,
        description: this.description,
        is_active: this.activate_ID,
        bpmL: this.BPM_lower_limit,
        bpmU: this.BPM_upper_limit,
        mode: this.average_mode,
        metric: this.compass_time,
        tone: this.tone,
        color: this.color,
        avrSongDuration: this.average_duration,
        is_subgenre: this.is_subgenre,
        country: this.country,
        creation_year: this.creation_year,
        created_date: new Date(),
        volume: this.typical_volume
      };

      const genreInsert = await new Genre(genreData).insert();
      if (!genreInsert?.success) {
        this.errors.push('Failed to insert genre');
        if (genreInsert?.error) this.errors.push(genreInsert.error);
      }

      if (this.is_subgenre) await this.#handleSubgenreRelation();
      if (this.relationships.length > 0) await this.#handleMGPCRelations();
      if (this.associated_cluster) await this.#handleClusterRelation();

      if (this.errors.length > 0) {
        return {
          success: false,
          message: 'Errors occurred during GenreGeneration insert',
          errors: this.errors
        };
      }

      return {
        success: true,
        message: this.is_subgenre
          ? 'Subgenre and relation inserted successfully'
          : 'Genre inserted successfully'
      };
    } catch (err) {
      return {
        success: false,
        message: 'Unexpected error during genre generation',
        error: err.message
      };
    }
  }

  async #handleSubgenreRelation() {
    const parentStats = await Genre.getStatsByName(this.father_genre);
    const subStats = await Genre.getStatsByName(this.name);
    if (!parentStats?.success) this.errors.push(`Failed to get parent stats for: ${this.father_genre}`);
    if (!subStats?.success) this.errors.push(`Failed to get subgenre stats for: ${this.name}`);
    if (!parentStats?.data || !subStats?.data) return;

    const mgpc = new MGPC({ genreA: parentStats.data, genreB: subStats.data }).MGPC();
    const parentId = (await Genre.getIdByName(this.father_genre))?.id;
    const subgenreId = (await Genre.getIdByName(this.name))?.id;

    if (!parentId || !subgenreId) {
      this.errors.push(`Missing ID for parent (${this.father_genre}) or subgenre (${this.name})`);
      return;
    }

    const relation = new SubgenreRelation({ parent: parentId, child: subgenreId, mgpc });
    const insert = await relation.insert();
    if (!insert?.success) {
      this.errors.push('Failed to insert subgenre relation');
      if (insert?.error) this.errors.push(insert.error);
    }
  }

  async #handleMGPCRelations() {
    for (let i = 0; i < this.relationships.length; i++) {
      const relatedName = this.relationships[i];
      const influence = this.subjective_influence[i] ?? 1;

      const relatedStats = await Genre.getStatsByName(relatedName);
      const thisStats = await Genre.getStatsByName(this.name);

      if (!relatedStats?.success) {
        this.errors.push(`Failed to get stats for related genre: ${relatedName}`);
        continue;
      }
      if (!thisStats?.success) {
        this.errors.push(`Failed to get stats for new genre: ${this.name}`);
        continue;
      }

      const mgpc = new MGPC({ genreA: thisStats.data, genreB: relatedStats.data }).MGPC();
      const relation = new MGPCRelation({
        genre_a: this.name,
        genre_b: relatedName,
        mgpc,
        influence: Number(influence)
      });

      const insert = await relation.insert();
      if (!insert?.success) {
        this.errors.push(`Failed to insert MGPC relation with ${relatedName}`);
        if (insert?.error) this.errors.push(insert.error);
      }
    }
  }

  async #handleClusterRelation() {
    const clusterId = (await Cluster.getIdByName(this.associated_cluster))?.id;
    const genreId = (await Genre.getIdByName(this.name))?.id;

    if (!clusterId) this.errors.push(`Cluster not found: ${this.associated_cluster}`);
    if (!genreId) this.errors.push(`Genre ID not found: ${this.name}`);

    if (clusterId && genreId) {
      const insert = await new ClusterGenreRelation({ cluster_id: clusterId, genre_id: genreId }).insert();
      if (!insert?.success) {
        this.errors.push('Failed to insert cluster-genre relation');
        if (insert?.error) this.errors.push(insert.error);
      }
    }
  }
}
