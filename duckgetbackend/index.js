import { app, Datastore } from "codehooks-js";
import { crudlify } from "codehooks-crudlify";
import { object, string, boolean, date, number } from "yup";
import jwtDecode from "jwt-decode";
import {
  getStateByZip,
  getLoanPayables,
  getTotalTaxRate,
  getCarMake,
  getCarPaidInFull,
  getValuableCarInfo,
  getCarPrice,
  getAvgHomeInsuranceCost,
} from "../src/modules/utilsCost";

const PlanYup = object({
  name: string().required(),
  userId: string().required(),
  location: string().required(),
  projectedIncome: number().default(0),
  isActive: boolean().required(),
  inProgress: boolean().optional(),
});

const PlannedExpenseYup = object({
  name: string().required(),
  userId: string().required(),
  amount: number().required().positive(), // need to do a check at the frontend for whether the expense is at least $0.01
  planId: string().required(),
  dueDate: date().required().min(new Date()), // the date of the planned expense cannot be before today
  carModel: string().optional(),
  carMake: string().optional(),
  carYear: date().optional(),
  carVin: string().optional(),
  apr: number().optional(),
  term: number().optional(),
  downPayment: number().optional(),
});

const PastExpenseYup = object({
  name: string().required(),
  userId: string().required(),
  amount: number().required().positive(),
  date: string().required(),
});

// test route for https://<PROJECTID>.api.codehooks.io/dev/
app.get("/", (req, res) => {
  res.send("CRUD server ready");
});

// This can largely be copy-pasted, it just grabs the authorization token and parses it, stashing it on the request. from Professor Kluver's example repo
const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace("Bearer ", "");
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    }
    next();
  } catch (error) {
    res.status(403);
    res.json(error).end();
  }
};
app.use(userAuth);

app.get("/getState", async (req, res) => {
  const response = await getStateByZip(req.query.zip);
  res.send(response.toString());
});

// Totalcost, downpayment, APR, loan term
app.get("/getHomePrice", async (req, res) => {
  const response = getStateByZip(req.query.zip)
    .then((state) => getAvgHomeInsuranceCost(state))
    .then((insurance) =>
      getLoanPayables(
        req.query.amt,
        req.query.apr,
        req.query.term,
        insurance[0] * req.query.amt,
        insurance[1] * req.query.amt
      )
    );
  res.send((await response).toString());
});

app.get("/getAptPrice", async (req, res) => {
  const response = getStateByZip(req.query.zip)
    .then((state) => getAvgHomeInsuranceCost(state))
    .then((insurance) =>
      getLoanPayables(req.query.amt * 12, 0.1, 1, insurance[2], 0)
    );
  res.send((await response).toString());
});

app.get("/buyCarInFull", async (req, res) => {
  const response = getTotalTaxRate(req.query.zip).then((tax) => {
    return getCarPaidInFull(req.query.price, tax);
  });
  res.send((await response).toString());
});

app.get("/getCarLoanPayments", async (req, res) => {
  const response = await getLoanPayables(
    req.query.amt,
    req.query.apr,
    req.query.term,
    0,
    0
  );
  res.send((await response).toString());
});

app.get("/getTaxRate", async (req, res) => {
  const response = await getTotalTaxRate(req.query.zip);
  res.send(response.toString());
});

app.get("/getCarMake", async (req, res) => {
  const response = await getCarMake(req.query.vin);
  res.send(response.toString());
});

app.get("/getCarPrice", async (req, res) => {
  const response = await getCarPrice(
    req.query.carMake,
    req.query.carYear,
    req.query.carModel
  );
  res.send(response.toString());
});

app.get("/getTaxedAmount", async (req, res) => {
  const response = getTotalTaxRate(req.query.zip).then(
    (tax) => (1 + parseFloat(tax)) * req.query.amount
  );
  res.send((await response).toString());
});

app.get("/getCarModel", async (req, res) => {
  const response = await getCarInfo(req.query.vin);
  res.send(response);
});

app.get("/getValuableCarInfo", async (req, res) => {
  const response = await getValuableCarInfo(req.query.vin);
  res.send(response);
});

app.get("/calculateCarPrice", async (req, res) => {
  const db = await Datastore.open();
  const data = await db.replaceOne("plans", req.query._id, req.body);

  res.send((await getAcuras("Acura", "2014", "TL")).toString());
});

app.delete("/deletePlan", async (req, res) => {
  const db = await Datastore.open();
  const data = await db.removeOne("plans", req.query._id);
  res.json(data);
});

app.delete("/deletePlanned", async (req, res) => {
  const db = await Datastore.open();
  const data = await db.removeOne("plannedExpenses", req.query._id);
  res.json(data);
});

app.delete("/deletePast", async (req, res) => {
  const db = await Datastore.open();
  const data = await db.removeOne("pastExpenses", req.query._id);
  res.json(data);
});

app.put("/updatePlan", async (req, res) => {
  const db = await Datastore.open();
  const data = await db.updateOne("plans", req.query._id, req.body);
  res.json(data);
});

app.put("/updatePlannedExpense", async (req, res) => {
  const db = await Datastore.open();
  const data = await db.updateOne("plannedExpenses", req.query._id, req.body);
  res.json(data);
});

app.put("/updatePastExpense", async (req, res) => {
  const db = await Datastore.open();
  const data = await db.updateOne("pastExpenses", req.query._id, req.body);
  res.json(data);
});

// Use Crudlify to create a REST API for any collection
crudlify(app, {
  plans: PlanYup,
  plannedExpenses: PlannedExpenseYup,
  pastExpenses: PastExpenseYup,
});

// bind to serverless runtime
export default app.init();
