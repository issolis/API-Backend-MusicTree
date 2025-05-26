import express from "express";
import bodyParser from "body-parser";
import { Cluster } from "./public/tables/Cluster.js";
import { Genre } from "./public/tables/Genre.js";
import { SubgenreRelation } from "./public/tables/SubgenreRelation.js";
import { ClusterGenreRelation } from "./public/tables/ClusterGenreRelation.js";
import { MGPC } from "./public/Calculatations/MGPC.js";
import { MGPCRelation } from "./public/tables/MGPCRelation.js";


const app = express();
const port = 3001;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.get("/", (req, res) => {
  res.send("API-MusicTree"); 
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
}); 

app.get("/cluster/getIdByName/:name", async (req, res) => {
  const result = await Cluster.getIdByName(req.params.name);
  res.status(result.success ? 200 : 500).send(result);
});

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
});

app.get("/genre/getActiveParents",  async (req, res) => {
  const result = await Genre.getActiveParents();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/genre/getParents",  async (req, res) => {
  const result = await Genre.getParents();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/genre/getActiveChilds",  async (req, res) => {
  const result = await Genre.getActiveChilds();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/genre/getChilds",  async (req, res) => {
  const result = await Genre.getChilds();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/genre/getIdByName/:name", async (req, res) => {
  const result = await Genre.getIdByName(req.params.name);
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/genre/getStatsByName/:name", async (req, res) => {
  const result = await Genre.getStatsByName(req.params.name);
  res.status(result.success ? 200 : 500).send(result);
});

// ----------------- Subgenre Relation--------------------- //

app.post("/subgenreRelation/insert", async (req, res) => {  
  const result = await new SubgenreRelation(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/subgenreRelation/getAll",  async (req, res) => {
  const result = await SubgenreRelation.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 


// ----------------- Gender Cluster--------------------- //

app.post("/clusterGenreRelation/insert", async (req, res) => {  
  const result = await new ClusterGenreRelation(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/clusterGenreRelation/getAll",  async (req, res) => {
  const result = await ClusterGenreRelation.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 

// ----------------- MGPC --------------------- //

app.post("/MGPC/calculate", async (req, res) => {
  try {
    const comparator = new MGPC(req.body);
    const mgpc = comparator.MGPC();

    res.status(200).json({
      success: true,
      message: "MGPC score calculated successfully.",
      mgpc
    });
  } catch (error) {
    console.error("Error calculating MGPC:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to calculate MGPC score.",
      error: error.message
    });
  }
});

app.post("/mgpcRelation/insert", async (req, res) => {  
  const result = await new MGPCRelation(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/mgpcRelation/getAll",  async (req, res) => {
  const result = await MGPCRelation.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 





// ----------------- Listen --------------------- //
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
