import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  Nav,
  Navbar,
  Card,
  Row,
  Col,
  Button,
  Form,
} from "react-bootstrap";
import ExpenseModal from "@/components/ExpenseModal";
import Head from "next/head";
import { useRouter } from "next/router";

import PlannedExpensesCard from "@/components/PlannedExpensesCard";
import { editPlan, getSpecificPlannedExpenses, deletePlan } from "@/modules/Data";
export default function NewPlanPage() {
  const [showModal, setShowModal] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState("");
  const [planName, setPlanName] = useState("");
  const [projectedYearlyIncome, setProjectedYearlyIncome] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [customId, setCustomId] = useState(null);
  const [createdExpenses, setCreatedExpenses] = useState([]);
  const router = useRouter();
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const { id } = router.query;
  const updateChanges = async () => {
    const token = await getToken({ template: "codehooks" })
    let savedChanges = {
      name: planName,
      userId: userId,
      location: zipCode,
      isActive: false,
      inProgress: false
    };
    const res = await editPlan(token, userId, id, savedChanges);
    router.push('/plans')
  }

  const deleteChanges = async () => {
    const token = await getToken({ template: "codehooks" })
    await deletePlan(token, userId, id);
    router.push('/plans')
  }

  useEffect(() => {
    getToken({ template: "codehooks" }).then(async (token) => {
      const res =  await getSpecificPlannedExpenses(token, userId, id);
      console.log("res: " + res.length)
      setCreatedExpenses(res);
      if(createdExpenses && createdExpenses.length > 0)
        console.log(id + " expenses: "+ userId + " : " + createdExpenses[0].name);
      setCustomId(null);  
    });
    
  }, [showModal, router])

  const handleExpenseClick = (expense) => {
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedExpense("");
  };

  const handleBackButton = () => {
    router.push("/plans");
  };

  const findZipCode = async (latitude, longitude) => {
    const response = await fetch("/zip.txt");
    const data = await response.text();
    const lines = data.split("\n");

    let closestZipCode = "";
    let minDistance = Infinity;

    for (let i = 0; i < lines.length; i++) {
      const [zip, lat, long] = lines[i].split(",");
      const distance = Math.sqrt(
        Math.pow(latitude - lat, 2) + Math.pow(longitude - long, 2)
      );
      if (distance < minDistance) {
        closestZipCode = zip;
        minDistance = distance;
      }
    }
    setZipCode(closestZipCode);
  };

  const findMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
      await findZipCode(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <>
      <ExpenseModal
        show={showModal}
        expense={selectedExpense}
        handleClose={handleModalClose}
        expenseId={customId}
        planId={id}
      />
      <Head>
        <title>New Plan</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/duckget-logo.png" />
      </Head>
      <div style={{ minHeight: "100vh", backgroundColor: "#E4E4E4" }}>
        <Container fluid className="p-0">
          <div
            className="p-4 w-100 white-box-container"
            style={{ height: "calc(100vh - 130px)", overflowY: "scroll" }}
          >
            <Row>
              <Col xs={3}>
                <img
                  src="/back-arrow.png"
                  onClick={handleBackButton}
                  alt="back arrow"
                />
              </Col>
              <Col xs={6}>
                <h1
                  className="text-center text-wrap"
                  style={{ color: "#472B00" }}
                >
                  Edit Plan
                </h1>
              </Col>
              <Col
                xs={3}
                className="d-flex justify-content-end align-items-center"
              >
                <img
                  src="/duck.png"
                  alt="duck"
                  className="img-fluid"
                  style={{ maxWidth: "150px" }}
                />
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="planName">
                  <Form.Label>
                    <span className="light-brown">Name</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={planName}
                    onChange={(e) => setPlanName(e.target.value)}
                    required
                    style={{
                      background: "#F7E7D5",
                      borderRadius: "11px",
                    }}
                  />
                  <Form.Label>
                    <span className="light-brown">Projected Yearly Income</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    value={projectedYearlyIncome}
                    onChange={(e) => setProjectedYearlyIncome(e.target.value)}
                    required
                    style={{
                      background: "#F7E7D5",
                      borderRadius: "11px",
                    }}
                  />
                  <Form.Label>
                    <span className="light-brown">Zip Code</span>
                  </Form.Label>
                  <div className="input-group">
                  <Form.Control
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    required
                    style={{
                      background: "#F7E7D5",
                      borderRadius: "11px",
                    }}
                  />
                <div className="input-group-append">
                  <span onClick={findMe} className="input-group-text">Find me!</span>
                </div>
                  </div>
                
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <h2 className="text-center mb-4">Expenses</h2>
              </Col>
            </Row>
            <Row>
              <Col className="text-center">
                <img
                  src="/auto.png"
                  alt="Auto"
                  className="img-fluid m-2"
                  style={{ maxWidth: "150px", cursor: "pointer" }}
                  onClick={() => handleExpenseClick("Auto")}
                />
                <img
                  src="/home.png"
                  alt="Home"
                  className="img-fluid m-2"
                  style={{ maxWidth: "150px", cursor: "pointer" }}
                  onClick={() => handleExpenseClick("Home")}
                />
                <img
                  src="/other.png"
                  alt="Other"
                  className="img-fluid m-2"
                  style={{ maxWidth: "150px", cursor: "pointer" }}
                  onClick={() => handleExpenseClick("other")}
                />
              </Col>
            </Row>
            <Row>
              {createdExpenses.map((expense) => {
                return(
                  <Col xs={12} sm={6} md={4} lg={3}>
                  <PlannedExpensesCard
                    plannedExpense={expense}
                    onEdit={() => {
                      setCustomId(expense._id);
                      handleExpenseClick(expense.name);
                    }}
                    onDelete={() => {}}
                  />
                </Col>)
              })}
            </Row>
          </div>
        </Container>
        <div className="p-3 text-center" id="sideBySide">
          <Button
            className="d-block mx-auto"
            style={{
              backgroundColor: "#47B1ED",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
              width: "30%",
              height: "80px",
              border: "none",
              marginBottom: "30px",
            }}
            onClick={updateChanges}
          >
            <h1>Save</h1>
          </Button>
          <Button
            className="d-block mx-auto"
            style={{
              backgroundColor: "#FF1D18",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              borderRadius: "10px",
              width: "30%",
              height: "80px",
              border: "none",
              marginBottom: "30px",
            }}
            onClick={deleteChanges}
          >
            <h1>Delete</h1>
          </Button>
        </div>
      </div>
    </>
  );
}
