import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class JSONManipulator {
  async addData(relativePath, newItem, group) {
    try {
      const fullPath = path.join(__dirname, relativePath);
      const rawData = await readFile(fullPath, 'utf-8');
      const data = JSON.parse(rawData);

      if (!Array.isArray(data[group])) {
        data[group] = [];
      }

      

      data[group].push(newItem);

      await writeFile(fullPath, JSON.stringify(data, null, 2), 'utf-8');
      console.log('New item added');

      return 1; 

    } catch (error) {
      console.error(error);
      return 0; 
    }
  }
  async getDataGroup(relativePath, group){
    try {
      const fullPath = path.join(__dirname, relativePath);
      const rawData = await readFile(fullPath, 'utf-8');
      const data = JSON.parse(rawData);
      return data[group]; 

    } catch (error) {
      console.error(error);
      return 0; 
    }
  }
  
}

