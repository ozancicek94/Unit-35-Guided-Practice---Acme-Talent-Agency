//import the modules

const {
  client,
  createTables,
  createUser,
  createSkill,
  fetchUsers,
  fetchSkills,
  createUserSkill,
  fetchUserSkills,
  deleteUserSkill
} = require('./db');

const express = require('express');
const app = express();

// parse the incoming requests from json

app.use(express.json());

// app routes here

app.get('/api/users', async(req,res,next) => {
  try{
    res.send( await fetchUsers());

  } catch(error){next(error)}

});

app.get('/api/skills', async(req,res,next) => {
  try{
    res.send( await fetchSkills());

  } catch(error){next(error)}

});

app.get('/api/users/:id/userskills', async(req,res,next) => {
  try{
    res.send( await fetchUserSkills(req.params.id));

  } catch(error){next(error)}

});

app.post('/api/users/:user_id/userSkills/', async(req,res,next) => {
  try{
    res.status(201).send( await createUserSkill({user_id:req.params.user_id, skill_id:req.body.skill_id}));

  } catch(error){next(error)};

});

app.delete('/api/users/:user_id/userSkills/:id', async(req,res,next) => {
  try{
  await deleteUserSkill({id: req.params.id ,user_id:req.params.user_id });

  res.sendStatus(204);

  } catch(error){next(error)}

});


// create the init function 

const init = async() => {

  await client.connect();
  console.log("Connected to the database");

  await createTables();
  console.log("Tables are created");

  const [Ozan, Frank, Andrija, Fern, Sevki, Jeff, Danielle, Modeling, Detailing, Rendering, Drawing, Design, Sketching, Communication] = await Promise.all([
    createUser({username:'Ozan', password:'s3cr3t'}),
    createUser({username:'Frank', password:'s3cr3t'}),
    createUser({username:'Andrija', password:'s3cr3t'}),
    createUser({username:'Fern', password:'s3cr3t'}),
    createUser({username:'Sevki', password:'s3cr3t'}),
    createUser({username:'Jeff', password:'s3cr3t'}),
    createUser({username:'Danielle', password:'s3cr3t'}),

    createSkill({name: 'Modeling'}),
    createSkill({name: 'Detailing'}),
    createSkill({name: 'Rendering'}),
    createSkill({name: 'Drawing'}),
    createSkill({name: 'Design'}),
    createSkill({name: 'Sketching'}),
    createSkill({name: 'Communication'})
  ]);

  console.log(Frank.id);
  console.log(Drawing.id);

  console.log(await fetchUsers());
  console.log(await fetchSkills());

  const userSkills = await Promise.all([
    createUserSkill({user_id: Ozan.id, skill_id: Modeling.id}),
    createUserSkill({user_id: Ozan.id, skill_id: Design.id}),
    createUserSkill({user_id: Ozan.id, skill_id: Rendering.id}),
    createUserSkill({user_id: Jeff.id, skill_id: Communication.id}),
    createUserSkill({user_id: Danielle.id, skill_id: Drawing.id}),
    createUserSkill({user_id: Danielle.id, skill_id: Detailing.id}),
    createUserSkill({user_id: Fern.id, skill_id: Sketching.id}),
  ]);

  await deleteUserSkill(userSkills[0].id);
  console.log(await fetchUserSkills(Ozan.id));

  const port = process.env.PORT || 3000;

  app.listen(port, () => {console.log(`listening on port ${port}`)});

};

//call the init function

init();