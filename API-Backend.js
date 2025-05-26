import express from "express";
import { DBManipulator } from './public/DBManipulator.js';
import bodyParser from "body-parser";
import { Cluster } from "./public/tables/Cluster.js";
import { Genre } from "./public/tables/Genre.js";


const app = express();
const port = 3001;
const __DBManipulator = new DBManipulator();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.get("/", (req, res) => {
  res.send("Hello, World!"); 
});

// ----------------- Cluster --------------------- //

app.post("/cluster/insert", async (req, res) => {  
  const result = await new Cluster(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/cluster/getAll", async (req, res) => {
  const result = await Cluster.getAll();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/cluster/getActive",  async (req, res) => {
  const result = await Cluster.getActive();
  res.status(result.success ? 200 : 500).send(result);
} )

// ----------------- Genre --------------------- //

app.post("/genre/insert", async (req, res) => {  
  const result = await new Genre(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/genre/getAll", async (req, res) => {
  const result = await Genre.getAll();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/genre/getActive",  async (req, res) => {
  const result = await Genre.getActive();
  res.status(result.success ? 200 : 500).send(result);
} )

app.get("/genre/getActiveParents",  async (req, res) => {
  const result = await Genre.getActiveParents();
  res.status(result.success ? 200 : 500).send(result);
} )

app.get("/genre/getParents",  async (req, res) => {
  const result = await Genre.getParents();
  res.status(result.success ? 200 : 500).send(result);
} )

app.get("/genre/getActiveChilds",  async (req, res) => {
  const result = await Genre.getActiveChilds();
  res.status(result.success ? 200 : 500).send(result);
} )

app.get("/genre/getChilds",  async (req, res) => {
  const result = await Genre.getChilds();
  res.status(result.success ? 200 : 500).send(result);
} )





app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
