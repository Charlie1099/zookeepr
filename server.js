const fs = require("fs");
const path = require("path");

const express = require("express");

const { animals } = require("./data/animals.json");
const { response } = require("express");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

function fillterByQuerry(query, animalsArray) {
    let personalityTraitsArray = [];
    // note that we save the animals array as filltered results here
    let fillteredResults = animalsArray
    if (query.personalityTraitsArray){
        //save personalityTraits as a dedicated array.
        //if personalityTraits is a string, place it into a new array and save
        if (typeof query.personalityTraits === "string") {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        //loop through each trait in the personalityTraits array
        personalityTraitsArray.forEach(trait => {
            fillteredResults = fillteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
            )
        });
    }

    if (query.diet) {
        fillteredResults = fillteredResults.filter(animal => animal.diet === query.diet);
    }
    if (query.species) {
        fillteredResults = fillteredResults.filter(animal => animal.species === query.species);
    }
    if (query.name) {
        fillteredResults = fillteredResults.filter(animal => animal.name === query.name);
    }
    return fillteredResults;
}



function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0]
    return result
}

function createNewAnimal(body, animalsArray) {
    const animal = body
    animalsArray.push(animal);
    fs.writeFileSync(
        path.join(__dirname, "./data/animals.json"),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );
    return body;
}

function validateAnimal(animal) {
    if (!animal.name || typeof animal.name !== "string") {
        return false;
    }
    if (!animal.species || typeof animal.species !== "string") {
        return false;
    }
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    }
}

app.get("/api/animals", (req, res) => {
   let results = animals;
   if (req.query) {
       results = fillterByQuerry(req.query, results);
   }
    res.json(results);
});

app.get("/api/animals/:id", (req, res) => {
    const results = findById(req.params.id, animals);
        if (results) {
           res.json(result); 
        } else {
            res.send(404);
        }
        
});

app.post("/api/animals", (req, res) => {
    //set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    if (!validateAnimal(req.body)) {
        res.status(400).send("The animal is not properly formatted.");
    } else {
        const animal = createNewAnimal(req.body, animals);
        res.json(animal)
    }
   
    const animal = createNewAnimal(req.body, animals);

    res.json(req.body);
});

app.get("/animals", (req, res) => {
     res.sendFile(path.join(__dirname, "./public/index.html"));
    
});

app.get("/zookeepers", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/zookeepers.html"));
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});