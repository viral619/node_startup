# How to Setup

- run npm install
- create new database
- rename .env.example to .env
- change configuration details in .env file
- run npm run migrate command
- run npm start

## NOTE:-

generate new private and public keys for JWT auth Token (you can find detail about how to generate new keys in package.json file)
in this I have used Sequelize ORM. you can find it's documentation [here](http://docs.sequelizejs.com/ "Sequelize Documentation").

### Sequelize-CLI Usage

    node_modules/.bin/sequelize

```

Commands:
  db:migrate                        Run pending migrations
  db:migrate:schema:timestamps:add  Update migration table to have timestamps
  db:migrate:status                 List the status of all migrations
  db:migrate:undo                   Reverts a migration
  db:migrate:undo:all               Revert all migrations ran
  db:seed                           Run specified seeder
  db:seed:undo                      Deletes data from the database
  db:seed:all                       Run every seeder
  db:seed:undo:all                  Deletes data from the database
  db:create                         Create database specified by configuration
  db:drop                           Drop database specified by configuration
  init                              Initializes project
  init:config                       Initializes configuration
  init:migrations                   Initializes migrations
  init:models                       Initializes models
  init:seeders                      Initializes seeders
  migration:generate                Generates a new migration file       [aliases: migration:create]
  model:generate                    Generates a model and its migration  [aliases: model:create]
  seed:generate                     Generates a new seed file            [aliases: seed:create]

Options:
  --version  Show version number                                         [boolean]
  --help     Show help                                                   [boolean]
```