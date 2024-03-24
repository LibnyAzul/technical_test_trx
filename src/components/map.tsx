import React, { FC, useEffect } from "react";
import { IVehicle } from "./models/vehicle";

interface IProps {
  coors: google.maps.LatLngLiteral[];
  vehicle: IVehicle;
}
const Map: FC<IProps> = ({ coors, vehicle }) => {
  const apiKey: string = process.env.REACT_APP_API_KEY!;
  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap`;
  script.async = true;

  const initMap = (): void => {
    const map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 13,
        center: coors[coors.length - 1],
        mapTypeId: "terrain",
        mapTypeControlOptions: {
          mapTypeIds: [
            "roadmap",
            "satellite",
            "hybrid",
            "terrain",
            "styled_map",
          ],
        },
      }
    );
    //Associate the styled map with the MapTypeId and set it to display.
    map.mapTypes.set(
      "styled_map",
      new google.maps.StyledMapType(
        [
          { elementType: "geometry", stylers: [{ color: "#DFDFDF" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#022D7E" }] },
          {
            elementType: "labels.text.stroke",
            stylers: [{ color: "#FAFAFA" }],
          },
          {
            featureType: "administrative",
            elementType: "geometry.stroke",
            stylers: [{ color: "#333E77" }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "geometry.stroke",
            stylers: [{ color: "#DCBEBE" }],
          },
          {
            featureType: "administrative.land_parcel",
            elementType: "labels.text.fill",
            stylers: [{ color: "#ae9e90" }],
          },
          {
            featureType: "landscape.natural",
            elementType: "geometry",
            stylers: [{ color: "#E6E3E3" }],
          },
          {
            featureType: "poi",
            elementType: "geometry",
            stylers: [{ color: "#8ABCCF" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#000000" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry.fill",
            stylers: [{ color: "#8ACFB2" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#1D0052" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#DBD2D2" }],
          },
          {
            featureType: "road.arterial",
            elementType: "geometry",
            stylers: [{ color: "#fdfcf8" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#67EEF8" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#62E9C1" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry",
            stylers: [{ color: "#58C0E9" }],
          },
          {
            featureType: "road.highway.controlled_access",
            elementType: "geometry.stroke",
            stylers: [{ color: "#55B5DB" }],
          },
          {
            featureType: "road.local",
            elementType: "labels.text.fill",
            stylers: [{ color: "#7A7272" }],
          },
          {
            featureType: "transit.line",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.fill",
            stylers: [{ color: "#A59792" }],
          },
          {
            featureType: "transit.line",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#ebe3cd" }],
          },
          {
            featureType: "transit.station",
            elementType: "geometry",
            stylers: [{ color: "#dfd2ae" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#b9d3c2" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#92998d" }],
          },
        ],
        { name: "Diseño personalizado" }
      )
    );
    map.setMapTypeId("styled_map");

    const flightPath = new google.maps.Polyline({
      path: coors,
      geodesic: true,
      strokeColor: "#0066ba",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });

    flightPath.setMap(map);
  };

  const mapContainerStyle = {
    width: "100%",
    height: "400px",
  };

  useEffect(() => {
    (window as any).initMap = initMap;
    document.body.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initMap]);

  return <div id="map" style={mapContainerStyle} />;
};

export default Map;
