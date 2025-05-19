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

  async addGender(gender) {
    const result = await this.manipulator.addData(this.path, gender, 'genders');
    return result === 1 ? 200 : 400;
  }

  async addGenderCluster(gender_cluster) {
    const result = await this.manipulator.addData(this.path, gender_cluster, 'gender_cluster');
    return result === 1 ? 200 : 400;
  }
  
  async getClusters() {
    const clusters = await this.manipulator.getDataGroup(this.path, 'clusters');
    return clusters;
  }

  
}