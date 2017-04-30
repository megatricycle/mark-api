# mark-api

## How to set up
* Install [Node](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04) and [MySQL](https://www.linode.com/docs/databases/mysql/install-mysql-on-ubuntu-14-04).
* Clone this repository.
    * `git clone https://github.com/megatricycle/mark-api.git`
* Install dependencies.
    * `cd mark-api`
    * `npm install`
* Configure database credentials.
    * Copy `src/config/db.sample.js` to `src/config/db.js`.
        * `cp src/config/db.sample.js src/config/db.js`
    * Supply the necessary fields with your database credentials.

## How to run
* Start the server.
    * `npm start`
