import React from "react";
import { UserButton, useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Card from "react-bootstrap/Card";
import { Bar, Doughnut } from "react-chartjs-2";
import {  Chart, registerables } from "chart.js";

function HomePage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();

  // Register the scales
  Chart.register(...registerables);
  const data = {
    labels: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    datasets: [
      {
        label: "Expenses",
        backgroundColor: [
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(54, 162, 235, 0.2)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(54, 162, 235, 1)",
        ],
        borderWidth: 1,
        data: [
          1100, 1120, 1100, 1000, 1210, 1200, 1100, 1320, 1230, 1340, 1150,
          1160,
        ],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function (value, index, ticks) {
            return "$" + value;
          },
        },
      },
      x: {
        type: "category",
        categories: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ],
        grid: {
          display: true,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: "rgba(255, 255, 255, 0.6)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
    maintainAspectRatio: false,
  };

  const donutdata = {
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

  const donutoptions = {
    plugins: {
      legend: {
        position: "right",
      },
    },
    maintainAspectRatio: false,
  };

  if (!isLoaded) return <></>;
  else if (isLoaded && !userId) router.push("/");
  else {
    return (
      <>
        <Navbar collapseOnSelect expand="lg" bg="transparent" variant="dark">
          <Container>
            <Navbar.Brand href="/">
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
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container className="my-5">
          <Card>
            <Card.Body>
              <div className="d-flex align-items-center">
              <div className="title mr-auto">
                  <h1>Monthly Expenditure</h1>
                </div>
                <div className="expenses d-flex ml-auto">
                  <h1 className="text-success mr-3">$ 1 1 3 0</h1>
                  <img src="/addExpenseBox.png" alt="Expenses" />
                </div>
              </div>
              <div className="my-5" >
                <Bar data={data} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Container>
        <Container className="my-5">
          <Card>
            <Card.Body>
            <div className="title mr-auto">
                  <h1>Spending Summary</h1>
                </div>
              <div className="mb-4">
                <h6 className="font-italic">{`${new Date().toLocaleString(
                  "default",
                  { month: "long" }
                )} ${new Date().getFullYear()}`}</h6>
              </div>
              <div className="my-5 mx-auto" style={{maxWidth: '500px'}}>
                <Doughnut data={donutdata} options={donutoptions} />
              </div>
            </Card.Body>
          </Card>
        </Container>
      </>
    );
  }
}

export default HomePage;
