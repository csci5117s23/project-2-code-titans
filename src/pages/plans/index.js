import React, { useState } from "react";
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
} from "react-bootstrap";
import Navigation from "@/components/Navigation";
import Head from "next/head";
import { useRouter } from "next/router";
import PlanCard from "@/components/PlanCard";

export default function PlansPage() {
  const [plans, setNewPlans] = useState([
    "yuh",
    "nah",
    "fam",
    "bruh",
    "what",
    "are",
    "you",
    "doing",
  ]);

  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();

  if (!isLoaded) return <></>;
  else if (isLoaded && !userId) router.push("/");
  else {
    const planList = plans.map((plan) => (
      <Col xs={12} lg={4}>
        <PlanCard
          name={plan}
          expenditure={5}
          summaryData={"yeah and?"}
          activeStatus={false}
        />
      </Col>
    ));

    return (
      <>
        <Head>
          <title>Current Plans</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/duckget-logo.png" />
        </Head>
        <Navigation />
        <Container className="mx-auto" style={{ marginTop: "30px" }}>
          <Row>{planList}</Row>
          <div className="d-flex justify-content-center align-items-center">
            <Button
              className="rounded-4 my-10"
              style={{
                width: "80%",
                height: "80px",
                backgroundColor: "#AAE0FF",
                border: "none",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                marginBottom: "10px",
              }}
            >
              <h1>New Plan</h1>
            </Button>
          </div>
        </Container>
      </>
    );
  }
}