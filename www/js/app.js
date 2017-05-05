// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var starter = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

  });
});

/* factory for a single card */
starter.factory('Card', function(){
  return function(_suit, _number) {
    var suit = "";
    var number = 0;
    var color = "";
    var rank = "0";
    var used = false;
    var image = "";

    /* constructor */
    function init() {
        suit = _suit;
        if(_suit == "spades" || _suit == "clubs")
          color = "black";
        else
          color = "red";
        number = _number;

        /* get the rank as a string */
        if(number > 1 && number < 11)
          rank = number.toString();
        else if(number == 1)
          rank = "ace";
        else if(number == 11)
          rank = "jack";
        else if(number == 12)
          rank = "queen";
        else if(number == 13)
          rank = "king";
        else
          rank = "back";

        used = false;

        /* get the image file */
        if(rank == "back")
          image = "PNG-cards-1.3/card_back.png";
        else
          image = "PNG-cards-1.3/" + rank + "_of_" + suit + ".png";
    }

    /* call constructor */
    init();

    /* accessible variables */
    return {
      suit: suit,
      number: number,
      color: color,
      rank: rank,
      used: used,
      image: image
    };
  };
});

/* factory for a card deck */
starter.factory('CardDeck', function(Card){
  return function() {
    /* array to store cards */
    var cards = [];
    /* array of suit names */
    var suits = ["spades", "clubs", "hearts", "diamonds"];

    /* create cards and store in cards array */
    function fillDeck() {
      var index = 0;
      for(var s = 0; s < suits.length; s++) {
          for(var i = 0; i < 13; i++) {
          var suit = suits[s];
          cards[index] = new Card(suit, i+1);
          index++;
        }
      }
    }

    /* get the next card, returns null if empty */
    function getTopCard() {
      /* Note: pulls card from back of deck */
      for(var i = 0; i < 52; i++) {
        if(cards[i].used == false) {
          cards[i].used = true;
          return cards[i];
        }
      }
      return null;
    }

    /* shuffle the deck */
    function shuffleDeck() {
      for(var i = 0; i < 10000; i++){
        var numOne = Math.floor(Math.random() * 52);
        var numTwo = Math.floor(Math.random() * 52);
        var temp = cards[numOne];
        cards[numOne] = cards[numTwo];
        cards[numTwo] = temp;
      }
    }

    /* fill and shuffle once the deck is created */
    fillDeck();
    shuffleDeck();

    /* accessible functions */
    return {
      getTopCard: getTopCard
    }
  };
});

/* factory for a player */
starter.factory('Player', function() {
  return function(_name) {
    /* array to store players cards */
    var name = "";
    var cards = [];
    var drinksTaken = 0;
    var drinksGiven = 0;
    var drinksToGive = 0;
    var takenFromGiven = 0;
    var numCards = 0;

    /* constructor */
    function init() {
      name = _name;
      cards = [];
      drinksTaken = 0;
      drinksGiven = 0;
      drinksToGive = 0;
      takenFromGiven = 0;
      numCards = 0;
    }

    /* call constructor */
    init();

    /* get name */
    function getName() {
      return name;
    }

    /* increment drinks taken */
    function takeDrinks(drinks) {
      drinksTaken += drinks;
    }

    /* initialize drinks to give to proper number */
    function giveDrinks(drinks) {
      drinksToGive = drinks;
    }

    /* get the number of drinks to give */
    function getDrinksToGive(){
      return drinksToGive;
    }

    /* give another player a drinks and count it */
    function givePlayerADrink(player){
      player.takeDrinks(1);
      drinksToGive--;
      drinksGiven++;
    }

    /* add card */
    function addCard(card) {
      cards.push(card);
      numCards++;
    }

    /* get cards */
    function getCards() {
      return cards;
    }

    /* get number of drinks taken */
    function getTaken() {
      return drinksTaken;
    }

    /* get number of drinks given */
    function getGiven() {
      return drinksGiven;
    }

    /* get number of cards */
    function getNumCards() {
      return numCards;
    }

    /* return number of matches if a player has a certain card value and remove the card from their deck */
    function matchedCard(_card) {
      var numMatches = 0;
      var indices = [];
      for(var i = 0; i < cards.length; i++) {
        if (cards[i].number == _card.number) {
          indices.push(i);
          numMatches++;
          numCards--;
        }
      }

      /* remove matches from their hand */
      for(var index = 0; i < indices.length; i++)
        cards.splice(indices[index], 1);

      /* return number of matches */
      return numMatches;
    }

    /* accessible functions */
    return {
      getName: getName,
      takeDrinks: takeDrinks,
      giveDrinks: giveDrinks,
      addCard: addCard,
      getCards: getCards,
      getTaken: getTaken,
      getGiven: getGiven,
      getDrinksToGive: getDrinksToGive,
      givePlayerADrink: givePlayerADrink,
      matchedCard: matchedCard,
      getNumCards: getNumCards,
      takenFromGiven: takenFromGiven
    }
  }
});

/* states, turned off cache for dynamic html */
starter.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('home', {
    url: '/blizr',
    templateUrl: 'home.html'
  })
   .state('players', {
     url: '/players',
     controller: 'playersCtrl',
     templateUrl: 'players.html',
     cache: false
   })
    .state('roundTransition', {
      url: '/roundTransition',
      controller: 'roundTransitionCtrl',
      templateUrl: 'roundTransition.html',
      cache: false
    })
    .state('givePlayersDrinks', {
      url: '/givePlayersDrinks',
      controller: 'givePlayersDrinksCtrl',
      templateUrl: 'givePlayersDrinks.html',
      cache: false
    })
    .state('guessColor', {
      url: '/guessColor',
      controller: 'guessColorCtrl',
      templateUrl: 'guessColor.html',
      cache: false
    })
    .state('overOrUnder', {
      url: '/overOrUnder',
      controller: 'overOrUnderCtrl',
      templateUrl: 'overOrUnder.html',
      cache: false
    })
    .state('inOrOut', {
      url: '/inOrOut',
      controller: 'inOrOutCtrl',
      templateUrl: 'inOrOut.html',
      cache: false
    })
    .state('guessSuit', {
      url: '/guessSuit',
      controller: 'guessSuitCtrl',
      templateUrl: 'guessSuit.html',
      cache: false
    })
    .state('matchCards', {
      url: '/matchCards',
      controller: 'matchCardsCtrl',
      templateUrl: 'matchCards.html',
      cache: false
    })
    .state('rideTheBus', {
      url: '/rideTheBus',
      controller: 'rideTheBusCtrl',
      templateUrl: 'rideTheBus.html',
      cache: false
    })
    .state('finalResults', {
      url: '/finalResults',
      controller: 'finalResultsCtrl',
      templateUrl: 'finalResults.html',
      cache: false
    })
    .state('settings', {
      url: '/settings',
      controller: 'settingsCtrl',
      templateUrl: 'settings.html',
      cache: false
  })
    .state('instructions', {
    url: '/instructions',
      controller: 'instructionsCtrl',
      templateUrl: 'instructions.html',
      cache: false
  })
    .state('gameSettings', {
      url: '/gameSettings',
      controller: 'gameSettingsCtrl',
      templateUrl: 'gameSettings.html',
      cache: false
  })
    .state('aboutUs', {
      url: '/aboutUs',
      controller: 'aboutUsCtrl',
      templateUrl: 'aboutUs.html',
      cache: false
    });

  $urlRouterProvider.otherwise('/blizr');
});

/* main page controller */
starter.controller('MainCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicViewSwitcher, $ionicPopup) {
  $scope.toPlayersState = function() {
    $ionicViewSwitcher.nextDirection('forward');
    $state.go("players");
  };

  $scope.toSettings = function() {
    $ionicViewSwitcher.nextDirection('forward');
    $state.go("settings");
  };

  $scope.sendFeedback= function() {
    if(window.plugins && window.plugins.emailComposer) {
      window.plugins.emailComposer.showEmailComposerWithCallback(function(result) {
          console.log("Response -> " + result);
        },
        "Feedback for your App", // Subject
        "",                      // Body
        ["cdekeyser@wisc.edu"],    // To
        null,                    // CC
        null,                    // BCC
        false,                   // isHTML
        null,                    // Attachments
        null);                   // Attachment Data
    }
  };

  $scope.twitterShare = function(){
    window.plugins.socialsharing.shareViaTwitter('@Blitzr_Dev_Team', null, null, null, null);
  };

  $scope.fbShare = function(){
    window.plugins.socialsharing.shareViaFacebook("", null, null, null);
  };

  $scope.toPopUp = function() {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Quit game?',
      template: 'Are you sure you want to quit the game? All data will be lost.'
    });
    confirmPopup.then(function(res) {
      if(res) {
        $ionicViewSwitcher.nextDirection('exit');
        $state.go('home');
      }
  });
  }
});

/* settings controller */
starter.controller('settingsCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicViewSwitcher) {

  $scope.toHome = function() {
    $ionicViewSwitcher.nextDirection('back');
    $state.go("home");
  };
  $scope.toInstructions = function() {
    $ionicViewSwitcher.nextDirection('forward');
    $state.go("instructions");
  };
  $scope.toGameSettings = function() {
    $ionicViewSwitcher.nextDirection('forward');
    $state.go("gameSettings")
  };
  $scope.toAboutUs = function() {
    $ionicViewSwitcher.nextDirection('forward');
    $state.go("aboutUs");
  }
});

/* instructions controller */
starter.controller('instructionsCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicViewSwitcher) {

  $scope.toSettings = function() {
    $ionicViewSwitcher.nextDirection('back');
    $state.go('settings');
  };
});

/* game settings controller */
starter.controller('gameSettingsCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicViewSwitcher) {

  $scope.toSettings = function() {
    $ionicViewSwitcher.nextDirection('back');
    $state.go('settings');
  };
});

/* about us controller */
starter.controller('aboutUsCtrl', function($scope, $state, $ionicModal, $ionicLoading, $ionicViewSwitcher) {

  $scope.toSettings = function() {
    $ionicViewSwitcher.nextDirection('back');
    $state.go('settings');
  };
});

/* players pane controller */
starter.controller('playersCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                           Player, $ionicViewSwitcher, $ionicPopup) {
  /* back to home page */
  $scope.toHome = function() {
    $ionicViewSwitcher.nextDirection('back');
    $state.go('home');
  };

  /* list of players */
  $scope.listOfPlayers = [{
    value: null
  }];

  /* remove add player */
  $scope.addPlayer = function () {
    $scope.listOfPlayers.push({
      value: null
    });
  };

  /* remove player */
  $scope.removePlayer = function (index) {
      $scope.listOfPlayers.splice(index, 1);
  };

  /* start RTB, store player names */
  $scope.toTheBus = function() {

    /* create a player for each user input */
    $rootScope.players = [];
    for (var i = 0; i < $scope.listOfPlayers.length; i++) {
      /* if the next player isn't null, add it to the list of players */
      if ($scope.listOfPlayers[i].value != null) {
        /* limit the name to 12 characters */
        if($scope.listOfPlayers[i].value.length > 10) {
          $scope.listOfPlayers[i].value = $scope.listOfPlayers[i].value.substr(0, 9);
        }
        $rootScope.players.push(new Player($scope.listOfPlayers[i].value));
      }
    }

    /* initialize current player to first player */
    $rootScope.currentPlayer = $rootScope.players[0];

    /* initialize current player number to 1 */
    $rootScope.currentPlayerNumber = 1;

    /* initialize round number to 1 */
    $rootScope.roundNumber = 1;

    /* initialize round name to red or black */
    $rootScope.roundName = "Red or Black?";

    /* create a new deck */
    $rootScope.deck = new CardDeck();

    /* create a new back of card */
    $rootScope.cardBack = new Card("", 0);
    $rootScope.nextCard = $rootScope.cardBack;

    /* VALUES FOR WILD CARD DISPLAY */
    /* create array for matched player, will be used in wild card round */
    $rootScope.matchedPlayers = [];

    /* reset the match cards display */
    $rootScope.matchedPlayersDisplay = [];

    /* cards to be matched */
    $rootScope.matchCards = [];

    /* store card images for matched cards */
    $rootScope.cardImages = [];

    /* track current card index for matched round */
    $rootScope.currentCard = 0;

    /* cards to be prompts match cards are initialized to zero when game starts */
    $rootScope.matchCardsPrompt = [];

    /* only start if at least 1 player has been entered */
    if ($rootScope.players.length > 0) {
    /* go to RTB */
    var alertPopup = $ionicPopup.alert({
      title: 'Warning!',
      template: 'Please drink responsibly. You and only you are responsible for any consequences that result from using ' +
      'Blitzr.'
    });

    alertPopup.then(function (res) {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go("roundTransition");
    });
  }
  };
});


/* correct or wrong controller, also determines next state based on round */
starter.controller('roundTransitionCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                                   Player, $ionicViewSwitcher) {

  /* find the players to ride the bus */
  $scope.findPlayerToRide = function() {
    var mostCards = 0;
    $rootScope.playersToRide = [];

    /* find the most cards */
    for(var i = 0; i < $rootScope.players.length; i++) {
      if($rootScope.players[i].getNumCards() > mostCards) {
        mostCards = $rootScope.players[i].getNumCards();
        $rootScope.playersToRide = [];
        $rootScope.playersToRide.push($rootScope.players[i]);
      }
      else if($rootScope.players[i].getNumCards() == mostCards) {
        $rootScope.playersToRide.push($rootScope.players[i]);
      }
    }

    /* rtb display */
    $rootScope.rtbDisplay = "";

    if($rootScope.playersToRide.length == 1)
      $rootScope.rtbDisplay = $rootScope.playersToRide[0].getName() + " is Riding the Bus!";
    else if($rootScope.playersToRide.length == 2) {
      $rootScope.rtbDisplay = $rootScope.playersToRide[0].getName() + " and " + $rootScope.playersToRide[1].getName()
        + " are Riding the Bus!";
    }
    else {
      for(i = 0; i < $rootScope.playersToRide.length - 1; i++)
        $rootScope.rtbDisplay += $rootScope.playersToRide[i].getName() + ", ";
      $rootScope.rtbDisplay += " and " + $rootScope.playersToRide[$rootScope.playersToRide.length - 1].getName();
      $rootScope.rtbDisplay += " are Riding the Bus!"
    }
  };

  /* check the round to set special displays */
  $scope.checkRound = function () {
    if($rootScope.roundNumber == 5) {
      document.getElementById("roundNumber").style.visibility = "hidden";
      document.getElementById("nextPlayer").style.visibility = "hidden";
      document.getElementById("rtbDisplay").style.visibility = "hidden";
      $rootScope.roundName = "Wild Card Round!"
    }
    else if($rootScope.roundNumber == 6) {
      $scope.findPlayerToRide();
      document.getElementById("roundNumber").style.visibility = "hidden";
      document.getElementById("nextPlayer").style.visibility = "hidden";
      document.getElementById("roundName").style.visibility = "hidden";
      document.getElementById("rtbDisplay").style.visibility = "visible";
    }
    else {
      document.getElementById("roundNumber").style.visibility = "visible";
      document.getElementById("nextPlayer").style.visibility = "visible";
      document.getElementById("rtbDisplay").style.visibility = "hidden";
    }
  };

  /* check the round when the page loads */
  window.onload = $scope.checkRound();

  /* go to the next round on a click */
  $scope.toNextRound = function () {
    /* set the next card to display the back of a card */
    $rootScope.nextCard = $rootScope.cardBack;

    /* reset correct/wrong and take/give displays */
    $rootScope.correctOrWrong = "";
    $rootScope.takeOrGive = "";

    $ionicViewSwitcher.nextDirection('forward');
    /* go to the next round and/or player */
    if ($rootScope.roundNumber == 1)
      $state.go("guessColor");
    else if ($rootScope.roundNumber == 2)
      $state.go("overOrUnder");
    else if ($rootScope.roundNumber == 3)
      $state.go("inOrOut");
    else if ($rootScope.roundNumber == 4)
      $state.go("guessSuit");
    else if ($rootScope.roundNumber == 5)
      $state.go("matchCards");
    else
      $state.go("rideTheBus");
  };
});

starter.controller('givePlayersDrinksCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                                     Player, $ionicViewSwitcher) {
  /* enable next player button and disable player buttons */
  $scope.enableNext = function() {
    document.getElementById("giveTransButton").disabled = false;
  };

  /* reset the page */
  $scope.resetPage = function() {
    document.getElementById("giveTransButton").disabled = true;
    /* reset the taken from given drinks for this page */
    for(var i = 0; i < $rootScope.players.length; i++)
      $rootScope.players[i].takenFromGiven = 0;

    /* get list of players, previous player, and drinks able to give */
    $scope.listOfPlayers = $rootScope.players;

    /* get the proper player */
    if($rootScope.matchedPlayers[0] != null) {
      $scope.prevPlayer = $rootScope.matchedPlayers[0];
      $scope.matchingRound = true;
    }
    else {
      $scope.prevPlayer = $rootScope.previousPlayer;
      $scope.matchingRound = false;
    }

    $scope.remainingDrinks = $scope.prevPlayer.getDrinksToGive();

    /* placeholder for message to display */
    $scope.playerDisplay = "";

    /* placeholder for continue message */
    $scope.continueMessage = "";

    /* reset the match cards display */
    $rootScope.matchedPlayersDisplay = [];
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.resetPage();

  /* give a drink to the desired player */
  $scope.giveDrink = function(player){
    /* only allow drinks to be given if there are drinks to give */
    if($scope.remainingDrinks > 0) {
      /* increment the number of drinks the player been given on this prompt */
      player.takenFromGiven++;

      /* set the proper display */
      if(player.takenFromGiven == 1)
        $scope.playerDisplay = player.getName() + " Take A Drink!";
      else
        $scope.playerDisplay = player.getName() + " Take " + player.takenFromGiven + " Drinks!";

      /* decrement the number of drinks to give */
      $scope.remainingDrinks--;
      $scope.prevPlayer.givePlayerADrink(player);
      /* if there are no more drinks to give, prompt and enable next page */
      if ($scope.remainingDrinks <= 0) {
        $scope.continueMessage = "Tap Here to Continue";
        $scope.enableNext();
      }
    }
  };

  /* go to the next page */
  $scope.toNextPlayer = function() {

    $ionicViewSwitcher.nextDirection('forward');
    /* if there are no drinks left to give, and it isn't the matching round, go to the round transition page */
    if($scope.remainingDrinks == 0 && $scope.matchingRound == false)
      $state.go("roundTransition");
    /* if there are no drinks left and it is the matching round */
    else if($scope.remainingDrinks == 0 && $scope.matchingRound == true) {
      /* if the last player has picked drinks, remove them from the list */
      if($rootScope.matchedPlayers.length == 1) {
        $rootScope.matchedPlayers.splice(0, 1);
        /* if the last card was flipped in matchCards, go to the round transition page */
        if($rootScope.roundNumber == 6)
          $state.go("roundTransition");
        /* if the last card hasn't been flipped in matchCards, go to matchCards page */
        else
          $state.go("matchCards");
      }
      /* there is another player left to pick drinks, remove the most recent player and reset the page */
      else {
        $rootScope.matchedPlayers.splice(0, 1);
        $scope.resetPage();
      }
    }
  };
});

/* first round (guess color) controller */
starter.controller('guessColorCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player, $ionicViewSwitcher){

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide red/black */
  $scope.enableNext = function() {
    document.getElementById("colorTransButton").disabled = false;
    document.getElementById("red_button").style.visibility = "hidden";
    document.getElementById("black_button").style.visibility = "hidden";
  };

  /* disable next player button and show red/black */
  $scope.disableNext = function() {
    document.getElementById("colorTransButton").disabled = true;
    document.getElementById("red_button").style.visibility = "visible";
    document.getElementById("black_button").style.visibility = "visible";
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext();

  /* first card, red or black */
  $scope.guessColor = function(color) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* check if the guess is correct and set prompt */
    if(color == $rootScope.nextCard.color) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(1);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give A Drink!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(1);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take A Drink!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the previous player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 1)
      $rootScope.roundName = "Red or Black?";
    else
      $rootScope.roundName = "Higher or Lower?";

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    $ionicViewSwitcher.nextDirection('forward');
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});

/* second round (guess higher or lower) controller */
starter.controller('overOrUnderCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player, $ionicViewSwitcher) {

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide over/under */
  $scope.enableNext = function() {
    document.getElementById("overOrUnderTransButton").disabled = false;
    document.getElementById("over_button").style.visibility = "hidden";
    document.getElementById("under_button").style.visibility = "hidden";
  };

  /* disable next player button and show over/under */
  $scope.disableNext = function() {
    document.getElementById("overOrUnderTransButton").disabled = true;
    document.getElementById("over_button").style.visibility = "visible";
    document.getElementById("under_button").style.visibility = "visible";
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext();

  /* second card, over or under */
  $scope.overOrUnder = function(guess) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* get the first card number */
    var firstCardNumber = $rootScope.currentPlayer.getCards()[0].number;

    /* check if the guess is correct and set prompt, go to the correct or wrong state */
    if((guess == "over" && $rootScope.nextCard.number > firstCardNumber) ||
      (guess == "under" && $rootScope.nextCard.number < firstCardNumber)) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(2);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Two Drinks!";
    }
    else if($rootScope.nextCard.number == firstCardNumber) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(4);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Four Drinks!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(2);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Two Drinks!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the previous player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 2)
      $rootScope.roundName = "Higher or Lower?";
    else
      $rootScope.roundName = "Inside or Outside?";

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    $ionicViewSwitcher.nextDirection('forward');
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});

/* third round (guess in or out) controller */
starter.controller('inOrOutCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player, $ionicViewSwitcher) {

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide in/out buttons*/
  $scope.enableNext = function() {
    document.getElementById("inOrOutTransButton").disabled = false;
    document.getElementById("inside_button").style.visibility = "hidden";
    document.getElementById("outside_button").style.visibility = "hidden";
  };

  /* disable next player button and show in/out buttons */
  $scope.disableNext = function() {
    document.getElementById("inOrOutTransButton").disabled = true;
    document.getElementById("inside_button").style.visibility = "visible";
    document.getElementById("outside_button").style.visibility = "visible";
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext();

  /* third card, inside or outside */
  $scope.inOrOut = function(guess) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* get the first two cards on the guess */
    var firstCardNumber = $rootScope.currentPlayer.getCards()[0].number;
    var secondCardNumber = $rootScope.currentPlayer.getCards()[1].number;

    /* get the bounds */
    var upper = Math.max(firstCardNumber, secondCardNumber);
    var lower = Math.min(firstCardNumber, secondCardNumber);

    /* check if the guess is correct and set prompt */
    if(guess == "outside" && ($rootScope.nextCard.number < lower || $rootScope.nextCard.number > upper)) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(3);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Three Drinks!";
    }
    else if((guess == "inside" && ($rootScope.nextCard.number > lower && $rootScope.nextCard.number < upper))) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(3);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Three Drinks!";
    }
    else if($rootScope.nextCard.number == lower || $rootScope.nextCard.number == upper) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(6);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Six Drinks!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(3);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Three Drinks!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the current player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 3)
      $rootScope.roundName = "Inside or Outside?";
    else
      $rootScope.roundName = "Guess the Suit!";

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    $ionicViewSwitcher.nextDirection('forward');
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});

/* fourth round (guess suit) controller */
starter.controller('guessSuitCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                             Player, $ionicViewSwitcher) {

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null)
      $rootScope.nextCard = $rootScope.cardBack;
  };

  /* enable next player button and hide suit buttons */
  $scope.enableNext = function() {
    document.getElementById("suitTransButton").disabled = false;
    document.getElementById("diamonds_button").style.visibility = "hidden";
    document.getElementById("hearts_button").style.visibility = "hidden";
    document.getElementById("spades_button").style.visibility = "hidden";
    document.getElementById("clubs_button").style.visibility = "hidden";
  };

  /* disable next player button and show suit buttons */
  $scope.disableNext = function() {
    document.getElementById("suitTransButton").disabled = true;
    document.getElementById("diamonds_button").style.visibility = "visible";
    document.getElementById("hearts_button").style.visibility = "visible";
    document.getElementById("spades_button").style.visibility = "visible";
    document.getElementById("clubs_button").style.visibility = "visible";
  };

  /* every time the page loads, the next player button begins disabled */
  window.onload = $scope.disableNext();

  /* first card, red or black */
  $scope.guessSuit = function(suit) {

    /* enable the next player button */
    $scope.enableNext();

    /* get the next card */
    $scope.getCard();

    /* add the card to the player's hand */
    $rootScope.currentPlayer.addCard($rootScope.nextCard);

    /* check if the guess is correct and set prompt */
    if(suit == $rootScope.nextCard.suit) {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].giveDrinks(4);
      $rootScope.correctOrWrong = "CORRECT!";
      $rootScope.takeOrGive = "Give Four Drinks!";
    }
    else {
      $rootScope.players[$rootScope.currentPlayerNumber - 1].takeDrinks(4);
      $rootScope.correctOrWrong = "WRONG!";
      $rootScope.takeOrGive = "Take Four Drinks!";
    }
  };

  /* go to the next player on a click */
  $scope.toNextPlayer = function() {
    /* store the current player */
    $rootScope.previousPlayer = $rootScope.currentPlayer;

    /* determine if the current player is the last in the round, set proper variables */
    if($rootScope.currentPlayerNumber == $rootScope.players.length) {
      $rootScope.currentPlayerNumber = 1;
      $rootScope.currentPlayer = $rootScope.players[0];
      $rootScope.roundNumber++;
    }
    else {
      $rootScope.currentPlayer = $rootScope.players[$rootScope.currentPlayerNumber];
      $rootScope.currentPlayerNumber++;
    }

    /* update round name */
    if($rootScope.roundNumber == 4)
      $rootScope.roundName = "Guess the Suit!";
    else {
      $rootScope.currentPlayer = $rootScope.players[0];
    }

    /* go to the give drinks page if there are drinks to give, otherwise the transition page */
    $ionicViewSwitcher.nextDirection('forward');
    if($rootScope.previousPlayer.getDrinksToGive() > 0)
      $state.go("givePlayersDrinks");
    else
      $state.go("roundTransition");
  };
});

/* match cards controller */
starter.controller('matchCardsCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player, $ionicViewSwitcher) {

  /* get the next card from the deck */
  $scope.getCard = function() {
    $rootScope.nextCard = $rootScope.deck.getTopCard();
    if($rootScope.nextCard == null) {
      $rootScope.deck = new CardDeck();
      $rootScope.nextCard = $rootScope.deck.getTopCard();
    }
  };

  /* function to initial wild card round */
  $scope.init = function() {
    /* track that it has been initialized */
    $scope.initialized = true;

    /* cards to be prompts match cards are initialized to zero when game starts */
    $rootScope.matchCardsPrompt = [];

    /* store card images */
    $rootScope.cardImages = [];

    /* get the number of cards to be flipped over, initialize image to card back */
    var duplicates = false;
    for(var i = 0; i < 8; i++) {
      $scope.getCard();
      $rootScope.cardImages[i] = $rootScope.nextCard.image;

      /* if the card isn't the first, check if there is a duplicate */
      if (i > 0) {
        for (var k = 0; k < $rootScope.matchCards.length; k++) {
          if ($rootScope.matchCards[k].number == $rootScope.nextCard.number) {
            duplicates = true; // it is a duplicate
          }
        }
      }
      /* if it isn't a duplicate, add it to the list of cards */
      if (!duplicates) {
          $rootScope.matchCards[i] = $rootScope.nextCard;
          $rootScope.matchCards[i].image = $rootScope.cardBack.image;
          var drinks = (Math.floor(i / 2 + 1)).toString();
          if (i == 0) {
            $rootScope.matchCardsPrompt[i] = "Give " + drinks + "\nDrink"
          }
          else if (i == 1) {
            $rootScope.matchCardsPrompt[i] = "Take " + drinks + "\nDrink"
          }
          else if (i % 2 == 0) {
            $rootScope.matchCardsPrompt[i] = "Give " + drinks + "\nDrinks"
          }
          else {
            $rootScope.matchCardsPrompt[i] = "Take " + drinks + "\nDrinks"
          }
      }
      /* card is a duplicate, do not add it and get another card */
      else {
        if (i > 0) {
          duplicates = false;
          i--;
        }
      }
    }

    /* track current card index for matched round */
    $rootScope.currentCard = 0;
  };

  /* initialize the wild card round if necessary */
  if($scope.initialized != true &&  $rootScope.matchCards.length == 0)
    $scope.init();

  /* reset display */
  $scope.resetDisplay = function() {
    /* matched players list */
    $rootScope.matchedPlayers = [];

    /* matched players drinks */
    $scope.matchedPlayersDrinks = [];

    /* matched player display */
    $rootScope.matchedPlayersDisplay = [];

    /* give or take display */
    $scope.giveOrTakeDisplay = "";

    /* placeholder for continue message */
    $scope.continueMessage = "Tap to Flip";

    /* boolean to tell if a card can be flipped */
    $scope.canFlip = true;
  };

  /* enable the next state transition */
  $scope.enableNext = function() {
    $scope.canFlip = false;
  };

  /* every time the page loads, reset the display */
  window.onload = $scope.resetDisplay();

  /* interpret click */
  $scope.onClick = function() {
    if($scope.canFlip) {
      $scope.flipCard();
    }
    else {
      $scope.toNextCard()
    }
  };

  /* flip the next card */
  $scope.flipCard = function() {
      /* get the next card and assign to flipped card */
      $rootScope.matchCards[$rootScope.currentCard].image = $rootScope.cardImages[$rootScope.currentCard];

      /* determine which player has the card and add them to the list if they do */
      for (var i = 0; i < $rootScope.players.length; i++) {
        /* get the number of matches and drinks for a round and player */
        var numMatches = $rootScope.players[i].matchedCard($rootScope.matchCards[$rootScope.currentCard]);
        var numDrinks = numMatches * Math.floor($rootScope.currentCard / 2 + 1);

        /* if the number of matches is greater than zero, give or take drinks appropriately */
        if (numMatches > 0) {
          /* add the player that matched to the list, and the number of drinks to take/give */
          $rootScope.matchedPlayers.push($rootScope.players[i]);
          $scope.matchedPlayersDrinks.push(numDrinks);

          /* if the round is even, the player has drinks to give, otherwise they have drinks to take */
          if ($rootScope.currentCard % 2 == 0)
            $rootScope.players[i].giveDrinks(numDrinks);
          else
            $rootScope.players[i].takeDrinks(numDrinks);
        }
      }

      /* set the proper give/take display */
      if ($rootScope.currentCard % 2 == 0)
        $scope.giveOrTakeDisplay = " Give ";
      else
        $scope.giveOrTakeDisplay = " Take ";

      /* set the proper display for each player */
      for (i = 0; i < $rootScope.matchedPlayers.length; i++) {
        if ($scope.matchedPlayersDrinks[i] == 1) {
          $rootScope.matchedPlayersDisplay[i] = $rootScope.matchedPlayers[i].getName() + $scope.giveOrTakeDisplay +
            $scope.matchedPlayersDrinks[i].toString() + " Drink!";
        }
        else {
          $rootScope.matchedPlayersDisplay[i] = $rootScope.matchedPlayers[i].getName() + $scope.giveOrTakeDisplay +
            $scope.matchedPlayersDrinks[i].toString() + " Drinks!"
        }
      }

      /* display continue message */
      $scope.continueMessage = "Tap to Continue";

      /* set display if no one last card */
      if($rootScope.matchedPlayers.length == 0) {
        if ($rootScope.matchCards[$rootScope.currentCard].number == 1 || $rootScope.matchCards[$rootScope.currentCard].number == 8)
          $rootScope.matchedPlayersDisplay[0] = "No one has an " + $rootScope.matchCards[$rootScope.currentCard].rank.toUpperCase();
        else
          $rootScope.matchedPlayersDisplay[0] = "No one has a " + $rootScope.matchCards[$rootScope.currentCard].rank.toUpperCase();
      }

      /* enable next state */
      $scope.enableNext();

      /* increment current card index */
      $rootScope.currentCard++;
    };

  $scope.toNextCard = function(){
    /* if the last card has been turned over, increment the round number */
    if ($rootScope.currentCard >= $rootScope.matchCards.length) {
      $rootScope.roundNumber++;
    }
    /* go to give drinks page if there are drinks to give, otherwise reset display (more cards) or go to round transition
      * (no more cards) */
    $ionicViewSwitcher.nextDirection('forward');
    if (($rootScope.matchedPlayers[0] != null) && (($rootScope.currentCard - 1) % 2 == 0)) {
      $state.go("givePlayersDrinks");
    }
    else if ($rootScope.roundNumber == 5) {
      $scope.resetDisplay();
    }
    else {
      $state.go("roundTransition");
    }
  };
});

/* ride the bus controller */
starter.controller('rideTheBusCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player, $ionicViewSwitcher) {

  /* new card deck for Riding the Bus */
  $scope.deck = new CardDeck();

  /* get the display */
  $scope.rtbDisplay = $rootScope.rtbDisplay;

  /* disable next player button and show red/black */
  $scope.loadRTB = function () {
    /* initialize cards to back of cards */
    $scope.firstCard = $rootScope.cardBack;
    $scope.secondCard = $rootScope.cardBack;
    $scope.thirdCard = $rootScope.cardBack;
    $scope.fourthCard = $rootScope.cardBack;
    $scope.currentCardRTB = 0;
    document.getElementById("colorOptions").style.visibility = "visible";
    document.getElementById("overOrUnderOptions").style.visibility = "hidden";
    document.getElementById("insideOrOutsideOptions").style.visibility = "hidden";
    document.getElementById("suitOptions").style.visibility = "hidden";
    document.getElementById("rtbTransButton").disabled = true;

    $scope.correctOrWrong = "";
    $scope.takeOrGive = "";
  };

  /* load the next RTB round */
  $scope.loadNextRound = function() {
    $scope.correctOrWrong = "";
    $scope.takeOrGive = "";
    $scope.disableNext();

    if($scope.currentCardRTB == 0) {
      $scope.loadRTB();
    }
    else if($scope.currentCardRTB == 1) {
      document.getElementById("overOrUnderOptions").style.visibility = "visible";
    }
    else if($scope.currentCardRTB == 2) {
      document.getElementById("insideOrOutsideOptions").style.visibility = "visible";
    }
    else if($scope.currentCardRTB == 3) {
      document.getElementById("suitOptions").style.visibility = "visible";
    }
    else {
      $ionicViewSwitcher.nextDirection('forward');
      $state.go("finalResults");
    }
  };

  /* enable next state */
  $scope.enableNext = function() {
    document.getElementById("rtbTransButton").disabled = false;
  };

  /* disable next state */
  $scope.disableNext = function() {
    document.getElementById("rtbTransButton").disabled = true;
  };

  /* every time the page loads, create a deck and four cards */
  window.onload = $scope.loadRTB();

  /* get the next card from the deck */
  $scope.getCard = function() {
    $scope.nextCard = $scope.deck.getTopCard();
    /* create new deck if deck is out of cards */
    if($scope.nextCard == null) {
      $scope.deck = new CardDeck();
      $scope.nextCard = $scope.deck.getTopCard();
    }
  };

  /* first card, red or black */
  $scope.guessColor = function (color) {
    /* hide red/black buttons */
    document.getElementById("colorOptions").style.visibility = "hidden";

    /* get the next card and set first card to it */
    $scope.getCard();
    $scope.firstCard = $scope.nextCard;

    /* check if the guess is correct and set prompt */
    if(color == $scope.firstCard.color) {
      $scope.correctOrWrong = "CORRECT!";
      $scope.takeOrGive = "Tap to Continue";
      $scope.currentCardRTB++;
    }
    else {
      for(var i = 0; i < $rootScope.playersToRide.length; i++)
        $rootScope.playersToRide[i].takeDrinks(1);
      $scope.correctOrWrong = "WRONG!";
      $scope.takeOrGive = "Take A Drink and Restart!";
      $scope.currentCardRTB = 0;
    }
    $scope.enableNext();
  };

  /* second card, over or under */
  $scope.overOrUnder = function(guess) {
    /* hide over/under buttons */
    document.getElementById("overOrUnderOptions").style.visibility = "hidden";

    /* get the next card and set second card to it */
    $scope.getCard();
    $scope.secondCard = $scope.nextCard;

    /* get the first two cards on the guess */
    var firstCardNumber = $scope.firstCard.number;

    /* check if the guess is correct and set prompt */
    if((guess == "over" && $scope.secondCard.number > firstCardNumber) ||
      (guess == "under" && $scope.secondCard.number < firstCardNumber)) {
      $scope.correctOrWrong = "CORRECT!";
      $scope.takeOrGive = "Tap to Continue";
      $scope.currentCardRTB++;
    }
    else if($scope.secondCard.number == firstCardNumber) {
      for(var i = 0; i < $rootScope.playersToRide.length; i++)
        $rootScope.playersToRide[i].takeDrinks(2);
      $scope.correctOrWrong = "WRONG!";
      $scope.takeOrGive = "Take 2 Drinks and Restart!";
      $scope.currentCardRTB = 0;
    }
    else {
      for(i = 0; i < $rootScope.playersToRide.length; i++)
        $rootScope.playersToRide[i].takeDrinks(1);
      $scope.correctOrWrong = "WRONG!";
      $scope.takeOrGive = "Take A Drink and Restart!";
      $scope.currentCardRTB = 0;
    }
    $scope.enableNext();
  };


  /* third card, inside or outside */
  $scope.inOrOut = function(guess) {
    /* hide red/black buttons */
    document.getElementById("insideOrOutsideOptions").style.visibility = "hidden";

    /* get the next card and set third card to it */
    $scope.getCard();
    $scope.thirdCard = $scope.nextCard;

    /* get the first two cards on the guess */
    var firstCardNumber = $scope.firstCard.number;
    var secondCardNumber = $scope.secondCard.number;

    /* get the bounds */
    var upper = Math.max(firstCardNumber, secondCardNumber);
    var lower = Math.min(firstCardNumber, secondCardNumber);

    /* check if the guess is correct and set prompt */
    if(guess == "outside" && ($scope.thirdCard.number < lower || $scope.thirdCard.number > upper)) {
      $scope.correctOrWrong = "CORRECT!";
      $scope.takeOrGive = "Tap to Continue";
      $scope.currentCardRTB++;
    }
    else if((guess == "inside" && ($scope.thirdCard.number > lower && $scope.thirdCard.number < upper))) {
      $scope.correctOrWrong = "CORRECT!";
      $scope.takeOrGive = "Tap to Continue";
      $scope.currentCardRTB++;
    }
    else if($scope.thirdCard.number == lower || $scope.thirdCard.number == upper) {
      for(var i = 0; i < $rootScope.playersToRide.length; i++)
        $rootScope.playersToRide[i].takeDrinks(2);
      $scope.correctOrWrong = "WRONG!";
      $scope.takeOrGive = "Take 2 Drinks and Restart!";
      $scope.currentCardRTB = 0;
    }
    else {
      for(i = 0; i < $rootScope.playersToRide.length; i++)
        $rootScope.playersToRide[i].takeDrinks(1);
      $scope.correctOrWrong = "WRONG!";
      $scope.takeOrGive = "Take A Drink and Restart!";
      $scope.currentCardRTB = 0;
    }
    $scope.enableNext();
  };

  /* fourth card, over or under */
  $scope.guessSuit = function(suit) {
    document.getElementById("suitOptions").style.visibility = "hidden";

    /* get the next card and set fourth card to it */
    $scope.getCard();
    $scope.fourthCard = $scope.nextCard;

    /* check if the guess is correct and set prompt */
    if(suit == $scope.fourthCard.suit) {
      $scope.correctOrWrong = "CONGRATS!";
      $scope.takeOrGive = "You Have Rode the Bus!";
      $scope.currentCardRTB++;
    }
    else {
      for(var i = 0; i < $rootScope.playersToRide.length; i++)
        $rootScope.playersToRide[i].takeDrinks(1);
      $scope.correctOrWrong = "WRONG!";
      $scope.takeOrGive = "Take A Drink and Restart!";
      $scope.currentCardRTB = 0;
    }
    $scope.enableNext();
  };
});

/* final results controller */
starter.controller('finalResultsCtrl', function($rootScope, $scope, $state, $ionicModal, $ionicLoading, Card, CardDeck,
                                              Player, $ionicViewSwitcher) {

  /* sort the list by drinks taken */
  $scope.sortList = function() {
    /* list of players on this controller */
    $scope.listOfPlayers = $rootScope.players;
    for (var i = 0; i < $scope.listOfPlayers.length; i++) {
      for (var k = i + 1; k < $scope.listOfPlayers.length; k++) {
        if ($scope.listOfPlayers[k].getTaken() > $scope.listOfPlayers[i].getTaken()) {
          var tempPlayer = $scope.listOfPlayers[i];
          $scope.listOfPlayers[i] = $scope.listOfPlayers[k];
          $scope.listOfPlayers[k] = tempPlayer;
        }
      }
    }
  };

  /* sort the list */
  window.onload = $scope.sortList();

  /* go to the home page*/
  $scope.onClick = function() {
    $ionicViewSwitcher.nextDirection('exit');
    $state.go("home");
  }
});
