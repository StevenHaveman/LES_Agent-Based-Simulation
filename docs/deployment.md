# Deployment

## Inleiding
De opdrachtgever heeft aangegeven dat de applicatie online live beschikbaar moet zijn. Dat betekent dat iedereen, zonder ICT-kennis of IDE, de applicatie zou moeten kunnen gebruiken. Hiervoor moesten we zowel de backend als de frontend deployen en hosten. Wij hebben hiervoor een poging gewaagd. De manier waarop wij dit hebben gedaan, dient als opzet of voorbeeld van hoe het zou kunnen.

## Backend

Voor de backend hebben wij de serverprovider Render gebruikt. De verantwoording hiervoor is te vinden in het verantwoordingsdocument. De bevoegden hebben toegang tot het account waarop de backend draait. Op de Render-server draait de Flask API waarmee de frontend communiceert.

### Hoe deploy ik de backend
1. Op https://dashboard.render.com kan je de stauts van de server bekijken
2. Render deployt de  applciatie automatich na elke commit voor een bepalsd branch dit is int esteleln in die instelligen
3. Voor een manuele deployment kilk je eersrt op de server
4. rechtsboven kakn je de backend manueel deplyen met berscoleldne insrellignen


<img width="1366" alt="Scherm­afbeelding 2025-06-25 om 15 44 45" src="https://github.com/user-attachments/assets/4864a9b8-7535-45e5-9b55-99ec1725ce6d" />

### Beperkignen
De applicatie gebruikt veel RAM, waardoor je met een beperkt aantal configuratiewaarden de simulatie succesvol kunt draaien op de server. Het huidige maximum ligt op:
```{
  "nr_households": 10,
  "nr_residents": 20,
  "simulation_years": 10,
}```

Dit is het maximum voor de gratis versie van Render, die slechts 512 MB RAM toestaat. Dat is onvoldoende om een simulatie van de echte wereld uit te voeren. Om dat mogelijk te maken, zou je het abonnement moeten upgraden naar een betaald plan.

## Frontend
