"use strict";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Globale Variablen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let gameId;         // Id des aktuellen Spiels
let topCard;        // die oberste Karte am Ablegestapel - komplette CardResponse
let farbe;          // Farbe der ausgewählten Karte
let wert;           // Wert der Karte
let wildColor;       // 
let img;

let aktuellerSpieler;   // Name des aktuellen Spielers
let spielerPunkte;             // Punktestand des Spielers

let spielerNamenArray = [];     // Spielernamen Array erstellen
let spielerIndex;

let Spielerinnen;               // = result.Players

let handKarten;         // komplette CardResponse
let zuloeschendeKarte;

// Div-Namen der Handkarten der Spieler, um die Handkarten nachher auszuteilen
let handkartenDivNames = [];

// Dictionary/Map, um die Spielernamen-Divs mit den Spielernamen zu matchen --> drawCard: hier hab ich nur die Spielernamen zur Verfügung, brauch aber die entsprechende Id dazu
let dictionary = {};    // String/ String

let dictionaryIdName = {}; // um aus der KartenId zum Spielernamen zu kommen

// Array der Spieler-Namen-Divs --> um den Score zuzuweisen
let divNamesScore = [];

let getCardsResponse;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
// nur für Testzwecke, damit man nicht ständig die Namen eingeben muss
let name1 = "Annie";
let name2 = "Brandi";
let name3 = "Charly";
let name4 = "Debbie";
// ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !AUFRUF des Modalen Dialogs zur Spielereingabe
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

$('#playerNames').modal(); // mit diesem aufruf wird der Inhalt des Modalen Dialogs angezeigt

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {

    evt.preventDefault(); // verhindert das Abschicken des post requests vom submit und damit das neuladen der seite (wollen nicht, dass beim uno die seite neu geladen wird)
    // hier kommt der code hin, der anstelle des post requests passieren soll


    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // ++++++++++++++++++++++++++ für Testzwecke auskommentiert - fürs Spiel wieder einkommentieren +++++++++++++++++++++++
    // let name1 = document.getElementById("player1_id").value.toUpperCase();
    // let name2 = document.getElementById("player2_id").value.toUpperCase();
    // let name3 = document.getElementById("player3_id").value.toUpperCase();
    // let name4 = document.getElementById("player4_id").value.toUpperCase();

    // ++++++++++++++++++++++++++ für Testzwecke auskommentiert - fürs Spiel wieder einkommentieren +++++++++++++++++++++++

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
    document.getElementById("player1_id").value = name1;
    document.getElementById("player2_id").value = name2;
    document.getElementById("player3_id").value = name3;
    document.getElementById("player4_id").value = name4;
    // ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Spielernamen Vergleich
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    spielerNamenArray.push(name1, name2, name3, name4);

    let checkedSpielerArray = spielerNamenArray.filter(function (name, index, array) {
        return index === array.indexOf(name);
    })
    if (checkedSpielerArray.length < 4) {
        alert("Bitte gib 4 eindeutige Namen ein! Danke! :)")
    }
    else {

        spielerNamenArray = checkedSpielerArray;        // der Variablen spielerNamenArray den Inhalt des checkSpielerArray zuweisen, bei falscheingaben wäre das sNA sonst viel größer

        // Dictionary befüllen: name wird der div.id zugewiesen     // Key : value ( ich geb den key an und krieg den value retour)
        dictionary[name1] = document.getElementById("nord").id;     // Annie : nord
        dictionary[name2] = document.getElementById("ost").id;      // Brandi : ost
        dictionary[name3] = document.getElementById("sued").id;
        dictionary[name4] = document.getElementById("west").id;

        dictionaryIdName[document.getElementById("nord").id] = name1;   // nord : Annie
        dictionaryIdName[document.getElementById("ost").id] = name2;    // ost : Brandi
        dictionaryIdName[document.getElementById("sued").id] = name3;
        dictionaryIdName[document.getElementById("west").id] = name4;

        // Spielernamen den entsprechenden sn-Elementen zuweisen
        document.getElementById("sn-nord").innerText = name1;
        document.getElementById("sn-ost").innerText = name2;
        document.getElementById("sn-sued").innerText = name3;
        document.getElementById("sn-west").innerText = name4;

        $('#playerNames').modal('hide');    // hier schließt sich der Modale Dialog

        spielfeldLaden();           // AUFRUF der spielfeldLaden Funktion
    }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ENDE des Modalen Dialogs zur Spielereingabe
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !SPIELFELD-AUFBAU --> START
// Body Parameters: die Namen der 4 Spieler (Collection of string)
// response:    Id (Spiel-Id), 
//              Players (Collection of PlayerResponse: 
//                      Player (Spielername, string), 
//                      Cards (Handkarten des Spielers, CardResponse), 
//                      Score (Gesamtpunkteanzahl des Spielers, int)), 
//              NextPlayer (Spielername, string), 
//              TopCard (CardResponse: Color (string), Text (textuelle Darstellung Kartenwert, string),Value (enum), Score (int))
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function spielfeldLaden() {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start", {
        method: 'POST',
        body: JSON.stringify(spielerNamenArray),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);

        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        // Zuweisung der Response
        // ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        gameId = result.Id;

        // SPIELERINNEN 
        Spielerinnen = result.Players;

        // AKTUELLER SPIELER
        aktuellerSpieler = result.NextPlayer;
        let p = document.createElement("p");
        p.innerText = aktuellerSpieler;
        p.id = "aktuellerSpielerId";
        document.getElementById("activePlayer").appendChild(p);

        // STARTKARTE 
        topCard = result.TopCard;
        img = document.createElement("img");
        img.src = "images/cards/" + topCard.Color + topCard.Value + ".png";
        img.id = "startkartenImage";
        img.height = 150;
        document.getElementById("startkarte").appendChild(img);

        // HANDKARTEN
        // Handkarten-DIV-Namen (nord, ost, sued, west)
        handkartenDivNames.push(document.getElementById("nord").id);
        handkartenDivNames.push(document.getElementById("ost").id);
        handkartenDivNames.push(document.getElementById("sued").id);
        handkartenDivNames.push(document.getElementById("west").id);

        for (let i = 0; i < handkartenDivNames.length; i++) {
            createFirstHandCards(i);
        }

        // SCORE den einzelnen Spielern zuweisen
        playerScore();
    }
    // if response not ok:
    else {
        alert("HTTP-Error: " + response.status);
    }

    // topCard = getTopCard();
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Hilfsfunktion, um die Karten zu Beginn des Spiels zu erzeugen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function createFirstHandCards(spielerIndex) {

    for (let j = 0; j < Spielerinnen[spielerIndex].Cards.length; j++) {        // die Anzahl der Karten für jede Spielerin kann anders sein (+2 oder +4)
        let kartenFarbe = Spielerinnen[spielerIndex].Cards[j].Color;
        let kartenWert = Spielerinnen[spielerIndex].Cards[j].Value;

        createCardImage(spielerIndex, j, kartenFarbe, kartenWert);
    }
}
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Hilfsfunktion, um die Bilder den Karten zuzuweisen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function createCardImage(spielerIndex, j, kartenFarbe, kartenWert) {

    let kartenDiv = document.createElement("div");
    kartenDiv.setAttribute("class", "Handkarten_" + handkartenDivNames[spielerIndex])   // Class Attribut, falls wir es brauchen
    kartenDiv.id = handkartenDivNames[spielerIndex] + j;
    img = document.createElement("img");
    img.src = "images/cards/" + kartenFarbe + kartenWert + ".png";
    img.height = 90;
    img.id = handkartenDivNames[spielerIndex] + j;
    img.setAttribute("onclick", "chooseCard(this.id)");
    kartenDiv.appendChild(img);
    document.getElementById(handkartenDivNames[spielerIndex]).appendChild(kartenDiv);
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Hilfsfunktion, um den Spielern ihren Punktestand zuzuweisen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function playerScore() {

    divNamesScore.push(document.getElementById("score-nord").id);
    divNamesScore.push(document.getElementById("score-ost").id);
    divNamesScore.push(document.getElementById("score-sued").id);
    divNamesScore.push(document.getElementById("score-west").id);

    for (let i = 0; i < divNamesScore.length; i++) {
        spielerPunkte = document.createElement("p");
        spielerPunkte.id = "spielerPunkteId_" + i;
        spielerPunkte.innerText = Spielerinnen[i].Score;
        document.getElementById(divNamesScore[i]).appendChild(spielerPunkte);
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !DRAW CARD: eine Karte vom Nachziehstapel ziehen 
// response:    NextPlayer (der Spielername, der als nächstes an der Reihe ist, string), 
//              Player (der Spielername, für den eine Karte abgehoben wurde, string),
//              Card (abgehobene Karte, CardResponse:   Color (string), Text (textuelle Darstellung Kartenwert, string),
//                                                      Value (enum), Score (int))
// die zurückgegebene Karte wird den Handkarten des aktuellen Spielers hinzugefügt, der Score wird erhöht
// der nächste Spieler ist an der Reihe
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function drawCard() {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/drawCard/" + gameId, {
        method: 'PUT',
        contentType: 'application/json',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        aktuellerSpieler = result.Player;

        let karte = result.Card;
        console.log("neue Karte", karte);

        spielerIndex = spielerNamenArray.indexOf(aktuellerSpieler);

        deleteAllCardsInHandDeck(aktuellerSpieler);

        createCardsAfterDelete(spielerIndex);

        // Score der Spieler aktualisieren
        updateScore();

        // nächsten Spieler zum aktuellen Spieler machen
        aktuellerSpieler = result.NextPlayer;
        document.getElementById("aktuellerSpielerId").innerText = aktuellerSpieler;
    }

    else {
        alert("Methode drawCards, HTTP-Error: " + response.status);
    }
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! ChooseCard: Farbe + Wert der angeklickten Karte bestimmen und gewünschte Wildcolor definieren
// 1. prüfen, ob die Karte, die angeklickt wurde, vom richtigen Spieler kommt --> correctPlayer(cardId)
// 2. wenn sie vom richtigen Spieler kommt, Farbe und Wert auslesen --> getCardInformation(cardId)
// 3. prüfen, ob es eine schwarze Karte ist
// 3. überprüfen, ob sie gespielt werden darf --> mit topCard vergleichen 
// 4. Karte ausspielen --> playCard(cardId)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function chooseCard(cardId) {

    console.log("0. chooseCard - Topcard: ", topCard);
    if (!correctPlayer(cardId)) {                                       // cardId: "nord2" --> 1. Spieler, 3. Karte
        alert("Falscher Spieler ausgewählt");     //? alert, Animation, etc.
        console.log("aktueller Spieler", aktuellerSpieler);
    }
    else {      //! wenn's der richtige Spieler ist

        let cardInformation = await getCardInformation(cardId);
        farbe = cardInformation[0];
        wert = cardInformation[1]; // Farbe und Wert der angeklickten Karte werden ausgelesen
        console.log("1. chooseCard - Farbe und Wert aus cardInformation: ", farbe, wert);
        console.log("2. chooseCard - cardId: ", cardId);
        console.log("3. chooseCard - Handkarten: ", handKarten);


        if (farbe == "Black") {
            let counter = 0;
            for (let i = 0; i < handKarten.length; i++) {
                if (handKarten[i].Color == topCard.Color) {
                    counter++;
                }
            }
            if (wert == 13 && counter > 0) {
                console.log("4. chooseCard - Anzahl HK mit passender Farbe: ", topCard.Color, counter);
                alert("Die +4 Karte darf nicht gespielt werden, da es noch eine passende Farbkarte in den Handkarten gibt!"); //? Hier wäre eine Möglichkeit, eine Animation zu machen, z.B. die Karte "schütteln", Sound abspielen, etc.
            }
            else {
                wildColor = await modalDialogChooseColor();
                setTimeout(alertFunc, 5000);
                function alertFunc() {
                    console.log("2. WildColor aus ModDia:", wildColor);
                    playCard(cardId);
                };
            }
        }

        // Wenns eine normale Karte ist, Vergleich mit TopCard (wenn die Farbe oder der Wert passt)
        else if (farbe == topCard.Color || wert == topCard.Value) {
            
            console.log("5. chooseCard - topCard für Farbvergleich: ", topCard);
                setTimeout(ausprobieren, 1000);
                function ausprobieren() {
                    console.log("6. chooseCard - Farbe oder Wert passt");
                    wildColor = "";
                    playCard(cardId);
                };
            }

        else {
            console.log("6. chooseCard - farbe und wert der nicht passenden Karte: ", farbe, wert)
            alert("Falsche Karte ausgewählt!")  //? Hier wäre eine Möglichkeit, eine Animation zu machen, z.B. die Karte "schütteln", Sound abspielen, etc.
        }
    }
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !PLAY CARD
// request Info: gameId, Kartenfarbe, Kartenwert und Wildcard --> es wird kein Spieler übergeben!!!!!!!!!! --> muss über die Id der Karten gehen
// response:    Player (der Spieler, der nach dem Spielzug dran ist (wenn Annie die Karte spielt ist der Player Brandi), string), 
//              Cards (Karten des Spielers, der als nächstes dran ist, CardResponse:   Color (string), Text (textuelle Darstellung Kartenwert, string),
//                                                          Value (enum), Score (int))
//              Score (int, Gesamtpunktzahl aller seiner Handkarten)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// 1. die gespielte Karte wird zur TopCard --> replaceTopCard() oder oder die gewünschte Karte --> wildCardAsTopCard()
// 2. die restlichen Handkarten-Elemnte löschen --> deleteAllCardsInHandDeck(aktuellerSpieler)
// 3. die "neuen" HK ohne die gespielte Karte wieder aufbauen lassen --> createCardsAfterDelete(spielerIndex)
// 4. die spielerPunkte des Spielers reduzieren --> updateScore()
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function playCard(cardId) {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId + "?value=" + wert + "&color=" + farbe + "&wildColor=" + wildColor, {
        method: 'PUT',
        contentType: 'application/json'

    });
    if (response.ok) {
        let result = await response.json();

        console.log("1. playCard - Wert ", wert);
        spielerIndex = spielerNamenArray.indexOf(aktuellerSpieler);
        console.log("2. playCard - spielerindex", spielerIndex);
        console.log("3. playCard - aktueller Spieler", aktuellerSpieler);
        
        if (wert == 13 || wert == 14) {
            console.log("4. playCard - Farbe = wildColor: ", farbe);
            wildCardAsTopCard(cardId);
        }
        else {
            replaceTopCard(cardId);
        }
        deleteAllCardsInHandDeck(aktuellerSpieler);
        // console.log("4. playCard - nach deleteAllCardsInHandDeck: Handkarten: ", handKarten);
        createCardsAfterDelete(spielerIndex);
        // console.log("5. playCard - nach createCardsAfterDelete: Handkarten: ", handKarten);
        updateScore();

        aktuellerSpieler = result.Player;
        document.getElementById("aktuellerSpielerId").innerText = aktuellerSpieler;
        topCard = await getTopCard();
        console.log("6. playCard - TopCard: ", topCard);
    }
    else {
        alert("Methode chooseCards, HTTP-Error: " + response.status);
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Modaler Dialog zur Bestimmung der gewünschten Karte nach dem berechtigten Spielen einer schwarzen Sonderkarte
// Festlegung von wildColor
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function modalDialogChooseColor() {
    $('#wildColor').modal();

    document.addEventListener('click', function (evt) {

        evt.preventDefault();
        if (evt.target.id == "rot") {
            playRed();
        }
        else if (evt.target.id === "blau") {
            playBlue();
        }
        else if (evt.target.id === "gruen") {
            playGreen();
        }
        else if (evt.target.id === "gelb") {
            playYellow();
        }

        $('#wildColor').modal('hide');
    })

    function playRed() {
        console.log("es wurde ROT gespielt");
        wildColor = "Red";
        console.log("wildColor im ModDiag:", wildColor);

    }
    function playYellow() {
        console.log("GELB wird gewünscht");
        wildColor = "Yellow";
    }
    function playBlue() {
        console.log("BLAU hab ich mir ausgesucht");
        wildColor = "Blue";
    }
    function playGreen() {
        console.log("Grün ist die Farbe der Wahl!");
        wildColor = "Green";
    }
    return wildColor;
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !CORRECT PLAYER(cardId)
// Hilfsfunktion, um zu prüfen, ob der richtige Spieler eine Karte angeklickt hat:
// aus der cardId (z.b. "nord5") den entsprechenden Spieler (z.B. "Annie") über das Dictionary herauslösen 
// und mit dem aktuellenSpieler vergleichen
// cardId = "nord5" ==> parentElement.id = "nord"
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function correctPlayer(cardId) {

    let nameAusId = document.getElementById(cardId).parentElement.id;

    if (nameAusId == dictionary[aktuellerSpieler]) {
        console.log(nameAusId, " ist richtig");                 // aktuellerSpieler = "Annie"
        return true;
    }
    else {
        console.log(nameAusId, " ist falsch");
        return false;
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !Hilfsfunktion GETCARDINFORMATION, um die Farbe und den Wert der angeklickten Karte zu ermitteln:
//!über die mitgegebene Karten-Id wird der Index der Karte im Handkarten-Array ermittelt,
// dann kann ich auf die Farbe und den Wert zugreifen (Handkarten-Array ist die komplette CardResponse)
// z.B. cardId = "nord2" (also die 3. Karte im HandkartenArray des Spielers nord), 
// ich brauche den Index aus dem HandkartenArray, was der "2" aus "nord2" entspricht
// also benötige ich das letzte Zeichen der cardId
// cardId.length = 5, cardId.length-1 = 4 ==> das ist die Index-Stelle
// jeder Buchstabe hat einen Index --> 0:'n', 1:'o', 2:'r', 3:'d', 4:'2' 
// .charAt(cardId.length-1) ==> kartenIndex = 2 
// da nicht alle cardId-Strings der einzelnen Spieler gleich groß sind (z.B. "ost2" hat nur eine Länge von 4) kann ich keinen
// fixen Index angeben (z.B. .charAt(4) würde für "ost2" nicht funktionieren)
//! mit diesem Index kann ich dann die Handkarte im Array bestimmen und davon die Farbe und den Wert
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function getCardInformation(cardId) {

    getCardsResponse = await getCards();
    handKarten = getCardsResponse.Cards;
    let kartenIndex = cardId.charAt(cardId.length - 1);
    farbe = handKarten[kartenIndex].Color;
    wert = handKarten[kartenIndex].Value;
    return [farbe, wert];
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Warum werden die Handkarten nach dem Ziehen einer neuen Karte gelöscht und wiederaufgebaut:
// ich wollte jede hinzugekommene Karte aus der drawCard() einfach an das letzte Div des Spielers anhängen mit einem
// fortlaufenden Index (nach nord6 kommt nord7).
// Allerdings schicken wir diese Info nicht an den Server retour. Um die aktuellen Handkarten des Spielers zu erhalten,
// muss die getCards() aufgerufen werden. Hier ist die gezogene Karte jedoch in den Handkarten nach Farbreihenfolge 
// rot, gelb, grün, blau, scharz und aufsteigend nach Kartenwert einsortiert. 
// Deshalb ist der Index der Karte ein anderer als die Id des Karten-Images!!!!!!
// Lösung: die Handkarten werden zuerst komplett gelöscht und dann mit der aktuellen Kartenhand wieder aufgebaut!
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ! HILFSFUNKTION removeSelectedCardFromHandDeck(cardId)
// das firstChild des Elements mit der cardId ist das image (<img src="images/cards/Red8.png" height="150" id="nord1" onclick="checkCard(this.id)">
// das ParentElement ist: <div class="Handkarten_nord" id="nord1"></div>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function removeSelectedCardFromHandDeck(cardId) {

    let parentElement = document.getElementById(cardId);
    // console.log("1. ParentElement", parentElement);
    zuloeschendeKarte = document.getElementById(cardId).firstChild;
    zuloeschendeKarte.parentElement.removeChild(zuloeschendeKarte);
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ! HILFSFUNKTION replaceTopCard(cardId)
// lastChild von der id="startkarte", weil davor noch der Text "Ablagestapel" ist
// ich verwende das image aus removeSelectedCardFromHandDeck, um es der "neuen" Topkarte zuzuweisen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function replaceTopCard(cardId) {

    removeSelectedCardFromHandDeck(cardId);

    let alteStartkarte = document.getElementById("startkarte").lastChild;
    img = zuloeschendeKarte;
    img.height = 150;                                                               // TopCard ist größer als Handkarte
    document.getElementById("startkarte").replaceChild(img, alteStartkarte);
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ! HILFSFUNKTION wildCardAsTopCard(cardId)
//? die mitgegebene gewünschte farbe wird zur TopCard
//? Topcard muss mit der bestimmten Farbwahlkarte ersetzt werden ("wild_b, wild_g, wild_r, wild_y")
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function wildCardAsTopCard(cardId) {

    removeSelectedCardFromHandDeck(cardId);

    let alteStartkarte = document.getElementById("startkarte").lastChild;
    img = document.createElement("img");
    img.src = "images/cards/" + wildColor + wert + ".png"
    img.height = 150;
    document.getElementById("startkarte").replaceChild(img, alteStartkarte);
    // topCard.Color = farbe;
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Hilfsfunktion, um die kompletten Handkarten zu löschen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function deleteAllCardsInHandDeck(aktuellerSpieler) {

    let HKzuLoeschen = document.getElementById(dictionary[aktuellerSpieler]);
    while (HKzuLoeschen.firstChild) {
        HKzuLoeschen.removeChild(HKzuLoeschen.firstChild);
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Hilfsfunktion, um die Karten nach dem Löschen wieder aufbauen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function createCardsAfterDelete(spielerIndex) {
    getCardsResponse = await getCards();
    handKarten = getCardsResponse.Cards;    //

    console.log("1. createCardsAfterDelete, HandKarten: ", handKarten);


    for (let j = 0; j < handKarten.length; j++) {
        let kartenFarbe = handKarten[j].Color;
        let kartenWert = handKarten[j].Value;

        createCardImage(spielerIndex, j, kartenFarbe, kartenWert);
    }
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Funktion, um Punkte der Kartnhand zu aktualisieren
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function updateScore() {

    getCardsResponse = await getCards();
    spielerPunkte = getCardsResponse.Score;
    // console.log("Spielerpunkte: ", spielerPunkte);
    document.getElementById("spielerPunkteId_" + spielerIndex).innerText = String(spielerPunkte);
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !GET TOPCARD
// requested: gameId
// response: CardResponse: Color (string), Text (string), Value (enum), Score (int)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function getTopCard() {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/TopCard/" + gameId, {
        method: 'GET',
        contentType: 'application/json'

    });

    if (response.ok) {
        let result = await response.json();

        if(result.Value == 13 || result.Value == 14){
            result.Color = wildColor;
        }
        return result;
    }
    else {
        alert("Methode getTopCard, HTTP-Error: " + response.status);
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !GETCARDS - um die Handkarten des aktuellen Spielers zu erhalten
// requested: gameId, playerName (string)
// response:    Player (der Spieler, der nun an der Reihe ist, string), 
//              Cards (Karten des Spielers, CardResponse:   Color (string), Text (textuelle Darstellung Kartenwert, string),
//                                                          Value (enum), Score (int))
//              Score (Gesamtpunktzahl aller seiner Handkarten, int)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function getCards() {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/GetCards/" + gameId + "?playerName=" + aktuellerSpieler, {
        method: 'GET',
        contentType: 'application/json'

    });

    if (response.ok) {
        let result = await response.json();
        // console.log("getCardsResponse", result);
        return result;
    }
    else {
        alert("Methode getCards, HTTP-Error: " + response.status);
    }
};