# Chat

This project was developed in order to test my skills with the (angularJs, nodeJs with expressJs and mongoDb) tecnologies.

It's a simple realtime web chat.

# Dependences

  - NODE
  - NPM
  - GULP
  - BOWER
  - MONGODB

# Build

  first clone the project go into the clone path, install the dependecies:

  `nmp install && bower install`

  `cd src-backend && npm install && cd ..`

  and after you can start the services:

  `gulp connect`

  `cd src-backend && node index.js`

  Then you can open your browser and go to [http://localhost:3000/](http://localhost:3000/)

  If you want to chat with hosts in your internal network make sure that the 3000 and 3001 port was openned,
  and change the /src/app/config/app.config.js apiBaseUrl for you internal IP.
