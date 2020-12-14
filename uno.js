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
let punkte;             // Punktestand des Spielers

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

$('#playerNames').modal() // mit diesem aufruf wird der Inhalt des Modalen Dialogs angezeigt

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
//                      Score (Gesamtpunkteanzahl, int)), 
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

        handKarten = getCards();

        for (let i = 0; i < handkartenDivNames.length; i++) {
            createCardImage(i);
        }

        // SCORE den einzelnen Spielern zuweisen
        divNamesScore.push(document.getElementById("score-nord").id);
        divNamesScore.push(document.getElementById("score-ost").id);
        divNamesScore.push(document.getElementById("score-sued").id);
        divNamesScore.push(document.getElementById("score-west").id);

        for (let i = 0; i < divNamesScore.length; i++) {

            punkte = document.createElement("p");
            punkte.id = "punkteId_" + i;
            punkte.innerText = Spielerinnen[i].Score;
            document.getElementById(divNamesScore[i]).appendChild(punkte);
        }
    }
    // if response not ok:
    else {
        alert("HTTP-Error: " + response.status);
    }
    // console.log("handKarten in spielfeldaufbau",handKarten);
    topCard = getTopCard();
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//! Hilfsfunktion, um die Bilder den Karten zuzuweisen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function createCardImage(i) {

    for (let j = 0; j < Spielerinnen[i].Cards.length; j++) {        // die Anzahl der Karten für jede Spielerin kann anders sein (+2 oder +4)

        let kartenDiv = document.createElement("div");              // jede Karte wird zu einem eigenen div
        kartenDiv.setAttribute("class", "Handkarten_" + handkartenDivNames[i])   // Class Attribut, falls wir es brauchen
        kartenDiv.id = handkartenDivNames[i] + j;
        img = document.createElement("img");                                     // jeder Karte wird ein Bild zugewiesen
        img.src = "images/cards/" + Spielerinnen[i].Cards[j].Color + Spielerinnen[i].Cards[j].Value + ".png";
        img.height = 90;
        img.id = handkartenDivNames[i] + j;  // jedes Karten-Image hat eine id
        // console.log("image.id", img.id);
        img.setAttribute("onclick", "playCard(this.id)");    // beim Klick auf die Karte wird die Funktion playCard() aufgerufen
        kartenDiv.appendChild(img);
        document.getElementById(handkartenDivNames[i]).appendChild(kartenDiv);
        // document.getElementById(handkartenDivNames[i]+j).addEventListener("click", playCard()); // todo funktioniert nicht (this ist problem)
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

        // Anzahl der Handkarten des aktuellen Spielers --> brauchen wir, um die Id der Karten erhöhen zu können
        let anzahlHandkarten = document.getElementsByClassName("Handkarten_" + dictionary[aktuellerSpieler]).length;

        let karteNeu = document.createElement("div");
        karteNeu.setAttribute("class", "Handkarten_" + dictionary[aktuellerSpieler])
        let img = document.createElement("img");
        img.src = "images/cards/" + result.Card.Color + result.Card.Value + ".png";
        img.height = 90;

        img.id = dictionary[aktuellerSpieler] + (anzahlHandkarten + 1);
        img.setAttribute("onclick", "playCard(this.id)");
        karteNeu.appendChild(img);
        document.getElementById(dictionary[aktuellerSpieler]).appendChild(karteNeu);

        // Score der Spieler aktualisieren
        spielerIndex = spielerNamenArray.indexOf(aktuellerSpieler);
        punkte = Spielerinnen[spielerIndex].Score;
        Spielerinnen[spielerIndex].Score = punkte + result.Card.Score;
        document.getElementById("punkteId_" + spielerIndex).innerText = String(Spielerinnen[spielerIndex].Score);

        // nächsten Spieler zum aktuellen Spieler machen
        aktuellerSpieler = result.NextPlayer;
        document.getElementById("aktuellerSpielerId").innerText = aktuellerSpieler;
    }

    else {
        alert("Methode drawCards, HTTP-Error: " + response.status);
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !PLAY CARD
// request Info: gameId, Kartenfarbe, Kartenwert und Wildcard --> es wird kein Spieler übergeben!!!!!!!!!! --> muss über die Id der Karten gehen
// response:    Player (der Spieler, der nach dem Spielzug dran ist (wenn Annie die Karte spielt ist der Player Brandi), string), 
//              Cards (Karten des Spielers, CardResponse:   Color (string), Text (textuelle Darstellung Kartenwert, string),
//                                                          Value (enum), Score (int))
//              Score (int, Gesamtpunktzahl aller seiner Handkarten)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function playCard(cardId) {

    // 1. prüfen, ob die Karte, die angeklickt wurde, vom richtigen Spieler kommt --> correctPlayer(cardId)
    // 2. wenn sie vom richtigen Spieler kommt, Farbe und Wert auslesen --> getCardInformation(cardId)
    // 3. überprüfen, ob sie gespielt werden darf --> mit topCard vergleichen --> checkCardWithTopCard(cardId)
    // 4. die gespielte Karte aus den Handkarten entfernen --> deleteCardFromHandDeck(cardId)
    // 5. die Punkte des Spielers reduzieren
    // 6. die gespielte Karte wird zur TopCard --> replaceTopCard();

    console.log("aktuellerSpieler ganz am Anfang der playCard", aktuellerSpieler);
    if (!correctPlayer(cardId)) {                                       // cardId: "nord2" --> 1. Spieler, 3. Karte
        console.log("Falscher Spieler ausgewählt");
    }
    else {
        checkCardWithTopCard(cardId);


        let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId + "?value=" + wert + "&color=" + farbe + "&wildColor=" + wildColor, {
            method: 'PUT',
            contentType: 'application/json'

        });


        if (response.ok) {
            let result = await response.json();
            console.log("Result aus playCard()", result);

            deleteCardFromHandDeck(cardId);
        
            getCards();
            
            replaceTopCard();
            

            // nächsten Spieler zum aktuellen Spieler machen
            aktuellerSpieler = result.Player;
            document.getElementById("aktuellerSpielerId").innerText = aktuellerSpieler;
        
            getCards();     //! hier muss unbedingt nochmal die getCards() aufgerufen werden, damit die Karten vom aktuellen Spieler verwendet werden,
                            //! ansonsten werden immer die Karten vom 1. Spieler verwendet
                            //! wir geben der API ja nix retour, wenn wir eine Änderung an den Handkarten vornehmen
            

        }
        else {
            alert("Methode playCards, HTTP-Error: " + response.status);
        }
    }
    
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ! HILFSFUNKTION deleteCardFromHandDeck(cardId)
// das firstChild des Elements mit der cardId ist das image (<img src="images/cards/Red8.png" height="150" id="nord1" onclick="playCard(this.id)">
// das ParentElement ist: <div class="Handkarten_nord" id="nord1"></div>
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function deleteCardFromHandDeck(cardId) {

    zuloeschendeKarte = document.getElementById(cardId).firstChild;
    // console.log("CardId", cardId);
    // console.log("zulöschende Karte: ", zuloeschendeKarte);
    // console.log("Parent von zulöschendeKarte", zuloeschendeKarte.parentElement);
    zuloeschendeKarte.parentElement.removeChild(zuloeschendeKarte);
    // console.log("akutellerSpieler aus deleteCardFromHandDeck", akutellerSpieler);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// ! HILFSFUNKTION replaceTopCard(cardId)
// lastChild von der id="startkarte", weil davor noch der Text "Ablagestapel" ist
// ich verwende das image aus deleteCardFromHandDeck von oben, um es der "neuen" Topkarte zuzuweisen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function replaceTopCard() {

    let alteStartkarte = document.getElementById("startkarte").lastChild;
    // console.log("alte Startkarte: ", alteStartkarte);
    img = zuloeschendeKarte;
    img.height = 150;                                                               // TopCard ist größer als Handkarte
    // console.log("Image: ", img);
    document.getElementById("startkarte").replaceChild(img, alteStartkarte);

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !CORRECT PLAYER(cardId)
// Hilfsfunktion, um zu prüfen, ob der richtige Spieler eine Karte angeklickt hat:
// aus der cardId (z.b. "nord5") den entsprechenden Spieler (z.B. "Annie") über das Dictionary herauslösen 
// und mit dem aktuellenSpieler vergleichen
// cardId = "nord5" ==> parentElement.id = "nord"
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function correctPlayer(cardId) {    //! die Methode funktioniert, ist richtig

    let nameAusId = document.getElementById(cardId).parentElement.id;

    if (nameAusId == dictionary[aktuellerSpieler]) {                  // aktuellerSpieler = "Annie"
        return true;
    }
    else {
        return false;
    }
}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !HILFSFUNKTION checkCardWithTopCard, um die Farbe und den Wert der zu spielenden Karte mit der TopCard zu vergleichen
// der Vergleich, ob die Karte vom richtigen Spieler kommt, passiert bereits davor in correctPlayer(cardId)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function checkCardWithTopCard(cardId) {

    let farbeTC = topCard.Color;
    let wertTC = topCard.Value;

    getCardInformation(cardId);

    if (farbe == farbeTC || wert == wertTC) {
        console.log("Farbe oder Wert passt");
        // console.log("Farbe der Karte", farbe);
        // console.log("Wert der Karte", wert);
    }
    else {
        console.log("Farbe oder Wert passen nicht");
        console.log("Farbe der Karte", farbe);
        console.log("Wert der Karte", wert);
    }

}

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// !Hilfsfunktion GETCARDINFORMATION, um über die mitgegebene Karten-Id den Index der Karte im Handkarten-Array zu ermitteln,
// dann kann ich auf die Farbe und den Wert zugreifen (Handkarten-Array ist die komplette CardResponse)
// z.B. cardId = "nord2" (also die 3. Karte im HandkartenArray des Spielers nord), 
// ich brauche den Index aus dem HandkartenArray, was der "2" aus "nord2" entspricht
// also benötige ich das letzte Zeichen der cardId
// cardId.length = 5, cardId.length-1 = 4 ==> das ist die Index-Stelle
// jeder Buchstabe hat einen Index --> 0:'n', 1:'o', 2:'r', 3:'d', 4:'2' 
// .charAt(cardId.length-1) ==> kartenIndex = 2 
// da nicht alle cardId-Strings der einzelnen Spieler gleich groß sind (z.B. "ost2" hat nur eine Länge von 4) kann ich keinen
// fixen Index angeben (z.B. .charAt(4) würde für "ost2" nicht funktionieren)
// mit diesem Index kann ich dann die Handkarte im Array bestimmen und davon die Farbe und den Wert
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
function getCardInformation(cardId) {

    let kartenIndex = cardId.charAt(cardId.length - 1);     
    console.log("kartenIndex", kartenIndex);
    // console.log("CardId", cardId);
    console.log("handkarten in getCardInformation", handKarten);
    farbe = handKarten[kartenIndex].Color;
    wert = handKarten[kartenIndex].Value;
    wildColor = handKarten[kartenIndex].Value;
    //todo: wenn eine Karte aus dem HK-Array bereits gespielt wurde, verringert sich die Größe des Arrays, 
    //todo: damit wird die falsche Karte ausgespielt
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
        console.log(result);

        topCard = result;
        //return topCard;
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

        handKarten = result.Cards;
    }
    else {
        alert("Methode getCards, HTTP-Error: " + response.status);
    }
};

