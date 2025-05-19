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

   async addSubgender(gender) {
    const result = await this.manipulator.addData(this.path, gender, 'subgenders');
    return result === 1 ? 200 : 400;
  }
  async getClusters() {
    const clusters = await this.manipulator.getDataGroup(this.path, 'clusters');
    return clusters;
  }
  async getGenders() {
    const clusters = await this.manipulator.getDataGroup(this.path, 'genders');
    return clusters;
  }
  async getSubgenders() {
    const clusters = await this.manipulator.getDataGroup(this.path, 'subgenders');
    return clusters;
  }


  async addGenderCluster(gender_cluster) {
    const result = await this.manipulator.addData(this.path, gender_cluster, 'gender_cluster');
    return result === 1 ? 200 : 400;
  }
  async addGenderGender(gender_gender) {
    const result = await this.manipulator.addData(this.path, gender_gender, 'gender_gender');
    return result === 1 ? 200 : 400;
  }

  async addGenderSubgender(gender_subgender) {
    const result = await this.manipulator.addData(this.path, gender_subgender, 'gender_subgender');
    return result === 1 ? 200 : 400;
  }
  async addSubgenderSubgender(subgender_subgender) {
    const result = await this.manipulator.addData(this.path, subgender_subgender, 'subgender_subgender');
    return result === 1 ? 200 : 400;
  }
  
}