const express = require("express");
const { Sequelize, DataTypes, Model } = require("sequelize");
const bodyParser = require("body-parser");
const cors = require("cors");
const config = require("./config");
const path = require("path");
const contacts = require("./contacts");
const dotenv=require("dotenv");
dotenv.config()
const app = express();
//  "postgres://"+process.env.postgres_username+":"+process.env.postgres_password+"@"+process.env.link+":"+process.env.port+"/"+process.env.dbname

app.use(express.static("public"));
app.use(cors());
const sequelize = new Sequelize(
  "postgres://"+process.env.postgres_username+":"+process.env.postgres_password+"@"+process.env.link+":"+process.env.port+"/"+process.env.dbname

  //'postgres://postgres:ZAheg1234@database-1.czklow2vfsu0.us-east-1.rds.amazonaws.com:5432/postgres'
);

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      autoIncrementIdentity: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    avatarURL: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
  }
);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/index.html"));
});

app.use((req, res, next) => {
  const token = req.get("Authorization");

  if (token) {
    req.token = token;
    next();
  } else {
    res.status(403).send({
      error:
        "Please provide an Authorization header to identify yourself (can be whatever you want)",
    });
  }
});

app.get("/contacts", async (req, res) => {
  const users = await User.findAll();
  res.send(users.map(({ dataValues }) => ({
    id: dataValues.id,
    name: dataValues.name,
    email: dataValues.email
  })));
});

app.delete("/contacts/:id", async (req, res) => {
  console.log("del")
  res.send(contacts.remove(req.token, req.params.id));
  (await User.findOne({id:req.params.id})).destroy();
});

app.post("/contacts", bodyParser.json(), async (req, res) => {
  const { name, email } = req.body;

  if (name && email) {
    const all =await User.findAll();
    res.send(contacts.add(req.token, req.body));
    User.create({id: all.at(all.length-1).id+1, name:name,email:email,avatarURL:""});
  } else {
    res.status(403).send({
      error: "Please provide both a name and an email address",
    });
  }
});

app.listen(config.port, async () => {
  try {
    User.truncate()
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
    console.log("Server listening on port %s, Ctrl+C to stop", config.port);
    await User.sync();
    contacts.defaultData.contacts.forEach((contact) => {
      User.findOrCreate({ where: { name: contact.name }, defaults: contact });
      
    });
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
