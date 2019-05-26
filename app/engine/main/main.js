const { app, BrowserWindow } = require('electron');
const c = require('electron').remote.getGlobal('console');
const saveGamePath = require('os').homedir() + "/clickscape.save";

class Skill {
  constructor() {
    this.woodcutting = {
      upgradeName: ["", "Tree", "Oak", "Willow", "Maple", "Yew", "Magic"],
      upgradeCost: [-1, 0, 125, 350, 850, 1400, 2200, 3500],
    };

    this.fishing = {
      upgradeName: ["", "Shrimp", "Anchovies", "Trout", "Lobster", "Swordfish", "Shark"],
      upgradeCost: [-1, 0, 125, 350, 850, 1400, 2200, 3500],
    };

    this.mining = {
      upgradeName: ["", "Copper", "Iron", "Coal", "Mithril", "Adamantite", "Runite"],
      upgradeCost: [-1, 0, 125, 350, 850, 1400, 2200, 3500],
    };

    this.smithing = {
      upgradeName: ["", "Copper", "Iron", "Coal", "Mithril", "Adamantite", "Runite"],
      upgradeCost: [-1, 0, 125, 350, 850, 1400, 2200, 3500],
    };

    this.cooking = {
      upgradeName: ["", "Copper", "Iron", "Coal", "Mithril", "Adamantite", "Runite"],
      upgradeCost: [-1, 0, 125, 350, 850, 1400, 2200, 3500],
    };

    this.firemaking = {
      upgradeName: ["", "Copper", "Iron", "Coal", "Mithril", "Adamantite", "Runite"],
      upgradeCost: [-1, 0, 125, 350, 850, 1400, 2200, 3500],
    };
  };

  getSkillObject = (skill) => {
    switch(skill.toLowerCase()) {
      case "woodcutting":
        return this.woodcutting;
      
      case "firemaking":
        return this.firemaking
      
      case "fishing":
        return this.fishing;
    
      case "cooking":
        return this.cooking;
      
      case "mining":
        return this.mining;

      case "smithing":
        return this.smithing;
    }
  };
}
const skill = new Skill();

class Player {
  constructor() {
  };

  setInitialStats = () => { // Stats for new game
    this.woodcutting = {wood: 0, level: 1, experience: 0, upgrade: 1};
    this.fishing = {fish: 0, level: 1, experience: 0, upgrade: 1};
    this.mining = {ore: 0, level: 1, experience: 0, upgrade: 1};

    this.firemaking = {level: 1, experience: 0, upgrade: 1};
    this.cooking = {level: 1, experience: 0, upgrade: 1};
    this.smithing = {level: 1, experience: 0, upgrade: 1};

    this.botContainer = {
      woodcutting: {activeBots: 0, botSpeed: 1000},
      fishing: {activeBots: 0, botSpeed: 1000},
      mining: {activeBots: 0, botSpeed: 1000},
    };

    this.currentSkill = "Woodcutting";
  }

  loadStats = (playerData) => { // JSON parsed into this function
    this.woodcutting = playerData.woodcutting;
    this.fishing = playerData.fishing;
    this.mining = playerData.mining;

    this.botContainer = playerData.botContainer;

    this.currentSkill = playerData.currentSkill;
  }

  getResourceAmount = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        return this.woodcutting.wood;

      case "firemaking":
        return this.woodcutting.wood;
      
      case "fishing":
        return this.fishing.fish;

      case "cooking":
        return this.fishing.fish;

      case "mining":
        return this.mining.ore;

      case "smithing":
        return this.mining.ore;


      default:
        return 0;
    }
  };

  getResourceName = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        return "Wood";
      
      case "fishing":
        return "Fish";

      case "mining":
        return "Ore";
    
      case "smithing":
        return "Smelt";

      case "cooking":
        return "Cook";
  
      case "firemaking":
        return "Burn";

      default:
        return 0;
    }
  };

  getSkillLevel = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        return this.woodcutting.level;
      
      case "fishing":
        return this.fishing.level;

      case "mining":
        return this.mining.level;

      default:
        return 0;
    }
  };

  getSkillLevelUpgrade = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        return this.woodcutting.upgrade;
      
      case "fishing":
        return this.fishing.upgrade;

      case "mining":
        return this.mining.upgrade;

      default:
        return 0;
    }
  };

  getSkillExperience = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        return this.woodcutting.experience;
      
      case "fishing":
        return this.fishing.experience;

      case "mining":
        return this.mining.experience;

      default:
        return 0;
    }
  };

  addResources = (amount) => {
    this.addExperience(amount, this.currentSkill);

    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        this.woodcutting.wood += amount;
        break;
      
      case "fishing":
          this.fishing.fish += amount;
          break;

      case "mining":
          this.mining.ore += amount;
          break;

      default:
        return 0;
    }
  };

  removeResources = (amount) => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        this.woodcutting.wood -= amount;
        break;
      
      case "fishing":
          this.fishing.fish -= amount;
          break;

      case "mining":
          this.mining.ore -= amount;
          break;

      default:
        return 0;
    }
  };

  addExperience = (amount, skill) => {
    switch(skill.toLowerCase()) {
      case "woodcutting":
        this.woodcutting.experience += amount;
        break;
      
      case "fishing":
          this.fishing.experience += amount;
          break;

      case "mining":
          this.mining.experience += amount;
          break;

      default:
        return 0;
    }
  }

  getBotStats = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        return this.botContainer.woodcutting;

      case "fishing":
        return this.botContainer.fishing;

      case "mining":
        return this.botContainer.mining;

      default:
        return 0;
    }
  }

  upgradeActiveBots = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        this.botContainer.woodcutting.activeBots++;
        break;

      case "fishing":
        this.botContainer.fishing.activeBots++;
        break;

      case "mining":
        this.botContainer.mining.activeBots++;
        break;

      default:
        return 0;
    }
  };

  upgradeBotsSpeed = () => {
    switch(this.currentSkill.toLowerCase()) {
      case "woodcutting":
        this.botContainer.woodcutting.botSpeed -= 25;
        break;

      case "fishing":
        this.botContainer.fishing.botSpeed -= 25;
        break;

      case "mining":
        this.botContainer.mining.botSpeed -= 25;
        break;

      default:
        return 0;
    }
  };

  convertStatsJSON = () => {
    return JSON.stringify(
      {
        woodcutting: this.woodcutting,
        fishing: this.fishing,
        mining: this.mining,
        currentSkill: this.currentSkill,
        botContainer: this.botContainer,
      });
  }
}
const p = new Player();

// All functions that are fired up once the game page loads.
const mainEngineLogic = () => {
  c.log("");
  c.log("- Starting Main Engine Logic -");
  loadGameData();

  gameLogicEvent();
  displayResourceEvent();
  gameEventListeners();
  simulateBotEvent();
};


// Game Logic Event Manager (Currently only the level up system)
const gameLogicEvent = () => {
  setInterval(() => {

    let currentXP = p.getSkillExperience();
    let targetXP = getExpGapForLevel(p.getSkillLevel() + 1);

    if(currentXP >= targetXP) {
      currentXP -= targetXP;

      switch(p.currentSkill.toLowerCase()) {
        case "woodcutting":
          p.woodcutting.level += 1;
          p.woodcutting.experience -= targetXP;
          break;

        case "fishing":
          p.fishing.level += 1;
          p.fishing.experience -= targetXP;
          break;

        case "mining":
          p.mining.level += 1;
          p.mining.experience -= targetXP;
          break;
      }

      // targetXP = getExpGapForLevel(p.getSkillLevel() + 1);
    }
  }, 50);
};

// Reading / Writing files

const fs = require('fs');

// Load game functionality
const loadGameData = () => {
  // loadInitialStats()
  if (fs.existsSync(saveGamePath)) {
    let playerData = fs.readFileSync(saveGamePath, "utf-8", (error) => {
      c.log(error);
    }); 

    c.log("Loaded game successfully!");
    p.loadStats(JSON.parse(playerData));
  } else {
    c.log("No save detected!");
    p.setInitialStats();
  }

  saveGameEvent();
};

// Save game functionality
const saveGameEvent = (supressSaveMessage = true) => {
  setInterval(() => {

    fs.writeFile(saveGamePath, p.convertStatsJSON(), (err) => {
      if(err) {
        return c.log(err);
      }
    
      if (!supressSaveMessage) c.log("The file was saved!");
    }); 

  }, 500);
};


// Bot Logic
const botTimer = undefined;

const simulateBotEvent = () => {
  c.log("Loading bot army!");
  let currentSkillBots = p.getBotStats();

  botTimer = setInterval(() => {
    currentSkillBots = p.getBotStats();

    if (currentSkillBots.activeBots > 0) {
      p.addResources(((1 * p.getSkillLevelUpgrade()) + 2) * currentSkillBots.activeBots);
      rotateClickObject();
    }
  },
  1000);
};

// Interval for updating values on the screen
const displayResourceEvent = () => {
  c.log("Spinning up graphics updater (50ms)");

  setInterval(() => {
    // Skill Status Panel
    let currentSkillQuery = document.querySelector("#current-skill");
    currentSkillQuery.innerHTML = p.getResourceName() + ":";

    let currentSkillAmountQuery = document.querySelector("#current-skill-amount");
    currentSkillAmountQuery.innerHTML = p.getResourceAmount();

    let clickImageQuery = document.querySelector("#click-object");
    let clickImgURL = "url('../../resources/" + p.currentSkill.toLowerCase() + "/" + p.getSkillLevelUpgrade() + ".png') center center no-repeat";
    if (clickImageQuery.style.background != clickImgURL) clickImageQuery.style.background = clickImgURL;

    let gameWindowQuery = document.querySelector("#game-panel");
    let gameWindowURL = "url('../../resources/" + p.currentSkill.toLowerCase() + "/background.png')"; //center center no-repeat";
    if (gameWindowQuery.style.background != gameWindowURL) gameWindowQuery.style.background = gameWindowURL;

    let levelQuery = document.querySelector("#level");
    levelQuery.innerHTML = p.getSkillLevel();

    let experienceQuery = document.querySelector("#experience");
    experienceQuery.innerHTML = p.getSkillExperience();

    let remainingExperienceQuery = document.querySelector("#remaining-experience");
    remainingExperienceQuery.innerHTML = "Lvl " + p.getSkillLevel() + " -> " + (p.getSkillLevel() + 1) + " (" + getRemainingXP() + "%) Exp: " + (getExpGapForLevel(p.getSkillLevel() + 1) - p.getSkillExperience());

    let progressBarQuery = document.querySelector("#percentage");
    progressBarQuery.style.width = (getRemainingXP() * 2).toString() + "px";


    // Upgrades Panel
    let nextUpgradeQuery = document.querySelector("#next-upgrade");
    let skillUpgradeObject = skill.getSkillObject(p.currentSkill);

    if (skillUpgradeObject.upgradeName[p.getSkillLevelUpgrade() + 1] === undefined) {
      nextUpgradeQuery.innerHTML = "MAXED";
    } else {
      nextUpgradeQuery.innerHTML = skillUpgradeObject.upgradeName[p.getSkillLevelUpgrade() + 1] + " (" + skillUpgradeObject.upgradeCost[p.getSkillLevelUpgrade() + 1] + ")";

      if (p.getResourceAmount() < skillUpgradeObject.upgradeCost[p.getSkillLevelUpgrade() + 1]) {
        nextUpgradeQuery.style.color = "red";
      } else {
        nextUpgradeQuery.style.color = "green";
      }
    }

    // Bots Panel

    let playerBotObject = p.getBotStats(p.currentSkill);

    let botAmountPanel = document.querySelector("#display-bot-amount");
    botAmountPanel.innerHTML = playerBotObject.activeBots;

    let botSpeedPanel = document.querySelector("#display-bot-speed");
    botSpeedPanel.innerHTML = playerBotObject.botSpeed + "ms";
  },
  50);
};

const rand = (min, max) => {
    return Math.random() * ((max + 1) - min) + min;
};

const rotateClickObject = () => {
  let clickObjectQuery = document.querySelector("#click-object");
  clickObjectQuery.style.transform = "rotate(" + (rand(-5, 5)) + "deg)";
};

// Setting the game's event listeners
const gameEventListeners = () => {
  c.log("Firing up event queries/listeners!");


  c.log("> Click Object:");
  let clickObjectQuery = document.querySelector("#click-object");
  if (clickObjectQuery) c.log(" --> Queried " + clickObjectQuery.getAttribute("id"));


  c.log("> Portals:");
  let skillingPortalQuery = document.querySelector("#skilling-portal");
  if (skillingPortalQuery) c.log(" --> Queried " + skillingPortalQuery.getAttribute("id"));

  let upgradesPortalQuery = document.querySelector("#upgrades-portal");
  if (upgradesPortalQuery) c.log(" --> Queried " + upgradesPortalQuery.getAttribute("id"));

  let botsPortalQuery = document.querySelector("#bots-portal");
  if (botsPortalQuery) c.log(" --> Queried " + botsPortalQuery.getAttribute("id"));


  c.log("> Skilling Locations:");
  let woodcuttingLinkQuery = document.querySelector("#woodcutting-link");
  if (woodcuttingLinkQuery) c.log(" --> Queried " + woodcuttingLinkQuery.getAttribute("id"));

  let firemakingLinkQuery = document.querySelector("#firemaking-link");
  if (firemakingLinkQuery) c.log(" --> Queried " + firemakingLinkQuery.getAttribute("id"));

  let fishingLinkQuery = document.querySelector("#fishing-link");
  if (fishingLinkQuery) c.log(" --> Queried " + fishingLinkQuery.getAttribute("id"));

  let miningLinkQuery = document.querySelector("#mining-link");
  if (miningLinkQuery) c.log(" --> Queried " + miningLinkQuery.getAttribute("id"));


  c.log("> Skill Upgrades");
  let skillUpgrade1Query = document.querySelector("#skill-upgrade-1");
  if (skillUpgrade1Query) c.log(" --> Queried " + skillUpgrade1Query.getAttribute("id"));

  let resetUpgradesQuery = document.querySelector("#skill-upgrade-9001");
  if (resetUpgradesQuery) c.log(" --> Queried " + resetUpgradesQuery.getAttribute("id"));


  c.log("> Bots");
  let botAmountUpgradeQuery = document.querySelector("#bot-upgrade-1");
  if (botAmountUpgradeQuery) c.log(" --> Queried " + botAmountUpgradeQuery.getAttribute("id"));

  let botSpeedUpgradeQuery = document.querySelector("#bot-upgrade-2");
  if (botSpeedUpgradeQuery) c.log(" --> Queried " + botSpeedUpgradeQuery.getAttribute("id"));


  c.log(" --> Adding event listeners to queried objects");
  // Main click object
  clickObjectQuery.addEventListener("click", (event) => {
    p.addResources((1 * p.getSkillLevelUpgrade()) + 2);
    rotateClickObject();
  });


  // Navigation portal
  skillingPortalQuery.addEventListener("click", (event) => {
    navigationWizard(skillingPortalQuery.getAttribute("id").split("-")[0]);
  });
  
  upgradesPortalQuery.addEventListener("click", (event) => {
    navigationWizard(upgradesPortalQuery.getAttribute("id").split("-")[0]);
  });
  
  botsPortalQuery.addEventListener("click", (event) => {
    navigationWizard(botsPortalQuery.getAttribute("id").split("-")[0]);
  });


  // Skilling panel links
  woodcuttingLinkQuery.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + woodcuttingLinkQuery.getAttribute("id"));
    
    // setDoubleClickSkill();

    let skill = woodcuttingLinkQuery.getAttribute("id").split("-")[0].toLowerCase();
    if (p.currentSkill != skill) p.currentSkill = "Woodcutting";
  });

  firemakingLinkQuery.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + firemakingLinkQuery.getAttribute("id"));

    // setDoubleClickSkill();

    let skill = firemakingLinkQuery.getAttribute("id").split("-")[0].toLowerCase();
    if (p.currentSkill != skill) p.currentSkill = "Firemaking";
  });

  fishingLinkQuery.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + fishingLinkQuery.getAttribute("id"));

    let skill = fishingLinkQuery.getAttribute("id").split("-")[0].toLowerCase();
    if (p.currentSkill != skill) p.currentSkill = "Fishing";
  });

  miningLinkQuery.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + miningLinkQuery.getAttribute("id"));

    let skill = miningLinkQuery.getAttribute("id").split("-")[0].toLowerCase();
    if (p.currentSkill != skill) p.currentSkill = "Mining";
  });

  // Upgrade panel links

  skillUpgrade1Query.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + skillUpgrade1Query.getAttribute("id"));    
    let skillUpgradeObject = skill.getSkillObject(p.currentSkill);

    if (skillUpgradeObject.upgradeName[p.getSkillLevelUpgrade() + 1] !== undefined) {
      let skillUpgradeObject = skill.getSkillObject(p.currentSkill);

      if (p.getResourceAmount() >= skillUpgradeObject.upgradeCost[p.getSkillLevelUpgrade() + 1]) {
        p.removeResources(skillUpgradeObject.upgradeCost[p.getSkillLevelUpgrade() + 1]);
        skillToUpgrade(p.currentSkill);
      }
    }
  });

  resetUpgradesQuery.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + resetUpgradesQuery.getAttribute("id"));
    
    // let skillToUpgrade = skillUpgrade1Query.getAttribute("id").split("-")[0].toLowerCase();
    p.woodcutting.upgrade = 1;
    p.fishing.upgrade = 1;
    p.mining.upgrade = 1;
  });


  // Bots Update

  botAmountUpgradeQuery.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + botAmountUpgradeQuery.getAttribute("id"));
    
    // let skillToUpgrade = skillUpgrade1Query.getAttribute("id").split("-")[0].toLowerCase();
    p.upgradeActiveBots();
  });

  botSpeedUpgradeQuery.addEventListener("click", (event) =>  {
    c.log("User clicked id #" + botSpeedUpgradeQuery.getAttribute("id"));
    
  });

  c.log(" --> FINISHED, added event listeners to all queried objects!");
}

const skillToUpgrade = (currentSkill) => {
  switch(currentSkill.toLowerCase()) {
    case "woodcutting":
      p.woodcutting.upgrade++;
      break;

    case "firemaking":
      p.firemaking.upgrade++;
      break;

    case "fishing":
      p.fishing.upgrade++;
      break;

    case "cooking":
      p.cooking.upgrade++;
      break;

    case "mining":
      p.mining.upgrade++;
      break;

    case "smithing":
      p.smithing.upgrade++;
      break;
  }
};

const getExpGapForLevel = (level) => {
  let points = 0;
  let output = 0;

  for (lvl = 1; lvl <= level; lvl++) {
    points += Math.floor(lvl + 45.0 * Math.pow(2.0, lvl / 7.0));

    if (lvl >= level) return output;

    output = parseInt(Math.floor(points / 4));
  }

  return 0;
}

const navigationWizard = (location) => {
  c.log("Teleporting player to --> " + location);
  let currentPanelTitleQuery = document.querySelector("#navbar-title");

  let skillPanelQuerty = document.querySelector("#skilling-panel");
  let upgradesPanelQuerty = document.querySelector("#upgrades-panel");
  let botsPanelQuerty = document.querySelector("#bots-panel");

  skillPanelQuerty.style.display = "none";
  upgradesPanelQuerty.style.display = "none";
  botsPanelQuerty.style.display = "none";

  
  switch(location) {
    case "skilling":
      currentPanelTitleQuery.innerHTML = "Skilling Locations";
      skillPanelQuerty.style.display = "flex";
      break;

    case "upgrades":
      currentPanelTitleQuery.innerHTML = p.currentSkill + " Upgrades";
      upgradesPanelQuerty.style.display = "flex";
      break;

    case "bots":
      currentPanelTitleQuery.innerHTML = "Install " + p.currentSkill + " Bots";
      botsPanelQuerty.style.display = "flex";
      break;
    
    default:
      break;
  }
};

const getTotalExpForLevel = (level) => {
  let points = 0;
  let output = 0;

  for (lvl = 1; lvl <= level; lvl++) {
    points += Math.floor(lvl + 45.0 * Math.pow(2.0, lvl / 7.0));

    if (lvl >= level) return output;

    output = parseInt(Math.floor(points / 4));
  }

  return 0; // Must be calculating the same level or less...
};

const getRemainingXP = () => {
  let currentXP = p.getSkillExperience();
  let targetXP = getTotalExpForLevel(p.getSkillLevel() + 1);

  return parseInt((currentXP / targetXP) * 100);
}