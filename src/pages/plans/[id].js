import React, { useEffect, useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import Head from "next/head";
import { useRouter } from "next/router";

import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button, Form } from "react-bootstrap";

import ExpenseModal from "@/components/ExpenseModal";
import Loader from "@/components/Loader";
import PlannedExpensesCard from "@/components/PlannedExpensesCard";

import {
  editPlan,
  getSpecificPlannedExpenses,
  deletePlan,
  getPlan,
  addPlannedExpense,
  editPlannedExpense,
  deletePlannedExpense,
  getSinglePlannedExpense,
} from "@/modules/Data";

export default function NewPlanPage() {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedExpense, setSelectedExpense] = useState("");
  const [planName, setPlanName] = useState(null);
  const [projectedYearlyIncome, setProjectedYearlyIncome] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [active, setActive] = useState(false);
  const [inProgress, setInProgress] = useState(false);
  const [customId, setCustomId] = useState(null);
  const [createdExpenses, setCreatedExpenses] = useState([]);
  const [editedExpenses, setEditedExpenses] = useState(true);
  const [editingBool, setEditingBool] = useState(false);
  const router = useRouter();
  const { isLoaded, userId, getToken } = useAuth();
  const { id } = router.query;

  const updateChanges = async () => {
    setIsLoading(true);
    if (
      planName.trim() === "" ||
      zipCode.trim() === "" ||
      projectedYearlyIncome.trim() === ""
    )
      return;
    const token = await getToken({ template: "codehooks" });
    let savedChanges = {
      name: planName,
      userId: userId,
      location: zipCode,
      projectedIncome: projectedYearlyIncome,
      isActive: active,
      inProgress: false,
    };
    router.push("/plans");
    const res = editPlan(token, userId, id, savedChanges).then(() => {});
    setIsLoading(false);
  };

  const deleteChanges = async () => {
    const token = await getToken({ template: "codehooks" });
    await deletePlan(token, userId, id);
    router.push("/plans");
  };

  useEffect(() => {
    setIsLoading(true);
    getToken({ template: "codehooks" }).then(async (token) => {
      getSpecificPlannedExpenses(token, userId, id).then((res) => {
        setCreatedExpenses(res);
        if (res && res.length > 0) setEditedExpenses(false);
        setIsLoading(false);
      });
    });
  }, [showModal, router, isLoaded, editedExpenses]);

  useEffect(() => {
    setIsLoading(true);
    getToken({ template: "codehooks" }).then(async (token) => {
      async function process() {
        if (id) {
          const res = (await getPlan(token, userId, id))[0];

          return res;
        }
      }
      process()
        .then((res) => {
          setPlanName(res.inProgress ? null : res.name);
          setZipCode(res.inProgress ? null : res.location);
          setProjectedYearlyIncome(res.inProgress ? null : res.projectedIncome);
          setActive(res.isActive);
          setInProgress(res.inProgress);
        })
        .catch(() => {});
      setIsLoading(false);
    });
  }, [router, isLoaded]);

  const handleExpenseClick = (expense) => {
    setEditingBool(false);
    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleExpenseEdit = (expense) => {
    setEditingBool(true);

    setSelectedExpense(expense);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setSelectedExpense("");
    setEditedExpenses(true);
  };

  const handleBackButton = () => {
    router.push("/plans");
  };

  const handleExpenseDelete = async (plannedExpenseId) => {
    const token = await getToken({ template: "codehooks" });
    deletePlannedExpense(token, userId, plannedExpenseId).then(() =>
      setEditedExpenses(true)
    );
  };

  const findZipCode = async (latitude, longitude) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const findMe = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        await findZipCode(position.coords.latitude, position.coords.longitude);
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
    setIsLoading(false);
  };
  useEffect(() => {
    const checkValidity = async () => {
      const token = await getToken({ template: "codehooks" });
      return (await getPlan(token, userId, id)).length > 0;
    };
    if (isLoaded && userId) {
      checkValidity().then((res) => {
        if (!res) router.push("/404");
      });
    }
  }, [isLoaded, router]);

  return (
    <>
      {(isLoading || !isLoaded || !userId) && (
        <div className="loader-container">
          <Loader />
        </div>
      )}
      <ExpenseModal
        show={showModal}
        expense={selectedExpense}
        handleClose={handleModalClose}
        expenseId={customId}
        planId={id}
        location={zipCode}
        addExpense={addPlannedExpense}
        editExpense={editPlannedExpense}
        getSingleExpense={getSinglePlannedExpense}
        editing={editingBool}
      />
      <Head>
        <title>{inProgress ? "New Plan" : "Edit Plan"}</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/duckget-logo.png" />
      </Head>
      <div style={{ minHeight: "100vh", backgroundColor: "#E4E4E4" }}>
        <Form>
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
                    {inProgress ? "New Plan" : "Edit Plan"}
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
                      placeholder="Enter Plan Name"
                      required
                      style={{
                        background: "#F7E7D5",
                        borderRadius: "11px",
                      }}
                    />
                    <Form.Control.Feedback></Form.Control.Feedback>
                    <Form.Label>
                      <span className="light-brown">
                        Projected Yearly Income
                      </span>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      value={projectedYearlyIncome}
                      onChange={(e) => setProjectedYearlyIncome(e.target.value)}
                      placeholder="Enter Projected Yearly Income"
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
                        type="number"
                        value={zipCode}
                        onChange={(e) => {
                          const zipCodeFixed = e.target.value
                            .replace("/.", "")
                            .replace("/+", "");
                          setZipCode(zipCodeFixed);
                        }}
                        placeholder="Enter Zip Code"
                        required
                        style={{
                          background: "#F7E7D5",
                          borderRadius: "11px",
                        }}
                      />
                      <div className="input-group-append">
                        <span onClick={findMe} className="input-group-text bg-info" style={{cursor: "pointer", userSelect: "none"}}>
                          Find me!
                        </span>
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
                  return (
                    <Col xs={12} sm={6} md={4} lg={3}>
                      <PlannedExpensesCard
                        plannedExpense={expense}
                        onEdit={() => {
                          setCustomId(expense._id);
                          handleExpenseEdit(expense.name);
                        }}
                        onDelete={async () =>
                          await handleExpenseDelete(expense._id)
                        }
                      />
                    </Col>
                  );
                })}
              </Row>
            </div>
          </Container>
          <div className="p-3 text-center" id="sideBySide">
            <Button
              className="d-block mx-auto"
              type="submit"
              style={{
                backgroundColor: "#47B1ED",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                borderRadius: "10px",
                width: "30%",
                height: "80px",
                border: "none",
                marginBottom: "30px",
              }}
              onClick={() => {
                if (planName != null && zipCode != null) updateChanges();
              }}
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
        </Form>
      </div>
    </>
  );
}
