import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Nav,
  Navbar,
  Card,
  Row,
  Col,
  Button,
} from "react-bootstrap";

export default function PlanCard({name,expenditure,summaryData,activeStatus}) {
    return (
        <>
            <Card className="rounded-4 my-2 mx-5">
            <Card.Body>
                <Card.Title className="title">
                    {name}
                </Card.Title>
                <h3 className="text-success">
                    {summaryData}
                </h3>
                <div className="d-flex justify-content-center">
                    <div className="m-auto">
                        <p>{expenditure}</p>
                    </div>
                </div>
                <div className="d-flex m-3">
                    <Button
                        variant="primary"
                        className="mx-5 mx-auto main-button p-2"
                    >
                        {activeStatus ? "Deactivate" : "Activate"}
                    </Button>
                </div>
                </Card.Body>
            </Card>
        </>
    )
}