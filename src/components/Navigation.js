import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useEffect } from 'react';
import { UserButton } from "@clerk/nextjs"
import {
  Container,
  Nav,
  Navbar,
  Button
} from "react-bootstrap";
import Link from "next/link";

export default function Navigation() {
  return (
    <>
    <Navbar collapseOnSelect expand="lg" bg="transparent" variant="dark">
          <Container>
            <Navbar.Brand className="white-color">
              <Link className="nav-link" href="/"><strong>DuckGet</strong></Link>
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <Nav className="me-auto">
                <Link className="nav-link" href="/plans">Plans</Link>
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