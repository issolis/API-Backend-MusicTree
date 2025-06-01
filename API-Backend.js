import express from "express";
import bodyParser from "body-parser";
import { Cluster } from "./public/tables/Cluster.js";
import { Genre } from "./public/tables/Genre.js";
import { SubgenreRelation } from "./public/tables/SubgenreRelation.js";
import { ClusterGenreRelation } from "./public/tables/ClusterGenreRelation.js";
import { MGPC } from "./public/Calculatations/MGPC.js";
import { MGPCRelation } from "./public/tables/MGPCRelation.js";
import { GenreReport } from "./public/reports/GenderReport.js";
import { Artist } from "./public/tables/Artist.js";
import { ActivityPeriod } from "./public/tables/ActivityPeriod.js";
import { Album } from "./public/tables/Album.js";
import { CommentThread } from "./public/tables/CommentThread.js";
import { PhotoAlbum } from "./public/tables/PhotoAlbum.js";
import { Calendar } from "./public/tables/Calendar.js";
import { Member } from "./public/tables/Member.js";

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
// ----------------- Artist --------------------- //
app.post("/artist/insert", async (req, res) => {  
  const result = await new Artist(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/artist/getAll",  async (req, res) => {
  const result = await Artist.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 

app.get("/artist/getActive",  async (req, res) => {
  const result = await Artist.getActive();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/artist/getIdByName/:name", async (req, res) => {
  const result = await Artist.getIdByName(req.params.name);
  res.status(result.success ? 200 : 500).send(result);
});

// ----------------- Activity Period --------------------- //

app.post("/activityPeriod/insert", async (req, res) => {  
  const result = await new ActivityPeriod(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/activityPeriod/getByArtistId/:id",  async (req, res) => {
  const result = await ActivityPeriod.getByArtistId(req.params.id);
  res.status(result.success ? 200 : 500).send(result);
}); 

// ----------------- Album --------------------- //

app.post("/album/insert", async (req, res) => {  
  const result = await new Album(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/album/getByArtistId/:id",  async (req, res) => {
  const result = await Album.getByArtistId(req.params.id);
  res.status(result.success ? 200 : 500).send(result);
}); 

app.get("/album/getAll",  async (req, res) => {
  console.log("Hello"); 
  const result = await Album.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 

// ----------------- CommentThread --------------------- //

app.post("/commentThread/insert", async (req, res) => {  
  const result = await new CommentThread(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/commentThread/getByArtistId/:id",  async (req, res) => {
  const result = await CommentThread.getByArtistId(req.params.id);
  res.status(result.success ? 200 : 500).send(result);
}); 

app.get("/commentThread/getAll",  async (req, res) => {
  const result = await CommentThread.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 

// ----------------- PhotoAlbum --------------------- //

app.post("/photoAlbum/insert", async (req, res) => {  
  const result = await new PhotoAlbum(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/photoAlbum/getByArtistId/:id",  async (req, res) => {
  const result = await PhotoAlbum.getByArtistId(req.params.id);
  res.status(result.success ? 200 : 500).send(result);
}); 

app.get("/photoAlbum/getAll",  async (req, res) => {
  const result = await PhotoAlbum.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 
 
// ----------------- Calendar --------------------- //

app.post("/calendar/insert", async (req, res) => {  
  const result = await new Calendar(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/calendar/getByArtistId/:id",  async (req, res) => {
  const result = await Calendar.getByArtistId(req.params.id);
  res.status(result.success ? 200 : 500).send(result);
}); 

app.get("/calendar/getAll",  async (req, res) => {
  const result = await Calendar.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 

// ----------------- Member --------------------- //

app.post("/member/insert", async (req, res) => {  
  const result = await new Member(req.body).insert();
  res.status(result.success ? 200 : 500).send(result);
});

app.get("/member/getByArtistId/:id",  async (req, res) => {
  const result = await Member.getByArtistId(req.params.id);
  res.status(result.success ? 200 : 500).send(result);
}); 

app.get("/member/getAll",  async (req, res) => {
  const result = await Member.getAll();
  res.status(result.success ? 200 : 500).send(result);
}); 
 

// ----------------- Reports --------------------- //

app.get("/report/gender/getAllWithRelations", async (req, res) => {
  const result = await GenreReport.getAllWithRelations(req.params.name);
  res.status(result.success ? 200 : 500).send(result);
});


// ----------------- Listen --------------------- //

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});