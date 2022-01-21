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

const handleZookeeperFormSubmit = event => {
    event.preventDefault();
  
    // get zookeeper data and organize it
    const name = $zookeeperForm.querySelector('[name="zookeeper-name"]').value;
    const age = parseInt($zookeeperForm.querySelector('[name="age"]').value);
    const favoriteAnimal = $zookeeperForm.querySelector('[name="favorite-animal"]').value;
  
    const zookeeperObj = { name, age, favoriteAnimal };
    console.log(zookeeperObj);
    fetch('api/zookeepers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(zookeeperObj)
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        alert('Error: ' + response.statusText);
      })
      .then(postResponse => {
        console.log(postResponse);
        alert('Thank you for adding a zookeeper!');
      });
  };

app.use("/api", apiRouts);
app.use("/", htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});