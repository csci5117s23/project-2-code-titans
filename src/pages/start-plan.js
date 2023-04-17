import React, { useState } from "react";
import {useAuth, useUser } from "@clerk/nextjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Form } from "react-bootstrap";
import Navigation from "@/components/Navigation";
export default function StartNew() {
  const [location, setLocation] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [totalSalesTax, setTotalSalesTax] = useState(null);
  const apiNinjaKey = 'VUqM8pOYRSUXDglRoav+Vg==EuvtIuMkwpPN0t9r';
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
       await findZipCode(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleZipCodeSubmit = (e) => {
    if(e != null) e.preventDefault();
    setZipCode(e.target.zipCodeInput.value);
  };

  const handleCustomZipCodeChange = (e) => {
    setZipCode(e.target.value);
  };

  const findZipCode = async (latitude, longitude) => {
    const response = await fetch("/zip.txt");
    const data = await response.text();
    const lines = data.split("\n");

    let closestZipCode = "";
    let minDistance = Infinity;

    for (let i = 0; i < lines.length; i++) {
      const [zip, lat, long] = lines[i].split(",");
      const distance = Math.sqrt(
        Math.pow(latitude - lat, 2) + Math.pow(longitude - long, 2)
      );
      if (distance < minDistance) {
        closestZipCode = zip;
        minDistance = distance;
      }
    }

    setZipCode(closestZipCode);
  };

  const handleLocationButtonClick = async () => {
    getLocation();
  };

  const handleFetchSalesTaxClick = () => {
    if (!zipCode) {
      alert("Please enter a valid zip code");
      return;
    }

    fetch(
      `https://api.api-ninjas.com/v1/salestax?zip_code=${zipCode}`,
      {
        method: "GET",
        headers: {
          "X-Api-Key": apiNinjaKey,
        },
      }
    ).then((res) =>
      res.json().then((data) => {
        setTotalSalesTax(data[0].total_rate * 100 + "%");
      })
    );
  };
  if (!isLoaded) return <></>;
  else if (isLoaded && !userId) router.push("/");
  else {
  return (
    <>
    <Navigation/>
    <Container>
      <Form onSubmit={handleZipCodeSubmit}>
        <Form.Group controlId="zipCodeInput">
          <Form.Label>Enter a zip code</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter zip code"
            value={zipCode || ""}
            onChange={handleCustomZipCodeChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>

      <hr />

      <Button onClick={handleLocationButtonClick}>Get Location</Button>

      {location && (
        <>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
        </>
      )}

      {zipCode && (
        <>
          <p>Zip: {zipCode}</p>
          <Button onClick={handleFetchSalesTaxClick}>
            Get Sales Tax
          </Button>
        </>
      )}

      {totalSalesTax && (
        <p>Sales Tax: {totalSalesTax}</p>
      )}
    </Container>
    </>
  );
  }
}