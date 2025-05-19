import express from "express";
import { DBManipulator } from './public/DBManipulator.js';
import bodyParser from "body-parser";

const app = express();
const port = 3001;
const __DBManipulator = new DBManipulator();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

app.get("/", (req, res) => {
  res.send("Hello, World!"); 
});

app.post("/addCluster", async (req, res) => {  
  try {
    const cluster = req.body;
    cluster['date'] = new Date().toISOString(); 
    const response = await __DBManipulator.addCluster(cluster);
    
    console.log('status ', response);

    if (response == 200) {
      res.status(200).send({ message: "Cluster added successfully" });
    } else {
      res.status(400).send({ message: "Error trying to add a new cluster" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.post("/addGenre", async (req, res) => {  
  try {
    const genre = req.body;
    genre['date'] = new Date().toISOString(); 


    const response = await __DBManipulator.addGenre(genre);
    
    console.log('status ', response);

    if (response == 200) {
      res.status(200).send({ message: "Gender added successfully" });
    } else {
      res.status(400).send({ message: "Error trying to add a new gender" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.post("/addSubgenre", async (req, res) => {  
  try {
    const subgenre = req.body;
    subgenre['date'] = new Date().toISOString(); 


    const response = await __DBManipulator.addSubgenre(subgenre);
    
    console.log('status ', response);

    if (response == 200) {
      res.status(200).send({ message: "Gender added successfully" });
    } else {
      res.status(400).send({ message: "Error trying to add a new gender" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});


app.get("/getAllClusters", async (req, res) => {
  try {
    const clusters = await __DBManipulator.getClusters();

    if (clusters.length === 0) {
      return res.status(404).send({ message: "No clusters found" });
    }

    res.status(200).send(clusters);

  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});


app.get("/getAllGenres", async (req, res) => {
  try {
    const genres = await __DBManipulator.getGenders();

    if (genres.length === 0) {
      return res.status(404).send({ message: "No genders found" });
    }

    res.status(200).send(genres);

  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.get("/getAllSubgenres", async (req, res) => {
  try {
    const subgenres = await __DBManipulator.getSubgenres();

    if (subgenres.length === 0) {
      return res.status(404).send({ message: "No subgenders found" });
    }

    res.status(200).send(subgenres);

  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.post("/addGenreCluster", async (req, res) => {  
  try {
    const genre_cluster = req.body;
    const response = await __DBManipulator.addGenreCluster(genre_cluster);
    console.log('status ', response);

    if (response == 200) {
      res.status(200).send({ message: "Gender_Cluster added successfully" });
    } else {
      res.status(400).send({ message: "Error trying to add a new Gender_Cluster" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.post("/addGenreGenre", async (req, res) => {  
  try {
    const genre_genre = req.body;
    const response = await __DBManipulator.addGenreGenre(genre_genre);
    console.log('status ', response);

    if (response == 200) {
      res.status(200).send({ message: "Gender_Cluster added successfully" });
    } else {
      res.status(400).send({ message: "Error trying to add a new Gender_Cluster" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.post("/addGenreSubgenre", async (req, res) => {  
  try {
    const genre_subgenre = req.body;
    const response = await __DBManipulator.addGenreSubgenre(genre_subgenre);
    console.log('status ', response);

    if (response == 200) {
      res.status(200).send({ message: "Gender_Cluster added successfully" });
    } else {
      res.status(400).send({ message: "Error trying to add a new Gender_Cluster" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.post("/addSubgenreSubgenre", async (req, res) => {  
  try {
    const subgenre_subgenre = req.body;
    const response = await __DBManipulator.addSubgenreSubgenre(subgenre_subgenre);
    console.log('status ', response);

    if (response == 200) {
      res.status(200).send({ message: "Gender_Cluster added successfully" });
    } else {
      res.status(400).send({ message: "Error trying to add a new Gender_Cluster" });
    }
  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
