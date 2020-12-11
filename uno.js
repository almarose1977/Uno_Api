"use strict";

// $(document).ready(function () {
//     $('#body').css('min-height', screen.height);
//     // jQuery methods go here...
// });

// ++++++++++++++++++++++++++ Globale Variablen ++++++++++++++++++++++++++

let gameId;
let topCard;

let aktuellerSpieler;

let spielerNamenArray = [];     // Spielernamen Array erstellen

// Div-Namen der Handkarten der Spieler, um die Handkarten nachher auszuteilen
let handkartenDivNames = [];

// Dictionary/Map, um die Spielernamen-Divs mit den Spielernamen zu matchen --> drawCard
let dictionary = {};
let dictionaryReverse = {};

//
// ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
// nur für Testzwecke, damit man nicht ständig die Namen eingeben muss
let name1 = "Annie";
let name2 = "Brandi";
let name3 = "Carli";
let name4 = "Debbie";
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
    // let name1 = document.getElementById("player1_id").value;
    // let name2 = document.getElementById("player2_id").value;
    // let name3 = document.getElementById("player3_id").value;
    // let name4 = document.getElementById("player4_id").value;
    // ++++++++++++++++++++++++++ für Testzwecke auskommentiert +++++++++++++++++++++++

    // ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen
    document.getElementById("player1_id").value = name1;
    document.getElementById("player2_id").value = name2;
    document.getElementById("player3_id").value = name3;
    document.getElementById("player4_id").value = name4;
    // ++++++++++++++++++++++++++ für Testzwecke geschrieben +++++++++++++++++++++++ später wieder löschen

    spielerNamenArray.push(name1, name2, name3, name4); // geht auch, anstelle einzeln eingeben

    // Dictionary befüllen
    dictionary[document.getElementById("sf-nord").id] = name1;
    dictionary[document.getElementById("sf-ost").id] = name2;
    dictionary[document.getElementById("sf-sued").id] = name3;
    dictionary[document.getElementById("sf-west").id] = name4;

    dictionaryReverse[name1] = document.getElementById("sf-nord").id;
    dictionaryReverse[name2] = document.getElementById("sf-ost").id;
    dictionaryReverse[name3] = document.getElementById("sf-sued").id;
    dictionaryReverse[name4] = document.getElementById("sf-west").id;



    for(let key in dictionary) {
        console.log(key + " : " + dictionary[key]);
     }

     for(let key in dictionaryReverse) {
        console.log(key + " : " + dictionaryReverse[key]);
     }


    // Handkarten-DIV-Namen (sf-nord, sf-ost, sf-sued, sf-west)
    handkartenDivNames.push(document.getElementById("sf-nord").id);
    handkartenDivNames.push(document.getElementById("sf-ost").id);
    handkartenDivNames.push(document.getElementById("sf-sued").id);
    handkartenDivNames.push(document.getElementById("sf-west").id);

    

    // Spielernamen Nord, Ost, Sued, West zuordnen
    document.getElementById("sn-nord").innerText = name1;
    document.getElementById("sn-ost").innerText = name2;
    document.getElementById("sn-sued").innerText = name3;
    document.getElementById("sn-west").innerText = name4;

    // Spielfeld-Aufbau
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

            // ++++++++++++++++++++++++++++++++ StartGameResponse ++++++++++++++++++++++++++++++++++++++++++++++++
            // GameId
            gameId = result.Id;
            console.log("GameId: ", gameId);

            // Aktueller Spieler 
            aktuellerSpieler = result.NextPlayer;       // NextPlayer ist nur der Name (String)
            let p = document.createElement("p");
            p.innerText = aktuellerSpieler;
            document.getElementById("activePlayer").appendChild(p);

            // STARTKARTE 
            topCard = result.TopCard;           // Objekt: Color (String), Text (String), Value (enum), Score (int)

            let startkarte = document.getElementById("sf-mitte_ablagestapel");      // Startkarte dem entsprechenden DIV zuweisen
            let img = new Image();
            img.src = "images/cards/" + topCard.Color + topCard.Value + ".png";
            img.height = 150;
            //img.setAttribute("onclick", "drawCard(this.id)");
            startkarte.appendChild(img);
            startkarte = topCard;

            // SPIELERINNEN 
            Spielerinnen = result.Players;                  // Array aus 4 Player-Objekten: beinhaltet 
            Spielerinnen.Player = result.Players.Player;    // den Spielernamen (.Player),
            Spielerinnen.Cards = result.Players.Cards;      // das Handkarten-Array (.Cards) und
            Spielerinnen.Score = result.Players.Score;      // den Punktestand (.Score)

            // ZUM TESTEN
            console.log("Spielerin 1: ", Spielerinnen[0]);
            console.log("Spielerinnen-Name: ", Spielerinnen[0].Player);
            console.log("Handkarten der Spielerin 1: ", Spielerinnen[0].Score);
            console.log("Spielerinnen: ", Spielerinnen);
            console.log("Karte 1 der Spielerin 2: ", Spielerinnen[1].Cards[0]);

            // Karte.Color = result.Color;
            // Karte.Text = result.Text;
            // Karte.Value = result.Value;
            // Karte.Score = result.Score;

            // die Handkarten aller Spieler austeilen
            for (let i = 0; i < handkartenDivNames.length; i++) {   // jedem Spieler

                for (let j = 0; j < 7; j++) {                       // werden 7 Karten zugeteilt
                    let kartenDiv = document.createElement("div");      // jede Karte wird ein eigenes div
                    kartenDiv.setAttribute("class", "Handkarten_" + handkartenDivNames[i])   // Class Attribut, falls wir es brauchen
                    let img = new Image();                          // jeder Karte wird ein Bild zugewiesen
                    img.src = "images/cards/" + Spielerinnen[i].Cards[j].Color + Spielerinnen[i].Cards[j].Value + ".png";
                    img.height = 90;
                    img.setAttribute("id", "HK_" + handkartenDivNames[i] + j);  // jedes Karten-Image hat eine id
                    img.setAttribute("onclick", "pick_Card(this.id)");    // beim Klick auf die Karte wird die Funktion pick_Card() aufgerufen
                    kartenDiv.appendChild(img);
                    document.getElementById(handkartenDivNames[i]).appendChild(kartenDiv);
                }
            }        

            // SCORE den einzelnen Spielern zuweisen
            for (let i = 0; i < divNamesScore.length; i++) {
                
                let scoreDiv = document.createElement("p");
                scoreDiv.innerText = Spielerinnen[i].Score;

                document.getElementById(divNamesScore[i]).appendChild(scoreDiv);
            }
        } else {
            alert("HTTP-Error: " + response.status);
        }
        $('#playerNames').modal('hide');    // hier schließt sich der Modale Dialog
    }
    spielfeldLaden();
});

// ++++++++++++++++++++++++++++++++++++++++++++++++++ eine Karte vom Nachziehstapel ziehen +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
async function drawCard() {
    // response: {"NextPlayer":"Brandi", "Player":"Annie","Card":{"Color":"Red","Text":"Five","Value":5,"Score":5}}
    // die zurückgegebene Karte wird den Handkarten des aktuellen Spielers hinzugefügt
    // der nächste Spieler ist an der Reihe
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
        let anzahlHandkarten = document.getElementsByClassName("Handkarten_"+ dictionaryReverse[aktuellerSpieler]).length;
        
        let karteNeu = document.createElement("div");      
        karteNeu.setAttribute("class", "Handkarten_" + dictionaryReverse[aktuellerSpieler])   
        let img = new Image();                          
        img.src = "images/cards/" + result.Card.Color + result.Card.Value + ".png";
        img.height = 90;

        img.setAttribute("id", "HK_" + dictionaryReverse[aktuellerSpieler] + (anzahlHandkarten + 1));  // die Id des Image wird gesetzt
        img.setAttribute("onclick", "pick_Card(this.id)");    
        karteNeu.appendChild(img);
        console.log("Was mach ich hier: ", dictionaryReverse[aktuellerSpieler]);
        document.getElementById(dictionaryReverse[aktuellerSpieler]).appendChild(karteNeu);
        
        aktuellerSpieler = result.NextPlayer;
    }

    else {
        alert("HTTP-Error: " + response.status);
    }
};

// eine Karte aus dem Handkarten-Deck auswählen
function pick_Card(card_id) {

    // die angeklickte Karte soll auf den Ablagestapel gelegt werden --> TopCard ändert sich
    // die angeklickte Karte soll aus dem Handkarten-Array entfernt werden

    // console.log(Spielerinnen.Player.Cards(card_id));
    alert("Hello again, gotcha!:)" + card_id);

};

// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ Eine Karte spielen +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// async function play() {

//     document.get
//     zuSpielendeKarte = {       // das ist ein JavaScript Objekt im Json Format
//         id: newGame.id,
//         value: newGame.Card.Value,
//         color: newGame.Card.Color,
//         //wildColor:
//     };

//     let response = await fetch("http://nowaunoweb.azurewebsites.net/api/Game/PlayCard/{id}?value={value}&color={color}&wildColor={wildColor}", {

//         method: 'PUT',
//         body: JSON.stringify(zuSpielendeKarte),
//         headers: {
//             'Content-type': 'application/json; charset=UTF-8'
//         }
//     });
//     if (response.ok) {
//         let result = await response.json();
//         console.log(result);
//     }
//     else {
//         alert("HTTP-Error: " + response.status);
//     }
// }
// play();


