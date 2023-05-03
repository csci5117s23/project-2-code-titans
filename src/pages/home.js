import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Nav,
  Navbar,
  Card,
  Row,
  Col,
  Button,
  Carousel,
} from "react-bootstrap";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import Navigation from "@/components/Navigation";
import Loader from "@/components/Loader";
import Head from "next/head";
import { useRouter } from "next/router";

export default function HomePage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    setIsLoading(!isLoaded);
  }, [isLoaded]);

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
  const [activeIndex, setActiveIndex] = useState(0);

  const plans = [
    {
      title: "Plan 1",
      expense: 1100,
      image1: "/autoExp.png",
      image2: "/homeExp.png",
    },
    {
      title: "Plan 2",
      expense: 1789,
      image1: "/otherExp.png",
      image2: "/homeExp.png",
    },
    {
      title: "Plan 3",
      expense: 2100,
      image1: "https://via.placeholder.com/100x100",
      image2: "https://via.placeholder.com/100x100",
    },
    {
      title: "Plan 4",
      expense: 1400,
      image1: "https://via.placeholder.com/100x100",
      image2: "https://via.placeholder.com/100x100",
    },
    {
      title: "Plan 5",
      expense: 2000,
      image1: "https://via.placeholder.com/100x100",
      image2: "https://via.placeholder.com/100x100",
    },
    {
      title: "Plan 6",
      expense: 1800,
      image1: "https://via.placeholder.com/100x100",
      image2: "https://via.placeholder.com/100x100",
    },
    {
      title: "Plan 7",
      expense: 1600,
      image1: "https://via.placeholder.com/100x100",
      image2: "https://via.placeholder.com/100x100",
    },
  ];

  const handlePrevClick = () => {
    setActiveIndex(activeIndex === 0 ? plans.length - 1 : activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex === plans.length - 1 ? 0 : activeIndex + 1);
  };

  if (!isLoaded) return <>
  <div className="loader-container">
            <Loader />
          </div></>;
  else if (isLoaded && !userId) router.push("/");
  else {
    return (
      <>
      {isLoading && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
        <Head>
          <title>Home</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/duckget-logo.png" />
        </Head>
        <Navigation/>
        <Container fluid="md" className="my-5">
          <Card className="rounded-4">
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
              <div className="my-5">
                <Bar data={data} options={options} />
              </div>
            </Card.Body>
          </Card>
        </Container>
        <Container className="my-5">
          <Card className="rounded-4">
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
              <div className="my-5 mx-auto" style={{ maxWidth: "500px" }}>
                <Doughnut data={donutdata} options={donutoptions} />
              </div>
            </Card.Body>
          </Card>
        </Container>
        <Container className="my-5">
          <h2 className="white-color">Your Plans</h2>
          <Carousel
            activeIndex={activeIndex}
            onSelect={(selectedIndex) => setActiveIndex(selectedIndex)}
            interval={null}
            slide={2} // Set number of cards displayed to 2
          >
            {plans.reduce((acc, plan, index) => {
              if (index % 2 === 0) {
                acc.push(
                  <Carousel.Item key={index}>
                    <Row className="mt-3 justify-content-center">
                      <Col sm={6} md={4} lg={4} className="mb-3">
                        <Card className="rounded-4">
                          <Card.Body>
                            <Card.Title className="title">
                              {plans[index].title}
                            </Card.Title>
                            <h3 className="text-success">
                              ${plans[index].expense}
                            </h3>
                            <div className="d-flex justify-content-center">
                              <div className="m-auto">
                                <img
                                  width="100px"
                                  height="100px"
                                  src={plans[index].image1}
                                  alt="Image 1"
                                />
                              </div>
                              <div className="m-auto">
                                <img
                                  width="100px"
                                  height="100px"
                                  src={plans[index].image2}
                                  alt="Image 2"
                                />
                              </div>
                            </div>
                            <div className="d-flex m-3">
                              <Button
                                variant="primary"
                                className="m-auto main-button p-2"
                              >
                                View
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                      {index + 1 < plans.length && (
                        <Col sm={6} md={4} lg={4} className="mb-3">
                          <Card className="rounded-4">
                            <Card.Body>
                              <Card.Title className="title">
                                {plans[index + 1].title}
                              </Card.Title>
                              <h3 className="text-success">
                                ${plans[index + 1].expense}
                              </h3>
                              <div className="d-flex justify-content-center">
                                <div className="m-auto">
                                  <img
                                    width="100px"
                                    height="100px"
                                    src={plans[index + 1].image1}
                                    alt="Image 1"
                                  />
                                </div>
                                <div className="m-auto">
                                  <img
                                    width="100px"
                                    height="100px"
                                    src={plans[index + 1].image2}
                                    alt="Image 2"
                                  />
                                </div>
                              </div>
                              <div className="d-flex m-3">
                                <Button
                                  variant="primary"
                                  className="m-auto main-button p-2"
                                >
                                  View
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  </Carousel.Item>
                );
              }
              return acc;
            }, [])}
          </Carousel>
          <div className="d-flex justify-content-center mt-3">
            <Button
              variant="light"
              className="mr-2"
              onClick={handlePrevClick}
              disabled={activeIndex === 0}
            >
              <FaAngleLeft />
            </Button>
            <Button
              variant="light"
              className="ml-2"
              onClick={handleNextClick}
              disabled={activeIndex === Math.floor((plans.length - 1) / 2)}
            >
              <FaAngleRight />
            </Button>
          </div>
        </Container>
      </>
    );
  }
}
