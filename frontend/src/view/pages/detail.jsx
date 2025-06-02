// import React, { useState } from "react";
// import { createRoute } from "@tanstack/react-router";
// import { rootRoute } from "./root";
// import "../styles/detailpage.css";
// import HouseholdList from "../components/HouseholdList";
// import ResidentsList from "../components/ResidentsList";
// import HouseholdMap from "../components/HouseholdMap.jsx";
// import HouseholdNavbar from "../components/HouseholdNavbar.jsx";
// import HouseholdWindow from "../components/HouseholdWindow.jsx";
// import ResidentNavbar from "../components/ResidentNavbar.jsx";
// import ResidentWindow from "../components/ResidentWindow.jsx";
//
//
// export const detailRoute = createRoute({
//     getParentRoute: () => rootRoute,
//     path: "/detail",
//
//     component: function Detail() {
//         const [selectedResidents, setSelectedResidents] = useState([]);
//         const [selectedHouseholdId, setSelectedHouseholdId] = useState(null);
//         const [selectedResidentIndex, setSelectedResidentIndex] = useState(null);
//         const [householdWindow, setHouseholdWindow] = useState("");
//         const [residentWindow, setResidentWindow] = useState("");
//
//         const handleHouseholdSelect = (household) => {
//             setSelectedHouseholdId(household.id);
//             setSelectedResidents(household.residents);
//         };
//
//
//         return (
//             <div className="parent-container">
//
//                 <div className="list-container">
//                     <HouseholdList
//                         onSelectResidents={setSelectedResidents}
//                         onSelectHousehold={handleHouseholdSelect}
//                         selectedHouseholdId={selectedHouseholdId}
//                     />
//                     <ResidentsList
//                         residents={selectedResidents}
//                         selectedResidentIndex={selectedResidentIndex}
//                         onSelectResident={setSelectedResidentIndex}
//                     />
//                 </div>
//
//                 <div className="map-container">
//                     <HouseholdMap
//                         onSelectResidents={setSelectedResidents}
//                         onSelectHousehold={handleHouseholdSelect}
//                         selectedHouseholdId={selectedHouseholdId}
//                     />
//                 </div>
//                 <div className="info-container">
//                     <div className="household-container">
//                         <div className="tabs">
//                             <HouseholdNavbar
//                                 householdWindow={householdWindow}
//                                 setHouseholdWindow={setHouseholdWindow}
//                             />
//                         </div>
//                         <div className="household-window">
//                             <HouseholdWindow
//                                 householdWindow={householdWindow}
//                                 setHouseholdWindow={setHouseholdWindow}
//                                 selectedHouseholdId={selectedHouseholdId}
//                             />
//                         </div>
//                     </div>
//                     <div className="resident-container">
//                         <div className="tabs">
//                             <ResidentNavbar residentWindow={residentWindow} setResidentWindow={setResidentWindow} />
//                         </div>
//                         <div className="resident-window">
//                             <ResidentWindow
//                                 residentWindow={residentWindow}
//                                 setWindow={setResidentWindow}
//                                 residents={selectedResidents}
//                                 selectedResidentIndex={selectedResidentIndex}
//                             />
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     },
// });