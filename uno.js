"use strict";

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Globale Variablen
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

let gameId;         // Id des aktuellen Spiels
let topCard;        // die oberste Karte am Ablegestapel
let color;          // Farbe der ausgewählten Karte
let value;          // Wert der Karte

let aktuellerSpieler;   // Name des aktuellen Spielers
let punkte;             // Punktestand des Spielers

let spielerNamenArray = [];     // Spielernamen Array erstellen
let spielerIndex;
let mitspieler = [];

// Div-Namen der Handkarten der Spieler, um die Handkarten nachher auszuteilen
let handkartenDivNames = [];

// Dictionary/Map, um die Spielernamen-Divs mit den Spielernamen zu matchen --> drawCard: hier hab ich nur die Spielernamen zur Verfügung, brauch aber die entsprechende Id dazu
let dictionary = {};

//
// ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
// nur für Testzwecke, damit man nicht ständig die Namen eingeben muss
// let name1 = "Annie";
// let name2 = "Brandi";
// let name3 = "Annie";
// let name4 = "Debbie";
// ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
//


// Array der Spieler-Namen-Divs --> um den Score zuzuweisen
let divNamesScore = [];
divNamesScore.push(document.getElementById("score-nord").id);
divNamesScore.push(document.getElementById("score-ost").id);
divNamesScore.push(document.getElementById("score-sued").id);
divNamesScore.push(document.getElementById("score-west").id);


// Objekt Spielerin
let Spielerinnen = {};

// Objekt Karte
let Karte = {};


$('#playerNames').modal() // mit diesem aufruf wird der Inhalt des Modalen Dialogs angezeigt

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {

    evt.preventDefault(); // verhindert das Abschicken des post requests vom submit und damit das neuladen der seite (wollen nicht, dass beim uno die seite neu geladen wird)
    // hier kommt der code hin, der anstelle des post requests passieren soll
    // die eingegebenen namen müssen in ein string array gespeichert werden, das ich dann der POST api/Game/Start übergeben


    // ++++++++++++++++++++++++++ für Testzwecke auskommentiert +++++++++++++++++++++++
    let name1 = document.getElementById("player1_id").value;
    let name2 = document.getElementById("player2_id").value;
    let name3 = document.getElementById("player3_id").value;
    let name4 = document.getElementById("player4_id").value;
    // ++++++++++++++++++++++++++ für Testzwecke auskommentiert +++++++++++++++++++++++

    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
    // document.getElementById("player1_id").value = name1;
    // document.getElementById("player2_id").value = name2;
    // document.getElementById("player3_id").value = name3;
    // document.getElementById("player4_id").value = name4;
    // ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
    // +++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~++
    // Spielernamen Vergleich
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~++

    spielerNamenArray.push(name1, name2, name3, name4);

    let checkedSpielerArray = spielerNamenArray.filter(function (name, index, array) {
        return index === array.indexOf(name);
    })
    if (checkedSpielerArray.length < 4) {
        console.log(checkedSpielerArray)
        alert("Bitte gib 4 eindeutige Namen ein! Danke! :)")
    }
    else {

        
        // Dictionary befüllen: name wird der div.id zugewiesen
        dictionary[name1] = document.getElementById("sf-nord").id;
        dictionary[name2] = document.getElementById("sf-ost").id;
        dictionary[name3] = document.getElementById("sf-sued").id;
        dictionary[name4] = document.getElementById("sf-west").id;


        // Handkarten-DIV-Namen (sf-nord, sf-ost, sf-sued, sf-west)
        handkartenDivNames.push(document.getElementById("sf-nord").id);
        handkartenDivNames.push(document.getElementById("sf-ost").id);
        handkartenDivNames.push(document.getElementById("sf-sued").id);
        handkartenDivNames.push(document.getElementById("sf-west").id);

        // Spielernamen den entsprechenden sn-Elementen zuweisen
        document.getElementById("sn-nord").innerText = name1;
        document.getElementById("sn-ost").innerText = name2;
        document.getElementById("sn-sued").innerText = name3;
        document.getElementById("sn-west").innerText = name4;

        $('#playerNames').modal('hide');    // hier schließt sich der Modale Dialog
        spielfeldLaden();
    }
});


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// SPIELFELD-AUFBAU --> START
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

        // AKTUELLER SPIELER
        aktuellerSpieler = result.NextPlayer;
        let p = document.createElement("p");
        p.innerText = aktuellerSpieler;
        p.id = "aktuellerSpielerId";
        document.getElementById("activePlayer").appendChild(p);

        // STARTKARTE 
        // let topcard = result.TopCard.Color + result.TopCard.Value;
        // console.log("topcard", topcard);
        topCard = result.TopCard;
        let startkarte = document.getElementById("sf-mitte_ablagestapel");      // Startkarte dem entsprechenden DIV zuweisen
        let img = new Image();
        img.src = "images/cards/" + topCard.Color + topCard.Value + ".png";
        img.height = 150;
        startkarte.appendChild(img);
        startkarte = topCard;

        // SPIELERINNEN 
        Spielerinnen = result.Players;

        mitspieler.push(Spielerinnen[0], Spielerinnen[1], Spielerinnen[2], Spielerinnen[3]);

        // ZUM TESTEN
        console.log("Mitspieler: ", mitspieler);
        // console.log("Spielerin 1: ", Spielerinnen[0]);
        // console.log("Spielerinnen-Name: ", Spielerinnen[0].Player);
        // console.log("Handkarten der Spielerin 1: ", Spielerinnen[0].Score);
        // console.log("Spielerinnen: ", Spielerinnen);
        // console.log("Karte 1 der Spielerin 2: ", Spielerinnen[1].Cards[0]);

        // Karte.Color = result.Color;
        // Karte.Text = result.Text;
        // Karte.Value = result.Value;
        // Karte.Score = result.Score;

        // die Handkarten aller Spieler austeilen
        for (let i = 0; i < handkartenDivNames.length; i++) {               // jedem Spieler

            for (let j = 0; j < 7; j++) {                                   // werden 7 Karten zugeteilt
                let kartenDiv = document.createElement("div");              // jede Karte wird zu einem eigenen div
                kartenDiv.setAttribute("class", "Handkarten_" + handkartenDivNames[i])   // Class Attribut, falls wir es brauchen
                kartenDiv.id = "HK_Div_" + handkartenDivNames[i] + j;
                //kartenDiv.setAttribute("onclick", "getId(this.id)");
                let img = new Image();                                      // jeder Karte wird ein Bild zugewiesen
                img.src = "images/cards/" + Spielerinnen[i].Cards[j].Color + Spielerinnen[i].Cards[j].Value + ".png";
                img.height = 90;
                img.setAttribute("id", "HK_" + handkartenDivNames[i] + j);  // jedes Karten-Image hat eine id
                img.setAttribute("onclick", "playCard()");    // beim Klick auf die Karte wird die Funktion playCard() aufgerufen
                kartenDiv.appendChild(img);
                document.getElementById(handkartenDivNames[i]).appendChild(kartenDiv);
            }
        }

        // SCORE den einzelnen Spielern zuweisen
        for (let i = 0; i < divNamesScore.length; i++) {

            punkte = document.createElement("p");
            punkte.id = "punkteId_" + i;
            punkte.innerText = Spielerinnen[i].Score;
            document.getElementById(divNamesScore[i]).appendChild(punkte);
        }
    } else {
        alert("HTTP-Error: " + response.status);
    }
};


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// DRAW CARD: eine Karte vom Nachziehstapel ziehen 
// response:    NextPlayer (Spielername, string), 
//              Player (Spielername, string),
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
        let img = new Image();
        img.src = "images/cards/" + result.Card.Color + result.Card.Value + ".png";
        img.height = 90;

        img.setAttribute("id", "HK_" + dictionary[aktuellerSpieler] + (anzahlHandkarten + 1));  // die Id des Image wird gesetzt
        img.setAttribute("onclick", "playCard()");
        karteNeu.appendChild(img);
        document.getElementById(dictionary[aktuellerSpieler]).appendChild(karteNeu);

        // Score der Spieler aktualisieren
        spielerIndex = spielerNamenArray.indexOf(aktuellerSpieler);
        punkte = mitspieler[spielerIndex].Score;
        mitspieler[spielerIndex].Score = punkte + result.Card.Score;
        document.getElementById("punkteId_" + spielerIndex).innerText = String(mitspieler[spielerIndex].Score);

        // nächsten Spieler zum aktuellen Spieler machen
        aktuellerSpieler = result.NextPlayer;
        document.getElementById("aktuellerSpielerId").innerText = aktuellerSpieler;
    }

    else {
        alert("Methode drawCards, HTTP-Error: " + response.status);
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// PLAY CARD
// response:    Player (der Spieler, der nun an der Reihe ist, string), 
//              Cards (Karten des Spielers, CardResponse:   Color (string), Text (textuelle Darstellung Kartenwert, string),
//                                                          Value (enum), Score (int))
//              Score (int, Gesamtpunktzahl aller seiner Handkarten)
// die angeklickte Karte wird mit der TopCard verglichen
// die angeklickte Karte soll auf den Ablagestapel gelegt werden --> TopCard ändert sich
// die angeklickte Karte soll aus dem Handkarten-Array entfernt werden
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
async function playCard() {

    getTopCard();
    getCards();

    let value = "2";
    let color = "red";
    let wildColor = "";

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/playCard/" + gameId + "?value=" + value + "&color=" + color + "&wildColor=" + wildColor, {
        method: 'PUT',
        contentType: 'application/json'

    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);
        aktuellerSpieler = result.Player;
        console.log(aktuellerSpieler);


    }
    else {
        alert("Methode playCards, HTTP-Error: " + response.status);
    }
};

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GET TOPCARD
// requested: gameId
// response: Color (string), Text (string), Value (enum), Score (int)
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

async function getTopCard() {

    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/TopCard/" + gameId, {
        method: 'GET',
        contentType: 'application/json'

    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);

        color = result.Color;
        value = result.Value;

    }
    else {
        alert("Methode getTopCard, HTTP-Error: " + response.status);
    }
};
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// GETCARDS - um die Handkarten des aktuellen Spielers zu erhalten
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
        console.log(result);

        color = result.Color;
        value = result.Value;

    }
    else {
        alert("Methode getCards, HTTP-Error: " + response.status);
    }
};

// von Vali
// function getId(clickedId) {
//     let cardVal = document.getElementById(clickedId);
//     console.log("Die Id vom Div ", clickedId);
//     console.log("Akt. Spieler ", aktuellerSpieler);
//     spielerIndex = spielerNamenArray.indexOf(aktuellerSpieler);
//     console.log("Spielerindex: " , spielerIndex);
//     console.log(cardVal);
//     // check ob von richtiger Kartenhand gespielt:
//     if(spielerIndex == clickedId.charAt(0)){
//         alert(clickedId);
//     } else {
//         alert("Falsche Kartenhand!")
//     }
//}


//da hab ich das in der karte:
//cardDiv.setAttribute("onclick", "getId(this.id)");

