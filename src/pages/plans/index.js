import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import "bootstrap/dist/css/bootstrap.min.css";
import { getAllPlans, getAllPlannedExpenses, getSpecificPlannedExpenses, getSinglePlannedExpense } from "@/modules/Data";
import {
  Container,
  Nav,
  Navbar,
  Card,
  Row,
  Col,
  Button,
} from "react-bootstrap";
import { addPlan } from "@/modules/Data";
import Navigation from "@/components/Navigation";
import Head from "next/head";
import { useRouter } from "next/router";
import PlanCard from "@/components/PlanCard";

export default function PlansPage() {
  const [plans, setNewPlans] = useState([]);
  const [totalExpenditure,setTotalExpenditure] = useState(0);

  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    getToken({ template: "codehooks" }).then(async (token) => {
      const res =  await getAllPlans(token, userId);
      console.log("res: " + res.length);
      if(res.length > 0)
        setNewPlans(res);
    });
  }, [router, isLoaded])

  // async function getPlanExpenseInformation(){
  //   getToken({ template: "codehooks" }).then(async (token) => {
  //     const res =  await getAllPlans(token, userId);
  //     console.log("Ressudeep: ");
  //     console.log(res);
  //     // await getSinglePlannedExpense(token, userId, plannedExpenseId)
  //   });
  // }

  if (!isLoaded) return <></>;
  else if (isLoaded && !userId) router.push("/");
  else {
    console.log("Else reached. plans: ");
    console.log(plans);
    console.log("plans[0]");
    console.log(plans[0]);
    let totalExp = 0;
    // getToken({ template: "codehooks" }).then(async (token) => {
    //   (getAllPlans(token, userId)).then((data) => {
    //     // console.log("data[0]._id");
    //     // console.log(data[0]._id); //Id of first plan
    //     data.map((plan) => {
    //       // console.log("plan._id: " + plan._id);
    //       (getAllPlannedExpenses(token,userId).then((res) => {
    //         console.log("res: ");
    //         console.log(res);
    //         res.map((entry) => {
    //           // console.log("entry: ");
    //           // console.log(entry);
    //           console.log("entry.amount: " + entry.amount);
    //           console.log("entry.name: " + entry.name);
    //           // totalExp += entry.amount;
    //         })
    //       }));
    //       // (getSinglePlannedExpense(token,userId,plan._id).then((res) => {
    //       //   console.log("res: ");
    //       //   console.log(res);
    //       //   setTotalExpenditure(res);
    //       //   console.log("expenditure: " + {expenditure});
    //       // }));
    //     })
    //   });
    //   // console.log("res[0]._id");
    //   // console.log(res[0]._id);
    // });
    getToken({ template: "codehooks" }).then(async (token) => {
      (getAllPlannedExpenses(token,userId).then((res) => {
        console.log("res: ");
        console.log(res);
        res.map((entry) => {
          console.log("entry: ");
          console.log(entry);
          // console.log("entry.amount: " + entry.amount);
          // console.log("entry.name: " + entry.name);
          totalExp += entry.amount;
        });
      }))
      // console.log("res[0]._id");
      // console.log(res[0]._id);
    });
    setTotalExpenditure(totalExp);

    // getToken({ template: "codehooks" }).then(async (token) => {
    //   const data = await getSpecificPlannedExpenses(token,userId,data[0]); //First planned expense
    // });
    const planList = plans.map((plan) => (
      <Col xs={12} lg={4}>
        <PlanCard
          name={plan.name}
          expenditure={totalExpenditure}
          summaryData={"yeah and?"}
          id={plan._id}
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
              onClick={async () => {
                const token = await getToken({ template: "codehooks" });
                const res = await addPlan(token, {name: 'fake', userId: userId, location: '00000', isActive: false});
                router.push('/plans/' + res._id);
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
