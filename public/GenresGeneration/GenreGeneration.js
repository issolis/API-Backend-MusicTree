import { Genre } from '../tables/Genre.js';
import { ID } from '../Calculations/ID.js';
import { MGPC } from '../Calculations/MGPC.js';
import { SubgenreRelation } from '../tables/SubgenreRelation.js';
import { MGPCRelation } from '../tables/MGPCRelation.js';

export class GenreGeneration {
  constructor({
    nombre,
    descripcion,
    activo,
    color,
    anio_creacion,
    pais_origen,
    modo,
    bpm,
    tono_dominante,
    volumen_tipico_db,
    compas,
    duracion_promedio_segundos,
    es_subgenero,
    genero_padre,
    generos_relacionados
  }) {
    this.name = nombre;
    this.description = descripcion;
    this.isActive = activo;
    this.color = color;
    this.creationYear = anio_creacion;
    this.originCountry = pais_origen;
    this.mode = modo;
    this.bpm = bpm;
    this.dominantTone = tono_dominante;
    this.typicalVolumeDb = volumen_tipico_db;
    this.timeSignature = compas;
    this.averageDurationSeconds = duracion_promedio_segundos;
    this.isSubgenre = es_subgenero;
    this.parentGenre = genero_padre;
    this.relatedGenres = generos_relacionados || [];
  }

  async insert() {
    const errors = [];

    try {
        const fLetter = this.isSubgenre === true ? 'S' : 'G';
        const id = await ID.generateUniqueId(fLetter, 'genre');
        if (!id) {
            errors.push('Failed to generate unique ID for genre');
            }

            const genreData = {
            id: id,
            name: this.name,
            description: this.description,
            is_active: this.isActive,
            bpmL: this.bpm.min,
            bpmU: this.bpm.max,
            mode: this.mode,
            metric: this.timeSignature,
            tone: this.dominantTone,
            color: this.color,
            avrSongDuration: this.averageDurationSeconds,
            is_subgenre: this.isSubgenre,
            country: this.originCountry,
            creation_year: this.creationYear,
            created_date: new Date(),
            volume: this.typicalVolumeDb
            };

            const genreInsertResult = await new Genre(genreData).insert();
            if (!genreInsertResult || !genreInsertResult.success) {
            errors.push('Failed to insert genre');
            if (genreInsertResult?.error) errors.push(genreInsertResult.error);
            }

            if (this.isSubgenre) {
            const parentStatsResponse = await Genre.getStatsByName(this.parentGenre);
            if (!parentStatsResponse || !parentStatsResponse.success) {
                errors.push(`Failed to get stats for parent genre: ${this.parentGenre}`);
                if (parentStatsResponse?.error) errors.push(parentStatsResponse.error);
            }

            const subgenreStatsResponse = await Genre.getStatsByName(this.name);
            if (!subgenreStatsResponse || !subgenreStatsResponse.success) {
                errors.push(`Failed to get stats for subgenre: ${this.name}`);
                if (subgenreStatsResponse?.error) errors.push(subgenreStatsResponse.error);
            }

            if (parentStatsResponse?.data && subgenreStatsResponse?.data) {
                const parentStats = parentStatsResponse.data;
                const subgenreStats = subgenreStatsResponse.data;

                const mgpcInstance = new MGPC({ genreA: parentStats, genreB: subgenreStats });
                const similarityScore = mgpcInstance.MGPC();



                const parentIdResult = await Genre.getIdByName(this.parentGenre);
                if (!parentIdResult || !parentIdResult.id) {
                errors.push(`Failed to get ID for parent genre: ${this.parentGenre}`);
                }

                if (parentIdResult?.id) {
                const parentId = parentIdResult.id;

                const genre = await Genre.getIdByName(this.name);
                const genreId = genre.id;

                const relation = new SubgenreRelation({
                    parent: parentId,
                    child: genreId,
                    mgpc: similarityScore
                });

                const relationInsertResult = await relation.insert();
                if (!relationInsertResult || !relationInsertResult.success) {
                    errors.push('Failed to insert subgenre relation');
                    if (relationInsertResult?.error) errors.push(relationInsertResult.error);
                }
                }
            }
        }
        if (Array.isArray(this.relatedGenres) && this.relatedGenres.length > 0) {
            for (const relationData of this.relatedGenres) {
                
                
                const genreName = relationData.nombre; 
                const influence = relationData.infuencia; 


                const targetGenreStats = await Genre.getStatsByName(genreName);
                if (!targetGenreStats?.success) {
                errors.push(`Failed to get stats for related genre: ${genreName}`);
                if (targetGenreStats?.error) errors.push(targetGenreStats.error);
                continue;
                }

                const newGenreStats = await Genre.getStatsByName(this.name);
                if (!newGenreStats?.success) {
                errors.push(`Failed to get stats for new genre: ${this.name}`);
                if (newGenreStats?.error) errors.push(newGenreStats.error);
                continue;
                }

          

                const mgpcInstance = new MGPC({ genreA: newGenreStats.data, genreB: targetGenreStats.data });
                const similarityScore = mgpcInstance.MGPC();
 

                const mgpcRelation = new MGPCRelation({
                genre_a: this.name,
                genre_b: genreName,
                mgpc: similarityScore,
                influence: influence || 1
                });

                const insertResult = await mgpcRelation.insert();
                if (!insertResult?.success) {
                    errors.push(`Failed to insert MGPC relation with ${genreName}`);
                    if (insertResult?.error) errors.push(insertResult.error);
                }
            }
        }

        if (errors.length > 0) {
            return {
                success: false,
                message: 'Errors occurred during GenreGeneration insert',
                errors: errors
            };
        }

        return {
        success: true,
        message: this.isSubgenre ? 'Subgenre and relation inserted successfully' : 'Genre inserted successfully'
        };

    } catch (error) {
        return {
        success: false,
        message: 'Failed to insert GenreGeneration',
        error: error.message
        };
    }
    }



}
