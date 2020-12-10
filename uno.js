$(document).ready(function () {
    $('#body').css('min-height', screen.height);
    // jQuery methods go here...

});

// Globale Variablen
let playersList = [];
let newGame = {};
let startkarte = document.getElementById("sf-mitte_ablagestapel");
// Array der Spieler-Namen-Divs --> um den Score zuzuweisen
let spielerDivNames = [];
spielerDivNames.push(document.getElementById("ctn-nord").id);
spielerDivNames.push(document.getElementById("ctn-ost").id);
spielerDivNames.push(document.getElementById("ctn-sued").id);
spielerDivNames.push(document.getElementById("ctn-west").id);

// Aktiver Spieler
let aktiverSpieler = document.createElement("p");

// Modalen Dialog öffnen um Namen einzugeben
$('#playerNames').modal() // mit diesem aufruf wird der inhalt des obigen html angezeigt

document.getElementById('playerNamesForm').addEventListener('submit', function (evt) {
    // Formular absenden verhindern
    console.log("submit");
    evt.preventDefault(); // verhindert das Abschicken des post requests vom submit und damit das neuladen der seite (wollen nicht, dass beim uno die seite neu geladen wird), dann weiter mit ajax...
    // hier kommt der code hin, der anstelle des post requests passieren soll

    // die eingegebenen namen müssen in ein string array gespeichert werden, das ich dann der POST api/Game/Start übergeben

    // Player Array erstellen

    let name1 = document.getElementById("player1_id").value;
    let name2 = document.getElementById("player2_id").value;
    let name3 = document.getElementById("player3_id").value;
    let name4 = document.getElementById("player4_id").value;
    playersList.push(name1);
    playersList.push(name2);
    playersList.push(name3);
    playersList.push(name4);

    // Div-Namen der Handkarten der Spieler, um die Handkarten nachher auszuteilen
    let handkartenDivNames = []
    handkartenDivNames.push(document.getElementById("sf-nord").id);
    handkartenDivNames.push(document.getElementById("sf-ost").id);
    handkartenDivNames.push(document.getElementById("sf-sued").id);
    handkartenDivNames.push(document.getElementById("sf-west").id);

    // Spielernamen Nord, Ost, Sued, West zuordnen
    let s1 = document.getElementById("sn-nord");
    s1.innerText = name1;
    document.getElementById("sn-ost").innerText = name2;
    document.getElementById("sn-sued").innerText = name3;
    document.getElementById("sn-west").innerText = name4;

    // Spielfeld-Aufbau
    async function spielfeldLaden() {

        let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start", {
            method: 'POST',
            body: JSON.stringify(playersList),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            }
        });

        if (response.ok) {
            let result = await response.json();
            console.log(result);

            // StartGameResponse
            newGame.Id = result.Id;
            newGame.Players = result.Players;
            newGame.NextPlayer = result.NextPlayer;
            newGame.TopCard = result.TopCard;

            let Players = {};
            Players.Player = result.Players.Player;
            Players.Cards = result.Players.Cards;
            Players.Score = result.Players.Score;

            let Card = {};
            Card.Color = result.Color;
            Card.Text = result.Text;
            Card.Value = result.Value;
            Card.Score = result.Score;

            // Startkarte anzeigen
            let img = new Image();
            img.src = "images/cards/" + newGame.TopCard.Color + newGame.TopCard.Value + ".png";
            img.height = 150;
            startkarte.appendChild(img);
            startkarte = newGame.TopCard;

            console.log("Startkarte: ", startkarte);

            //für eine einzelne Karte
            // let karteN0 = document.createElement("div");
            // let hn0 = new Image();
            // hn0.src = "images/cards/" + newGame.Players[0].Cards[0].Color + newGame.Players[0].Cards[0].Value + ".png";
            // hn0.height = 200;
            // karteN0.appendChild(hn0);
            // document.getElementById("sf-nord").appendChild(karteN0);

            // die Handkarten aller Spieler austeilen
            for (let i = 0; i < handkartenDivNames.length; i++) {   // jedem Spieler

                for (let j = 0; j < 7; j++) {                       // werden 7 Karten zugeteilt
                    let karte = document.createElement("div");      // jede Karte wird ein eigenes div
                    karte.setAttribute("class", "Handkarten" + i)   // Class Attribut, falls wir es brauchen
                    let img = new Image();                          // jeder Karte wird ein Bild zugewiesen
                    img.src = "images/cards/" + newGame.Players[i].Cards[j].Color + newGame.Players[i].Cards[j].Value + ".png";
                    img.height = 90;
                    img.setAttribute("id", "HK_" + handkartenDivNames[i] + j);  // jedes Karten-Image hat eine id
                    img.setAttribute("onclick", "pick_Card(this.id)");    // beim Klick auf die Karte wird die Funktion pick_Card() aufgerufen
                    karte.appendChild(img);
                    document.getElementById(handkartenDivNames[i]).appendChild(karte);
                }
            }

            // aktiven Spieler zuweisen
            aktiverSpieler.innerText = result.NextPlayer;
            document.getElementById("activePlayer").appendChild(aktiverSpieler);

            // Score den einzelnen Spielern zuweisen
            for (let i = 0; i < spielerDivNames.length; i++) {
                let p = document.createElement("p");
                p.innerText = "Score";
                let score = document.createElement("div");
                score.innerText = newGame.Players[i].Score;
                score.setAttribute("id", "Score"); // id Attribut hinzugefügt

                document.getElementById(spielerDivNames[i]).appendChild(p).appendChild(score);
            }
        } else {
            alert("HTTP-Error: " + response.status);
        }
        $('#playerNames').modal('hide');
    }
    spielfeldLaden();
});

// eine Karte aus dem Handkarten-Deck auswählen
function pick_Card(card_id) {

    alert("Hello again, gotcha!:)" + card_id);

};

// // Eine Karte spielen
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

