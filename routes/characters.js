const router = require("express").Router();
const Character = require("../models/Character.model");

const axios = require("axios");
const { response } = require("../app");


// READ - list all characters
router.get("/", (req, res, next) => { // we need this too

  axios.get("https://ih-crud-api.herokuapp.com/characters")
    .then( response => {
      console.log("list of characters....")
      console.log(response.data)
      res.render("characters/characters-list", {characters: response.data});
    })
    .catch( err => console.log('Error getting characters from DB...', err));


  // Character.find()
  //   .then( charactersFromDB => {
  //     res.render("characters/characters-list", {characters: charactersFromDB});
  //   })
  //   .catch(err => {
  //     console.log('Error getting characters from DB...', err);
  //   })
});


// CREATE: display form
router.get("/create", (req, res, next) => {
  res.render("characters/character-create");
});


// CREATE: process form - creating a new character
router.post('/create', (req, res, next) => {  //  /create is what you visit in the browser

  const characterDetails = {
    name: req.body.name,
    occupation: req.body.occupation,
    weapon: req.body.weapon,
  }

  axios.post("https://ih-crud-api.herokuapp.com/characters", characterDetails)
    .then( () => {
      res.redirect("/characters")
    })
    .catch( err => {
      console.log("error creating new character in the API", err);
    })


  // instead of this, we do the above with axios post, BUT we keep characterDetails
  // Character.create(characterDetails)
  //   .then( character => {
  //     res.redirect("/characters");
  //   })
  //   .catch( err => {
  //     console.log('Error creating new character...', err);
  //   })
})


// READ  >> just for one specific character
// GET DETAILS OF ONE CHARACTER
router.get("/:characterId", (req, res, next) => { // see details of only ONE character
  
  axios.get(`https://ih-crud-api.herokuapp.com/characters/${req.params.characterId}`)
  .then( response => {
    res.render("characters/character-details", response.data);
    //console.log(response);
  })
  .catch( err => {
    console.log('Error getting character details from API', err);
  })
  
  // Character.findById(req.params.characterId)
  //   .then( character => {
  //     res.render("characters/character-details", character);  // send details to the view
  //   })
  //   .catch();

});


// UPDATE: display PRE-FILLED/EXISTING form
router.get("/:characterId/edit", (req, res, next) => {  // we display a PRE FILLED form

  axios.get(`https://ih-crud-api.herokuapp.com/characters/${req.params.characterId}`)
    .then( response => {
      res.render("characters/character-edit", response.data)
    })
    .catch( err => {
      console.log("error editing character", err);
    })


  // Character.findById(req.params.characterId)    // to be able to edit
  //   .then( (characterDetails) => {
  //     res.render("characters/character-edit", characterDetails);
  //   })
  //   .catch( err => {
  //     console.log("Error getting character details from DB...", err);
  //   });
});


// UPDATE: process form
router.post("/:characterId/edit", (req, res, next) => {
  const characterId = req.params.characterId;

  const newDetails = {  // we keep this in both DB and axios
    name: req.body.name,
    occupation: req.body.occupation,
    weapon: req.body.weapon,
  }

  // for Axios - PUT request + interpolation / concatenation

  axios.put(`https://ih-crud-api.herokuapp.com/characters/${characterId}`, newDetails)

  // dataThatIWantToSend = newDetails  --> 2nd argument in the PUT request

    .then( () => {
      res.redirect(`/characters/${characterId}`) // tell browser "go here"
    })
    .catch( err => {
      console.log("error updating character", err);
    })

  // Character.findByIdAndUpdate(characterId, newDetails)
  //   .then( () => {
  //     res.redirect(`/characters/${characterId}`);
  //   })
  //   .catch( err => {
  //     console.log("Error updating character...", err);
  //   });
});


router.post("/:characterId/delete", (req, res, next) => {

  axios.delete(`https://ih-crud-api.herokuapp.com/characters/${req.params.characterId}`)
  .then( () => {
    res.redirect("/characters");
  })
  .catch( err => console.log('Error updating character in API', err) );

  // Character.findByIdAndDelete(req.params.characterId)
  //   .then(() => {
  //     res.redirect("/characters");
  //   })
  //   .catch(err => {
  //     console.log("Error deleting character...", err);
  //   });

});

module.exports = router;
