import { JSONManipulator } from './JSONManipulator.js';

export class DBManipulator {
  constructor() {
    this.manipulator = new JSONManipulator();
    this.path = './DB.json';
  }

  async addCluster(cluster) {
    const result = await this.manipulator.addData(this.path, cluster, 'clusters');
    return result === 1 ? 200 : 400;
  }

  async addGenre(genre) {
    const result = await this.manipulator.addData(this.path, genre, 'genres');
    return result === 1 ? 200 : 400;
  }

   async addSubgenre(subgenre) {
    const result = await this.manipulator.addData(this.path, subgenre, 'subgenres');
    return result === 1 ? 200 : 400;
  }
  async getClusters() {
    const clusters = await this.manipulator.getDataGroup(this.path, 'clusters');
    return clusters;
  }
  async getGenders() {
    const clusters = await this.manipulator.getDataGroup(this.path, 'genres');
    return clusters;
  }
  async getSubgenres() {
    const clusters = await this.manipulator.getDataGroup(this.path, 'subgenres');
    return clusters;
  }


  async addGenreCluster(genre_cluster) {
    const result = await this.manipulator.addData(this.path, genre_cluster, 'genre_cluster');
    return result === 1 ? 200 : 400;
  }
  async addGenreGenre(genre_genre) {
    const result = await this.manipulator.addData(this.path, genre_genre, 'genre_genre');
    return result === 1 ? 200 : 400;
  }

  async addGenreSubgenre(genre_subgenre) {
    const result = await this.manipulator.addData(this.path, genre_subgenre, 'genre_subgenre');
    return result === 1 ? 200 : 400;
  }
  async addSubgenreSubgenre(subgender_subgender) {
    const result = await this.manipulator.addData(this.path, subgender_subgender, 'subgenre_subgenre');
    return result === 1 ? 200 : 400;
  }
  
}