###Setup:

0. Clone this repo then run the following commands in the root folder:
1. `npm install`
2. `npm run build`
3. `npm start` and open localhost:3000 in your browser.


###Making changes:

Anything in `frontend` can be changed without a restart; just run `npm run build` after you've changed stuff.
The `frontend` folder gets compiled to the `public` folder.

###Scripts:

1. `npm run clean` : deletes and recreates the `/public` folder and places a new `.keep` file in it.
2. `npm run build` : `clean`s the `/public` folder and generates all frontend assets.
3. `npm run start` : starts the server at localhost:3000

