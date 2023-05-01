import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Doughnut } from "react-chartjs-2";
import "chart.js/auto";
import { Chart, registerables } from "chart.js";
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
    Chart.register(...registerables);
    const data = {
        labels: ["Food", "Utilities", "Rent", "Auto", "Entertainment", "Other"],
        datasets: [
          {
            label: "Spending Summary",
            data: [20, 10, 30, 15, 5, 20],
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#FF8A80",
              "#B2FF59",
              "#D7CCC8",
            ],
            borderWidth: 1,
          },
        ],
      };
    
      const options = {
        plugins: {
          legend: {
            display: false,
          },
        },
        maintainAspectRatio: true,
      };
    
    return (
     <Card className="mb-3 rounded-5 shadow">
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <Card.Title className="mb-1"><h1>{name}</h1></Card.Title>
          <Card.Subtitle className="text-muted mb-3">
            Monthly Expenditure
          </Card.Subtitle>
          <h3 style={{color: "#044303"}}>${expenditure}</h3>
          {activeStatus ? (
            <Button variant="danger" className="mt-3" style={{background: "rgba(59, 95, 116, 0.87)", border: "none"}}>
              Deactivate
            </Button>
          ) : (
            <Button variant="success" className="mt-3" style={{backgroundColor: "#47B1ED", border: "none"}}>
            Activate
            </Button>
          )}
        </div>
        <div className="ml-auto d-flex align-items-center">
          <div className="chart-container">
            <Doughnut data={data} options={options} />
          </div>
          <Button
            variant="link"
            className="mt-3 ml-2"
          >
            <img
            src="/expand.png"
            alt="Expand"
            />
          </Button>
        </div>
      </Card.Body>
    </Card>
    );
}
