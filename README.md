# Uno_Api

## Willkommen!

Wir haben mit Layout und Modalen Dialog für Spielerinneneingabe begonnen. 
Dannach die Funktionalität implementiert, und zum Schluss kosmetisch noch nachbehandelt und Animationen hinzugefügt.

## Ein paar Schritte dazu: 
   Warum werden die Handkarten nach dem Ziehen einer neuen Karte gelöscht und wiederaufgebaut:
   wir wollten jede hinzugekommene Karte aus der drawCard() einfach an das letzte Div des Spielers anhängen mit einem
   fortlaufenden Index (nach nord6 kommt nord7).
   Allerdings schicken wir diese Info nicht an den Server retour. Um die aktuellen Handkarten des Spielers zu erhalten,
   muss die getCards() aufgerufen werden. Hier ist die gezogene Karte jedoch in den Handkarten nach Farbreihenfolge 
   rot, gelb, grün, blau, scharz und aufsteigend nach Kartenwert einsortiert. 
   Deshalb ist der Index der Karte ein anderer als die Id des Karten-Images!!!!!!
   Lösung: die Handkarten werden zuerst komplett gelöscht und dann mit der aktuellen Kartenhand wieder aufgebaut!

## Probleme: 
- Javascript hat keine typen festen Variablen. 
- 'await' und 'async' hat zu schaffen gemacht es wird nicht auf die Informationen gewartet die für die Ausführung der Elemente gebraucht wird.
- Passend Struktur für Layout zu gestalten war hearusfordernd.
- Physisch nicht zusammen arbeiten können. 
- DOM Manipulation bedarf Übung. 
- Die vorgeschlagene Zeit für das Projekt, war viel zu gering. 
- Es ist sehr leicht gefallen in der unendlichen Welt des Web's sich zu verlieren 
- Serverprobleme.

## Fun moments: 
- Das Feuerwerk einzubauen.
- 'DU NICHT!'.
- Zusammenzuarbeiten wo es ging.
- Unser Design ist lustig.
- Wir haben uns weiter entwickelt

## Fragen: 
- der aktuelle Spieler wird nicht immer angezeigt, warum? 
- bei plus4 und farbwahlkarte nach dem ausspielen, wird der aktueller Spieler als undefined angezeigt und durchs länger Klicken auf Nachziestapel wird der aktueller Spieler wieder angezeigt, warum? 
- beim img:active lässt sich das spiel nicht immer spielen, warum? 


Eure Britta und Aiste
