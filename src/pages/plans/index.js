import React, { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
// const {Storage} = require('@google-cloud/storage');
import "bootstrap/dist/css/bootstrap.min.css";
import {
  getAllPlans,
  getAllPlannedExpenses,
  getSpecificPlannedExpenses,
  getSinglePlannedExpense,
} from "@/modules/Data";
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
import Loader from "@/components/Loader";

export default function PlansPage() {
  const [plans, setNewPlans] = useState([]);
  const [planNames, setPlanNames] = useState([]);
  const [spendingData, setSpendingData] = useState([]);
  const [nameToSpendingData, setNameToSpendingData] = useState([]);
  const [totalExpenditure, setTotalExpenditure] = useState(0);
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const [ isLoading, setIsLoading ] = useState(true);
  const router = useRouter();

  // useEffect(() => {
  //   const getTotalExp = async (plan) => {
  //     return await getToken({ template: "codehooks" }).then(async (token) => {
  //       return await getSpecificPlannedExpenses(token, userId, plan._id).then((res) => {
  //         let totalExp = 0;
  //         const planNames = [];
  //         const spendingData = [];
  //         res.map((entry) => {
  //           console.log("entry.amount: " + entry.amount);
  //           console.log("entry.name: " + entry.name);
  //           planNames.push(entry.name);
  //           spendingData.push(entry.amount);
  //           console.log(planNames);
  //           console.log(spendingData);
  //           totalExp += entry.amount;
  //         });
  //         console.log("total exp: " + totalExp);
  //         return {
  //           totalExp: totalExp.toFixed(2),
  //           planNames: planNames,
  //           spendingData: spendingData
  //         };
  //       });
  //     });
  //   }

  //   getToken({ template: "codehooks" }).then(async (token) => {
  //     const res = await getAllPlans(token, userId);
  //     console.log("res1: " + res.length);
  //     if (res.length > 0){
  //       setNewPlans(await Promise.all(res.map(async (plan) => {
  //         const { totalExp, planNames, spendingData } = await getTotalExp(plan);
  //         console.log("we made it here with totalExp: " + totalExp);
  //         return(
  //           <Col xs={12} lg={4}>
  //             <PlanCard
  //               name={plan.name}
  //               expenditure={totalExp}
  //               labels={planNames}
  //               spendingData={spendingData}
  //               summaryData={"yeah and?"}
  //               id={plan._id}
  //               activeStatus={false}
  //             />
  //           </Col>
  //         );
  //       })));
  //     }
  //   });
  // }, [router, isLoaded]);

  useEffect(() => {
    setIsLoading(true);
    const getTotalExp = async (plan) => {
      setIsLoading(true);
      return await getToken({ template: "codehooks" }).then(async (token) => {
        return await getSpecificPlannedExpenses(token, userId, plan._id).then(
          (res) => {
            let totalExp = 0;
            const nameToSpendingData = new Map();
            res.map((entry) => {
              console.log("entry.amount: " + entry.amount);
              console.log("entry.name: " + entry.name);
              if (nameToSpendingData.has(entry.name)) {
                nameToSpendingData.set(
                  entry.name,
                  nameToSpendingData.get(entry.name) + entry.amount
                );
              } else {
                nameToSpendingData.set(entry.name, entry.amount);
              }
              console.log(nameToSpendingData);
              totalExp += entry.amount;
            });
            console.log("total exp: " + totalExp);
            setIsLoading(false);
            return {
              totalExp: totalExp.toFixed(2),
              nameToSpendingData: nameToSpendingData,
            };
          }
        );
      });
    };

    getToken({ template: "codehooks" }).then(async (token) => {
      const res = await getAllPlans(token, userId);
      console.log("res1: " + res.length);
      if (res.length > 0) {
        setNewPlans(
          await Promise.all(
            res.map(async (plan) => {
              const { totalExp, nameToSpendingData } = await getTotalExp(plan);
              console.log("we made it here with totalExp: " + totalExp);
              const planNames = Array.from(nameToSpendingData.keys());
              const spendingData = Array.from(nameToSpendingData.values());
              return (
                <Col xs={12} lg={4}>
                  <PlanCard
                    name={plan.name}
                    expenditure={totalExp}
                    labels={planNames}
                    spendingData={spendingData}
                    summaryData={"yeah and?"}
                    id={plan._id}
                    activeStatus={false}
                  />
                </Col>
              );
            })
          )
        );
      }
      setIsLoading(false);
    });
  }, [router, isLoaded]);

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
    return (
      <>
        {isLoading && (
          <div className="loader-container">
            <Loader />
          </div>
        )}
        <Head>
          <title>Current Plans</title>
          <meta name="description" content="Generated by create next app" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/duckget-logo.png" />
        </Head>
        <Navigation />
        <Container className="mx-auto" style={{ marginTop: "30px" }}>
          <Row>{plans}</Row>
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
                const res = await addPlan(token, {
                  name: " ",
                  userId: userId,
                  location: "00000",
                  isActive: false,
                  inProgress: true,
                });
                router.push("/plans/" + res._id);
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
