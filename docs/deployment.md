# Deployment

## Inleiding

De opdrachtgever heeft in de laatste sprint aangegeven dat de applicatie online live beschikbaar moet zijn. Dat betekent dat iedereen, zonder ICT-kennis of IDE, de applicatie zou moeten kunnen gebruiken. Hiervoor moesten we zowel de backend als de frontend deployen en hosten. Wij hebben hiervoor een praktische opzet gemaakt. De manier waarop wij dit hebben gedaan, dient als voorbeeld van hoe het zou kunnen worden aangepakt. 

We willen benadrukken dat er geen diepgaand vergelijkend onderzoek is gedaan naar verschillende deploymentproviders. We hebben enkele opties verkend, maar de keuze voor Render is voornamelijk gebaseerd op de beschikbaarheid en ervaring binnen het team. Deze opzet is bedoeld als uitgangspunt, niet als definitieve aanbeveling. Een uitgebreider onderzoek naar de beste oplossing qua deployment zou door het volgende team kunnen worden opgepakt.

## Backend

Voor de backend hebben wij de serverprovider Render gebruikt. De bevoegden hebben toegang tot het account waarop de backend draait. Op de Render-server draait de Flask API waarmee de frontend communiceert.

### Hoe deploy ik de backend
1.	Ga naar https://dashboard.render.com om de status van de server te bekijken.
2.	2.	Render deployt de applicatie automatisch na elke commit naar een specifieke branch. Dit is ingesteld in de Render-instellingen
3.	Voor een handmatige deployment klik je eerst op de betreffende server.
4.	Rechtsboven kun je de backend handmatig deployen via de knop Manual Deploy.

<img width="1366" alt="Scherm­afbeelding 2025-06-25 om 15 44 45" src="https://github.com/user-attachments/assets/4864a9b8-7535-45e5-9b55-99ec1725ce6d" />

### Beperkignen
De applicatie gebruikt veel RAM, waardoor je met een beperkt aantal configuratiewaarden de simulatie succesvol kunt draaien op de server. Het huidige maximum ligt op:

- nr_households: 10
- nr_residents: 20
- simulation_years: 10

Dit is het maximum voor de gratis versie van Render, die slechts 512 MB RAM toestaat. Dat is onvoldoende om een simulatie van de echte wereld uit te voeren. Om dat mogelijk te maken, zou je het abonnement moeten upgraden naar een betaald plan.

## Frontend
