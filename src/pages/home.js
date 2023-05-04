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
import {
  getAllPlans,
  getAllActivePlans,
  getPastExpensesByDate,
  getSinglePlannedExpense,
  getSpecificPlannedExpenses,
  addPastExpense,
} from "@/modules/Data";
import { useRef } from "react";
import Chartjs from "chart.js";

export default function HomePage() {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();
  const [barGraphData, setBarGraphData] = useState([
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  ]);
  const [barGraphLoad, setBarGraphLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [barGraphRef, setBarGraphRef] = useState(useRef(null));
  const [plans, setNewPlans] = useState([]);
  const [currentMonthExpend, setCurrentMonthExpend] = useState([]);
  const [currentMonth, setCurrentMonth] = useState([]);
  const [barInfo, setBarInfo] = useState({
    type: "bar",
    data: {
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
          data: barGraphData,
        },
      ],
    },
    options: {
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
    },
  });
  const [barInstance, setBarInstance] = useState(null);

  useEffect(() => {
    const getTotalExp = async (plan) => {
      return await getToken({ template: "codehooks" }).then(async (token) => {
        return await getSpecificPlannedExpenses(token, userId, plan._id).then(
          (res) => {
            let totalExp = 0;
            console.log("Planned expenses: ", res);
            const nameToSpendingData = new Array();
            res.map((entry) => {
              const tempImgPath = "/" + entry.name.toLowerCase() + "Exp.png";
              if (!nameToSpendingData.includes(tempImgPath))
                nameToSpendingData.push(
                  "/" + entry.name.toLowerCase() + "Exp.png"
                );
              totalExp += parseFloat(entry.amount);
            });
            console.log("total exp: " + totalExp);
            return {
              totalExp: parseFloat(totalExp).toFixed(2),
              nameToSpendingData: nameToSpendingData,
            };
          }
        );
      });
    };

    getToken({ template: "codehooks" }).then(async (token) => {
      const res = await getAllPlans(token, userId);
      console.log("res1: " + JSON.stringify(res));
      if (res.length > 0) {
        setNewPlans(
          await Promise.all(
            res.map(async (plan) => {
              const planNames = plan.name;
              const { totalExp, nameToSpendingData } = await getTotalExp(plan);
              return [planNames, totalExp, nameToSpendingData, plan._id];
            })
          )
        );
      }
    });
  }, [router, isLoaded]);

  const monthNumToName = {
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
  };

  // Register the scales
  Chart.register(...registerables);

  useEffect(() => {
    setIsLoading(!isLoaded);
  }, [isLoaded]);
  useEffect(() => {
    const checkPastMonths = async () => {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonthNumeric = currentDate.getMonth() + 1;
      setCurrentMonth((currentDate.getMonth() + 1).toLocaleString(
        "en-US",
        { minimumIntegerDigits: 2, useGrouping: false }
      )+"-"+currentYear);
      for (let i = 1; i <= currentMonthNumeric; i++) {
        const token = await getToken({ template: "codehooks" });
        console.log(
          i.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }) +
            "-" +
            currentYear
        );
        let ithMonth = await getPastExpensesByDate(
          token,
          userId,
          i.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }) +
            "-" +
            currentYear
        );
        if (!ithMonth || ithMonth.length == 0) {
          const activePlan = (await getAllActivePlans(token, userId))[0];
          if (activePlan)
            barGraphData[i - 1] = await getSpecificPlannedExpenses(
              token,
              userId,
              activePlan._id
            ).then(async (res) => {
              return await Promise.all(
                res.map(async (expense) => {
                  return await addPastExpense(token, {
                    name: expense.name,
                    userId: userId,
                    amount: expense.amount,
                    date:
                      i.toLocaleString("en-US", {
                        minimumIntegerDigits: 2,
                        useGrouping: false,
                      }) +
                      "-" +
                      currentYear,
                  });
                })
              );
            }).reduce((acc, ith) => {
              return acc + parseFloat(ith.amount);
            }, 0);
          else barGraphData[i - 1] = 0;
        }else{
          barGraphData[i - 1] = ithMonth.reduce((acc, ith) => {
            return acc + parseFloat(ith.amount);
          }, 0);
        }

      }
      const token = await getToken({ template: "codehooks" });
      const activePlan = (await getAllActivePlans(token, userId))[0];
      console.log(activePlan);

      const projectedCost = activePlan
        ? await getToken({ template: "codehooks" }).then(async (token) => {
            return await getSpecificPlannedExpenses(
              token,
              userId,
              activePlan._id
            ).then((res) => {
              return res.reduce((acc, entry) => {
                return acc + parseFloat(entry.amount);
              }, 0);
            });
          })
        : 0;
      for (let i = currentMonthNumeric + 1; i <= 12; i++) {
        barGraphData[i - 1] = projectedCost;
      }
      
      setBarGraphData(barGraphData);
      setCurrentMonthExpend(barGraphData[currentMonthNumeric - 1]);
      console.log(barGraphData);
      setBarGraphLoad(false);
    };
    checkPastMonths();
  }, [barGraphLoad]);

  useEffect(() => {
    let tempInfo = barInfo;
    tempInfo.data.datasets[0].data = barGraphData;
    setBarInfo(tempInfo);
    console.log("tempInfo: ");
    console.log(tempInfo);
  }, [barGraphData, barGraphLoad]);

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

  const handlePrevClick = () => {
    setActiveIndex(activeIndex === 0 ? plans.length - 1 : activeIndex - 1);
  };

  const handleNextClick = () => {
    setActiveIndex(activeIndex === plans.length - 1 ? 0 : activeIndex + 1);
  };

  if (!isLoaded)
    return (
      <>
        <div className="loader-container">
          <Loader />
        </div>
      </>
    );
  else if (isLoaded && !userId) router.push("/");
  else {
    console.log(barInfo.data);
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
        <Navigation />
        <Container fluid="md" className="my-5">
          <Card className="rounded-4">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="title mr-auto">
                  <h1>Monthly Expenditure</h1>
                </div>
                <div className="expenses d-flex ml-auto">
                  <h1 className="text-success mr-3">$ {currentMonthExpend.toString().split('').join('\u200A'.repeat(2))}</h1>
                  <img src="/addExpenseBox.png" alt="Expenses" onClick={() => router.push("/summary/" + currentMonth)} />
                </div>
              </div>
              <div className="my-5">
                <Bar data={barInfo.data} options={barInfo.options} />
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
                              {plans[index][0]}
                            </Card.Title>
                            <h3 className="text-success">${plans[index][1]}</h3>
                            <div className="d-flex justify-content-center">
                              {plans[index][2].map((imgPath) => {
                                return (
                                  <div className="m-auto">
                                    <img
                                      width="75px"
                                      height="75px"
                                      src={imgPath}
                                    
                                    />
                                  </div>
                                );
                              })}
                            </div>
                            <div className="d-flex m-3">
                              <Button
                                variant="primary"
                                className="m-auto main-button p-2"
                                onClick={() => {
                                  router.push("/plans/" + plans[index + 1][3]);
                                }}
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
                                {plans[index + 1][0]}
                              </Card.Title>
                              <h3 className="text-success">
                                ${plans[index + 1][1]}
                              </h3>
                              <div className="d-flex justify-content-center">
                                {plans[index + 1][2].map((imgPath) => {
                                  return (
                                    <div className="m-auto">
                                      <img
                                        width="75px"
                                        height="75px"
                                        src={imgPath}
                                      />
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="d-flex m-3">
                                <Button
                                  variant="primary"
                                  className="m-auto main-button p-2"
                                  onClick={() => {
                                    router.push(
                                      "/plans/" + plans[index + 1][3]
                                    );
                                  }}
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
