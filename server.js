const express = require("express");
const app = express();
const { animals } = require("./data/animals.json");

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

app.get("/api/animals", (req, res) => {
   let results = animals;
   if (req.query) {
       results = fillterByQuerry(req.query, results);
   }
    res.json(results);
});

app.listen(3001, () => {
    console.log(`API server now on port 3001!`);
});