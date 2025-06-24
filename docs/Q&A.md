# Questions & Answers

## Hoe maak je een nieuwe pagina?

1. Maak in de `routes`-map een nieuw bestand aan, bijvoorbeeld `newpage.jsx`.

2. Voeg de volgende code toe in deze file

```jsx
import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "./root";
import Navbar from "../components/Navbar.jsx";
import NewPage from "../components/NewPage.jsx";

export const newPageRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/new",
  component: () => (
    <>
      <Component />
    </>
  ),
});

3. Om ervoor te zorgen dat de router de nieuwe route herkent en kan tonen, voeg je de route toe aan de `routeTree` in `route.jsx`:


export const routeTree = rootRoute.addChildren([
  configRoute,
  overviewRoute,
  detailRoute,
  newPageRoute, // Voeg hier je nieuwe route toe
]);
```

## Wat doet de API zelf
De backend API is eigenlijk een wrapper voor de simulatie zelf. Dit zorgt voor een tussen laag voor communicatie van de frontend met de simulatie. De API is in dit geval eigenlijk alleen nog maar een doorgeefluik

## Welk framework is er gebruikt voor de simulatie zelf
Mesa, de verantwoording hiervoor is te vinden in het verantwoordingsdocument.
