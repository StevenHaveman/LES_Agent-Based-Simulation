# Quick Start(lokaal via IDE)

Om het project lokaal via een IDE te starten, moet je zowel de Flask API als de lokale UI draaien. Om de AI-chat werkend te krijgen, moet je Ollama geïnstalleerd hebben.


## Hoe start je de Flask API
- Zorg dat je Python 3.12 of hoger op je machine hebt geïnstalleerd.
- Installeer de benodigde packages 
- Navigeer naar `app.py` en voer het bestand uit ▶
- De API draait vervolgens op: [http://127.0.0.1:5000](http://127.0.0.1:5000)

## Hoe start je de UI
- Navigeer naar de `frontend` map in de terminal → `cd frontend`
- Installeer de benodigde packages met `npm install` 
- Start de UI met `npm run dev` 
- De UI is bereikbaar op: [http://localhost:5173/INNO/](http://localhost:5173/INNO/)

## Hoe krijg je de AI-chat werkend met Ollama

Dit stappenplan helpt je om **Ollama** te installeren om de AI-chat werkend te krijgen.

1.  **Download Ollama**
    Ga naar de officiële website: [https://ollama.com/download](https://ollama.com/download).
    Download de versie die geschikt is voor jouw besturingssysteem (bijvoorbeeld macOS, Windows of Linux).

2.  **Installeer Ollama**
    Open het gedownloade installatiebestand en volg de instructies om Ollama te installeren.

3.  **Controleer de installatie**
    Open je terminal (opdrachtprompt) en voer het volgende commando uit:

    ```bash
    ollama --version
    ```
    Als de installatie succesvol was, zie je hier de geïnstalleerde versie van Ollama.

4.  **Start de Ollama-server**
    In de terminal, voer het volgende commando uit:

    ```bash
    ollama serve
    ```
    Dit start de Ollama-server op de achtergrond. Je terminal zal nu actief blijven.

5.  **Test de verbinding met een model**
    Voer een testcommando uit om te zien of Ollama werkt en een model kan downloaden. Typ in een *nieuwe* terminal (terwijl de `ollama serve` terminal open blijft):

    ```bash
    ollama run llama3.1:8b
    ```
    
6.  **Run Ollama met de juiste versie**
    Als de vorige stap succesvol was en het model gedownload is, kun je nu het model `llama3.1:8b` draaien met Ollama. Blijf hiervoor in de terminal waar je al `ollama run llama3.1:8b` hebt uitgevoerd, of start een nieuwe terminal en voer het commando opnieuw uit:

    ```bash
    ollama run llama3.1:8b
    ```
    Je kunt nu met het AI-model communiceren via de  AI-chat




