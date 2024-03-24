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
      }
    );

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
