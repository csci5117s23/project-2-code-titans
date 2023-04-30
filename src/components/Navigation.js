import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs"
import {
  Container,
  Nav,
  Navbar,
  Button
} from "react-bootstrap";

let deferredPrompt
export default function Navigation(){
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    console.log("Use Effect Works!")
    window.addEventListener("beforeinstallprompt", (beforeInstallPromptEvent) => {
      beforeInstallPromptEvent.preventDefault(); // Prevents immediate prompt display
      console.log("Listener works!")
      // Shows prompt after a user clicks an "install" button
      installButton.addEventListener("click", (mouseEvent) => {
        // you should not use the MouseEvent here, obviously
        beforeInstallPromptEvent.prompt();
      });
    
      installButton.hidden = false; // Make button operable
    });
  }, []);

  const handleInstallClick = (e) => {
      // Hide the app provided install promotion
      setInstallable(false);
      // Show the install prompt
      deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        } else {
          console.log('User dismissed the install prompt');
        }
      });
  };


  return (
    <>
    <Navbar collapseOnSelect expand="lg" bg="transparent" variant="dark">
          <Container>
            <Navbar.Brand href="/" className="white-color">
              <strong>DuckGet</strong>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/start-plan">Start New Plan</Nav.Link>
                <Nav.Link href="/current-plans">My Current Plans</Nav.Link>
                <Nav.Link href="/detailed-view">Detailed View</Nav.Link>
                <link rel="manifest" href="/manifest.json"></link>
              </Nav>
              <Nav>
                <UserButton />
              </Nav>
              <Nav>
              {installable &&
          <Button variant='primary' className="installButton" onClick={handleInstallClick}>
          INSTALL ME
        </Button>
        }
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </>
  )
}