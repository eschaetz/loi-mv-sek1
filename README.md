
> Diese Seite bei [https://eschaetz.github.io/loi-mv-sek1/](https://eschaetz.github.io/loi-mv-sek1/) öffnen

# LOI MV – Sek I (MakeCode Erweiterung)

Diese MakeCode-Erweiterung stellt Blöcke zur Steuerung eines Roboters sowie einer externen Fernbedienung bereit.
Sie wurde für den Einsatz im Rahmen der Landesolympiade Informatik MV (Sek I) entwickelt.

---

## Website / Dokumentation

Diese Seite öffnen:  
https://eschaetz.github.io/loi-mv-sek1/

---

## Als Erweiterung verwenden

Dieses Repository kann als **Erweiterung** in MakeCode hinzugefügt werden.

- öffne https://makecode.microbit.org/
- klicke auf **Neues Projekt**
- klicke auf **Erweiterungen** unter dem Zahnrad-Menü
- nach **https://github.com/eschaetz/loi-mv-sek1** suchen und importieren

---

## Dieses Projekt bearbeiten  
![Build Status Abzeichen](https://github.com/eschaetz/loi-mv-sek1/workflows/MakeCode/badge.svg)

- öffne https://makecode.microbit.org/
- klicke auf **Importieren**
- wähle **Importiere URL**
- füge **https://github.com/eschaetz/loi-mv-sek1** ein

---

## Blockvorschau

![Eine gerenderte Ansicht der Blöcke](https://github.com/eschaetz/loi-mv-sek1/raw/master/.github/makecode/blocks.png)

---

# Blöcke / API-Dokumentation

## Kategorie: LOI MV – Roboter (`LOI_MV`)

---

### Roboter hochfahren

**Block:** `Roboter hochfahren`  
**Funktion:** `init()`  
**Beschreibung:**  
TODO: Initialisiert Neopixel, Display, Antrieb und weitere Komponenten.

---

### Antrieb (Power & Lenkung)

**Block:** `Setze Geschwindigkeit auf: <power> und Lenkung auf: <lenkung>`  
**Funktion:** `antrieb(power, lenkung)`  

- `power`: -10 … 10  
- `lenkung`: -10 … 10  

**Beschreibung:**  
TODO: Kombinierte Steuerung beider Motoren über Geschwindigkeit und Lenkung.

---

### Baggersteuerung (Direkte Motorsteuerung)

**Block:** `Setze Motor links auf: <links> und Motor rechts auf: <rechts>`  
**Funktion:** `baggersteuerung(links, rechts)`  

**Beschreibung:**  
TODO: Direkte Steuerung der linken und rechten Motoren.

---

### Ultraschall – einfach

**Block:** `gemessene Distanz`  
**Funktion:** `ultraschall()`  

**Beschreibung:**  
TODO: Gibt die gemessene Entfernung in Zentimetern zurück.

---

### Ultraschall – advanced

**Block:** `ultraschall_advanced`  
**Funktion:** `ultraschall_advanced()`  

**Beschreibung:**  
TODO: Gefilterte Distanzmessung mit Kalibrierung und Hintergrund-Update.  
**Hinweis:** Nicht für Einsteiger gedacht.

---

### Linetracking

**Block:** `schwarzer Untergrund <linetracker> erkannt`  
**Funktion:** `linetracking(linetracker)`  

**Parameter:**
- `links` (LT0 / P6)
- `rechts` (LT1 / P7)

**Beschreibung:**  
TODO: Erkennt schwarzen Untergrund über den gewählten Sensor.

---

### Neopixel

**Block:** `Zeige Farbe <color> mit dem Neopixel`  
**Funktion:** `neopixels(color)`  

**Beschreibung:**  
TODO: Setzt alle Neopixel auf eine Farbe.

---

### Längsneigung (Pitch)

**Block:** `Längsneigung`  
**Funktion:** `pitch()`  

**Beschreibung:**  
TODO: Neigung nach vorne/hinten (positiv = Nase oben).

---

### Querneigung (Roll)

**Block:** `Querneigung`  
**Funktion:** `roll()`  

**Beschreibung:**  
TODO: Seitliche Neigung des Roboters.

---

### Sensor-Ausgabe auf LCD

**Block:** `Sensor-Ausgabe Intervall <intervall>`  
**Funktion:** `sensor_ausgabe(intervall)`  

**Beschreibung:**  
TODO: Zeigt Sensordaten zyklisch auf dem LCD an.

---

### Graddrehung (intern / advanced)

**Block:** `Graddrehung <drehung> <toleranz>`  
**Funktion:** `graddrehung(drehung, toleranz)`  

**Beschreibung:**  
TODO: Dreht den Roboter mithilfe des Kompasses um einen bestimmten Winkel.

---

### Initialisierung – advanced

**Block:** `init_advanced kompass <kompass> calibrateUltraschall <ultra> filter <filter>`  
**Funktion:** `init_advanced(kompass, ultra, filter)`  

**Beschreibung:**  
TODO: Erweiterte Initialisierung mit Kompass und Ultraschallfilterung.

---

### Helligkeitssensor links (intern)

**Block:** `helligkeitLinks`  
**Funktion:** `helligkeitLinks()`  

**Beschreibung:**  
TODO: Gibt den digitalen Wert des linken Helligkeitssensors zurück.

---

### Helligkeitssensor rechts (intern)

**Block:** `helligkeitRechts`  
**Funktion:** `helligkeitRechts()`  

**Beschreibung:**  
TODO: Gibt den digitalen Wert des rechten Helligkeitssensors zurück.

---

## Kategorie: LOI MV – Fernbedienung (`LOI_Remote`)

---

### Knopf A

**Block:** `Knopf A ist gedrückt`  
**Funktion:** `knopf_a()`  

**Beschreibung:**  
TODO: Gibt `true` zurück, wenn Knopf A gedrückt ist.

---

### Knopf B

**Block:** `Knopf B ist gedrückt`  
**Funktion:** `knopf_b()`  

**Beschreibung:**  
TODO

---

### Knopf C

**Block:** `Knopf C ist gedrückt`  
**Funktion:** `knopf_c()`  

**Beschreibung:**  
TODO

---

### Knopf D

**Block:** `Knopf D ist gedrückt`  
**Funktion:** `knopf_d()`  

**Beschreibung:**  
TODO

---

## Enums

### Linetracker

- `links` → `LT0` (P6)
- `rechts` → `LT1` (P7)

---

## Lizenz

TODO

---

#### Metadaten (verwendet für Suche & Rendering)

- for PXT/microbit

<script src="https://makecode.com/gh-pages-embed.js"></script>
<script>
makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");
</script>


#### Metadaten (verwendet für Suche, Rendering)

* for PXT/microbit
<script src="https://makecode.com/gh-pages-embed.js"></script><script>makeCodeRender("{{ site.makecode.home_url }}", "{{ site.github.owner_name }}/{{ site.github.repository_name }}");</script>
