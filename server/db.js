// import the packages

const pg = require('pg');
const express = require('express');
const app = express();
const client = new pg.Client(process.env.DATABASE_URL || "postgres://localhost/acme_talent_agency_db");
const {v4: uuid} = require('uuid');
const bycrypt = require('bcrypt');

// create tables for users, skills, user_skills

const createTables = async() => {

  let SQL = `
  DROP TABLE IF EXISTS user_skills;
  DROP TABLE IF EXISTS users;
  DROP TABLE IF EXISTS skills;

  CREATE TABLE users(
  id UUID PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL
  );

  CREATE TABLE skills(
  id UUID PRIMARY KEY,
  name VARCHAR(100) NOT NULL
  );

   CREATE TABLE user_skills(
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) NOT NULL,
  skill_id UUID REFERENCES skills(id) NOT NULL,
  CONSTRAINT unique_user_skill UNIQUE (user_id, skill_id)
  );
  `;

  await client.query(SQL);

};

// create methods to create users and skills

const createUser = async({username, password}) => {

  const SQL = `
  INSERT INTO users(id, username, password) VALUES ($1, $2, $3) RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), username, await bycrypt.hash(password, 5)]);

  return response.rows[0];

};

const createSkill = async({name}) => {

const SQL = `
INSERT INTO skills(id, name) VALUES ($1, $2) RETURNING *
`;

const response = await client.query(SQL, [uuid(), name]);

return response.rows[0];

};

// create methods to fetch users and skills

const fetchUsers = async() => {

  const SQL = `SELECT * FROM users`;

  const response = await client.query(SQL);
  
  return response.rows;

};

const fetchSkills = async() => {

  const SQL = `SELECT * FROM skills`;

  const response = await client.query(SQL);

  return response.rows;

};

// create methods to create and fetch user_skills

const createUserSkill = async({user_id, skill_id}) => {

  const SQL = `
  INSERT INTO user_skills (id, user_id, skill_id) VALUES ($1, $2, $3) RETURNING *
  `;

  const response = await client.query(SQL, [uuid(), user_id, skill_id]);

  return response.rows[0];

};

const fetchUserSkills = async(id) => {

  const SQL = `
  SELECT * FROM user_skills
  WHERE user_id = $1
  `;

  const response = await client.query(SQL, [id]);

  return response.rows;

}

// create a destroyUserSkill method 

const deleteUserSkill = async({id, user_id}) => {

  console.log({id, user_id});

  const SQL = `
  DELETE FROM user_skills
  WHERE id=$1 AND user_id=$2
  `;

  await client.query(SQL, [id, user_id]);

}


// export the modules

module.exports = {
  client,
  createTables,
  createUser,
  createSkill,
  fetchUsers,
  fetchSkills,
  createUserSkill,
  fetchUserSkills,
  deleteUserSkill
}