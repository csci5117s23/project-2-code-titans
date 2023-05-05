import React from "react";

import { useRouter } from "next/router";

import { Card, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "chart.js/auto";

import {} from "@/modules/Data";

export default function PlanCard({
  name,
  expenditure,
  labels,
  spendingData,
  activeStatus,
  activate,
  id,
}) {
  Chart.register(...registerables);
  const router = useRouter();
  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: true,
  };
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Spending Summary",
        data: spendingData,
        backgroundColor: Array.from(
          { length: 1000 },
          () =>
            `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
              Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)}, 0.5)`
        ),
        borderWidth: 1,
      },
    ],
    options: options,
  };

  return (
    <Card className="mb-3 rounded-5 shadow">
      <Card.Body className="d-flex align-items-center justify-content-between">
        <div>
          <Card.Title className="mb-1">
            <h1>{name}</h1>
          </Card.Title>
          <Card.Subtitle className="text-muted mb-3">
            Monthly Expenditure
          </Card.Subtitle>
          <h3 style={{ color: "#044303" }}>${expenditure}</h3>
          {activeStatus ? (
            <Button
              variant="danger"
              className="mt-3"
              style={{ background: "rgba(59, 95, 116, 0.87)", border: "none" }}
            >
              Active
            </Button>
          ) : (
            <Button
              onClick={() => activate(id)}
              variant="success"
              className="mt-3"
              style={{ backgroundColor: "#47B1ED", border: "none" }}
            >
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
            onClick={() => router.push("/plans/" + id)}
          >
            <img src="/expand.png" alt="Expand" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
