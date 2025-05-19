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

app.post("/addGender", async (req, res) => {  
  try {
    const gender = req.body;
    gender['date'] = new Date().toISOString(); 


    const response = await __DBManipulator.addGender(gender);
    
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

app.post("/addSubgender", async (req, res) => {  
  try {
    const subgender = req.body;
    subgender['date'] = new Date().toISOString(); 


    const response = await __DBManipulator.addSubgender(subgender);
    
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


app.get("/getAllGenders", async (req, res) => {
  try {
    const genders = await __DBManipulator.getGenders();

    if (genders.length === 0) {
      return res.status(404).send({ message: "No genders found" });
    }

    res.status(200).send(genders);

  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.get("/getAllSubgenders", async (req, res) => {
  try {
    const genders = await __DBManipulator.getSubgenders();

    if (genders.length === 0) {
      return res.status(404).send({ message: "No subgenders found" });
    }

    res.status(200).send(genders);

  } catch (error) {
    res.status(500).send({ message: "Server error", error: error.message });
  }
});

app.post("/addGenderCluster", async (req, res) => {  
  try {
    const gender_cluster = req.body;
    const response = await __DBManipulator.addGenderCluster(gender_cluster);
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

app.post("/addGenderGender", async (req, res) => {  
  try {
    const gender_gender = req.body;
    const response = await __DBManipulator.addGenderGender(gender_gender);
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

app.post("/addGenderSubgender", async (req, res) => {  
  try {
    const gender_subgender = req.body;
    const response = await __DBManipulator.addGenderSubgender(gender_subgender);
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

app.post("/addSubgenderSubgender", async (req, res) => {  
  try {
    const subgender_subgender = req.body;
    const response = await __DBManipulator.addSubgenderSubgender(subgender_subgender);
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
