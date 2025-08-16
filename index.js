const TelegramBot = require('node-telegram-bot-api');
const TOKEN = '7626274886:AAFYWXlolMHD_sOTPPfw5uJ6w23BLw6MthA';
const bot = new TelegramBot(TOKEN, { polling: true });

// ----------------- Data -----------------

const devilFruits = [
  // Canon Paramecia
  { name: "Gomu Gomu no Mi", type: "Paramecia", ability: "Rubber body", image: "https://static.onepiece.com/fruits/gomu.png" },
  { name: "Bara Bara no Mi", type: "Paramecia", ability: "Split body parts", image: "https://static.onepiece.com/fruits/bara.png" },
  { name: "Ope Ope no Mi", type: "Paramecia", ability: "Operate anything", image: "https://static.onepiece.com/fruits/ope.png" },
  
  // Canon Logia
  { name: "Mera Mera no Mi", type: "Logia", ability: "Fire", image: "https://static.onepiece.com/fruits/mera.png" },
  { name: "Goro Goro no Mi", type: "Logia", ability: "Lightning", image: "https://static.onepiece.com/fruits/goro.png" },
  { name: "Pika Pika no Mi", type: "Logia", ability: "Light", image: "https://static.onepiece.com/fruits/pika.png" },

  // Canon Zoan
  { name: "Ushi Ushi no Mi, Model: Bison", type: "Zoan", ability: "Bison transformation", image: "https://static.onepiece.com/fruits/ushi.png" },

  // Mythical Zoan
  { name: "Tori Tori no Mi, Model: Phoenix", type: "Mythical Zoan", ability: "Phoenix regeneration", image: "https://static.onepiece.com/fruits/phoenix.png" },
  { name: "Hito Hito no Mi, Model: Daibutsu", type: "Mythical Zoan", ability: "Giant Buddha form", image: "https://static.onepiece.com/fruits/daibutsu.png" },

  // Non-canon / fanmade examples
  { name: "Ice-Ice Fruit", type: "Logia", ability: "Ice", image: "https://fanmade.onepiece.com/fruits/ice.png" },
  { name: "Shadow-Shadow Fruit", type: "Paramecia", ability: "Control shadows", image: "https://fanmade.onepiece.com/fruits/shadow.png" },
  { name: "Magnet-Magnet Fruit", type: "Paramecia", ability: "Magnetism", image: "https://fanmade.onepiece.com/fruits/magnet.png" }
];

const locations = [
  "East Blue", "West Blue", "North Blue", "South Blue",
  "Grand Line", "Reverse Mountain", "Alabasta", "Skypiea", 
  "Water 7", "Enies Lobby", "Thriller Bark", "Sabaody Archipelago",
  "Fishman Island", "Punk Hazard", "Dressrosa", "Whole Cake Island",
  "Wano Country", "Raftel", "Marineford", "G-8", "Loguetown", "Little Garden",
  "Amazon Lily", "Jaya", "Impel Down"
];

// Player storage
let players = {}; // { chatId: { name, fruits, bounty, crew, xp } }

// ----------------- Helper Functions -----------------
function generateWantedPoster(player) {
  return `💀 WANTED 💀
Name: ${player.name}
Bounty: ${player.bounty || 0} Berries
Status: DEAD or ALIVE
Fruits: ${player.fruits.join(", ") || "None"}
Crew: ${player.crew || "None"}`;
}

// ----------------- Bot Commands -----------------
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const username = msg.from.username || msg.from.first_name || "Pirate";
  if (!players[chatId]) players[chatId] = { name: username, fruits: [], bounty: 0, crew: null, xp: 0 };
  bot.sendMessage(chatId, `Welcome to One Piece RP, ${username}!\nUse /help to see all commands.`);
});

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 
    `/listfruits - Show all Devil Fruits\n` +
    `/eatfruit <fruit> - Eat a Devil Fruit\n` +
    `/locations - Show all locations\n` +
    `/stats - Show your stats\n` +
    `/joincrew <crewname> - Join a crew\n` +
    `/raid - Start a raid\n` +
    `/quest - Start a quest`
  );
});

bot.onText(/\/listfruits/, (msg) => {
  const chatId = msg.chat.id;
  const fruitList = devilFruits.map(f => `${f.name} (${f.type})`).join("\n");
  bot.sendMessage(chatId, `Available Devil Fruits:\n${fruitList}`);
});

bot.onText(/\/locations/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `Locations:\n${locations.join(", ")}`);
});

bot.onText(/\/stats/, (msg) => {
  const chatId = msg.chat.id;
  const player = players[chatId];
  if (!player) return bot.sendMessage(chatId, "You have no stats yet. Use /start first.");
  bot.sendMessage(chatId,
    `🧑 Player: ${player.name}\n` +
    `Fruits: ${player.fruits.join(", ") || "None"}\n` +
    `Crew: ${player.crew || "None"}\n` +
    `Bounty: ${player.bounty}\n` +
    `XP: ${player.xp}`
  );
});

// Eat a fruit
bot.onText(/\/eatfruit (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const fruitName = match[1].trim();
  const fruit = devilFruits.find(f => f.name.toLowerCase() === fruitName.toLowerCase());
  if (!fruit) return bot.sendMessage(chatId, `No such fruit found.`);
  const player = players[chatId];
  if (!player) return bot.sendMessage(chatId, "Use /start first.");
  if (player.fruits.includes(fruit.name)) return bot.sendMessage(chatId, "You already ate this fruit.");
  player.fruits.push(fruit.name);
  player.xp += 50;
  bot.sendMessage(chatId, `Congrats! You ate ${fruit.name}.\nAbility: ${fruit.ability}`);
});

// Join crew
bot.onText(/\/joincrew (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const crewName = match[1].trim();
  const player = players[chatId];
  if (!player) return bot.sendMessage(chatId, "Use /start first.");
  player.crew = crewName;
  bot.sendMessage(chatId, `You joined the crew: ${crewName}`);
});

// Quest
bot.onText(/\/quest/, (msg) => {
  const chatId = msg.chat.id;
  const player = players[chatId];
  if (!player) return bot.sendMessage(chatId, "Use /start first.");
  player.xp += 20;
  bot.sendMessage(chatId, `You completed a quest! XP +20`);
});

// Raid
bot.onText(/\/raid/, (msg) => {
  const chatId = msg.chat.id;
  const player = players[chatId];
  if (!player) return bot.sendMessage(chatId, "Use /start first.");
  player.xp += 50;
  player.bounty += 1000;
  bot.sendMessage(chatId, `You completed a raid! XP +50, Bounty +1000 Berries\n${generateWantedPoster(player)}`);
});

// Catch-all unknown commands
bot.on('message', (msg) => {
  if (!msg.text.startsWith("/")) return;
  const knownCommands = ["/start","/help","/listfruits","/eatfruit","/locations","/stats","/joincrew","/raid","/quest"];
  if (!knownCommands.includes(msg.text.split(" ")[0].toLowerCase())) {
    bot.sendMessage(msg.chat.id, "Unknown command. Use /help to see commands.");
  }
});
