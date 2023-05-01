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
            </Navbar.Collapse>
          </Container>
        </Navbar>
    </>
  )
}