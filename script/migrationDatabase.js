const { Sequelize, DataTypes } = require("sequelize");

const seq1 = new Sequelize("poems", "azureadmin", "Az12345678", {
  host: "zymysql.mysql.database.azure.com",
  port: 3306,
  dialect: "mysql",
  benchmark: true,
  dialectOptions: {
    encrypt: true,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logQueryParameters: true,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

seq1
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) =>
    console.error("Unable to connect to the database:", error.message)
  );

const seq2 = new Sequelize("poems", "root", "$Hujm930906", {
  host: "47.96.86.157",
  port: 3306,
  dialect: "mysql",
  benchmark: true,
  dialectOptions: {
    encrypt: true,
    ssl: {
      rejectUnauthorized: false,
    },
  },
  logQueryParameters: true,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

seq2
  .authenticate()
  .then(() => console.log("Connection has been established successfully."))
  .catch((error) =>
    console.error("Unable to connect to the database:", error.message)
  );

const table_1 = seq1.define(
  "shici",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING(4000),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

const table_2 = seq2.define(
  "shici",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
    },
    author: {
      type: DataTypes.STRING,
    },
    content: {
      type: DataTypes.STRING(4000),
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

async function migrate() {
  const authors = await table_1.findAll({
    attributes: [[Sequelize.fn("DISTINCT", Sequelize.col("author")), "author"]],
    raw: true,
  });

  const authorArray = authors.map((author) => author.author);

  for (let i = 0; i < authorArray.length; i++) {
    const poems = await table_1.findAll({
      where: {
        author: authorArray[i],
      },
      raw: true,
    });

    await table_2.bulkCreate(poems);
    console.log(
      `Author ${authorArray[i]} migrated; progress: ${i + 1}/${
        authorArray.length
      }`
    );
  }
}

migrate();
