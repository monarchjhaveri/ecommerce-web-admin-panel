###Setup:

#Database setup:
IMPORTANT Note: In production, make sure you change the PASSWORD to something a little more secure!

Run the following commands:
```
CREATE DATABASE ecommerce;
CREATE USER 'ecommerce' IDENTIFIED BY 'PASSWORD';
GRANT ALL PRIVILEGES ON ecommerce.* TO 'ecommerce';

```

0. Clone this repo then run the following commands in the root folder:
1. `npm install`
2. `npm run build`
3. `npm start` and open localhost:3000 in your browser.

##


###Making changes:

`npm run watch` - Enables livereload of SCSS files, as well as javascript and jsx files (only the ones in the `require` tree whose root is main.jsx):

The `frontend` folder gets compiled to the `public` folder.

###Scripts:

1. `npm run clean` : deletes and recreates the `/public` folder and places a new `.keep` file in it.
2. `npm run build` : `clean`s the `/public` folder and generates all frontend assets. Use this for a single build.
3. `npm run watch` : continually watches main.jsx and compiles a new bundle.js if changed. Does not watch any file that is not linked to main.jsx.
4. `npm run start` : starts the server at localhost:3000

###Deployment on fresh server:
1. Install `nvm`
2. Add `. ~/.nvm/nvm.sh` to your `/etc/profile` (all users) or `/.bash_profile` (current user only) to ensure nvm runs on startup.
2. Run `nvm install node 4.1.2`
3. `nvm alias default 4.1.2`
4. `npm install` from the root folder of the project
5. `npm run build`
6. `npm start`
7. Now you can visit your page at your-address:3000
