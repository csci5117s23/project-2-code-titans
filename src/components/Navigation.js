import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs"
import {
  Container,
  Nav,
  Navbar,
  Button
} from "react-bootstrap";
export default function Navigation(){
  const [installable, setInstallable] = useState(false);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      console.log("HI")
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      deferredPrompt = e;
      // Update UI notify the user they can install the PWA
      setInstallable(true);
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
              </Nav>
              <Nav>
                <UserButton />
              </Nav>
              <Nav>
              {installable &&
          <Button variant='primary' className="install-button" onClick={handleInstallClick}>
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