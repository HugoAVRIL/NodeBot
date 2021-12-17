const tmi = require('tmi.js');

// Define configuration options
// BOT_USERNAME et OAUTH_TOKEN à ajouter dans .env (avec CHANNEL_NAME pour chaîne visée)
const opts = {
  identity: {
    username: process.env.BOT_USERNAME,
    password: process.env.OAUTH_TOKEN
  },
  channels: [
    process.env.CHANNEL_NAME
  ]
};

// création nouveau client
const client = new tmi.client(opts);

// Register our event handlers (defined below)
client.on('message', onMessageHandler);
client.on('connected', onConnectedHandler);

// connexion a Twitch :
client.connect();

// à chaque fois qu'un message apparaît
function onMessageHandler (target, context, msg, self) {
  if (self || !msg.startsWith('!')) { return; } // ignore ses propres messages et les messages de ceux listés

  
  const commandName = msg.trim();

  // If the command is known, let's execute it
  if (commandName.search("!melange") != -1 || commandName.search("!melanges") != -1) {
    var listeMots = [];
    // const user = target.substring(1)
    
    var mots = msg.substr(msg.indexOf(" ") + 1); // retire le premier mot de commande "!melange"
    listeMots = mots.split(' '); // sépare tous les mots espacés dans une liste
    const resultatPreparation = MelangeMots(listeMots);
    
    client.say(target,`@${context.username} Voici ton mélange : ${resultatPreparation}`);
    console.log(`* Executed ${commandName} command`);
  } else {
    console.log(`* Unknown command ${commandName}`);
  }
}


function MelangeMots (listeMots) {
  listeMots = shuffle(listeMots);
  
  // TODO mettre tous les mots en minuscules en cas de liste entièrement en maj

  // met en majuscule la première lettre de chaque mot de la liste
  for (let i = 0; i < listeMots.length; i++) {
    listeMots[i] = listeMots[i][0].toUpperCase() + listeMots[i].substr(1);
  }
  
  return listeMots.join('');
};

function shuffle(array) {
  var currentIndex = array.length,  randomIndex;

  // Tant qu'il reste un élément à choisir
  while (0 !== currentIndex) {

    // Choisit un élément du tableau au hasard
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // Échange l'élément choisit avec l'élément actuel
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}

// Called every time the bot connects to Twitch chat
function onConnectedHandler (addr, port) {
  console.log(`* Connected to ${addr}:${port}`);
}
