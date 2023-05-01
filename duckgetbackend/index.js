
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app,Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { object, string, boolean, date, number } from 'yup';
import jwtDecode from 'jwt-decode';

const PlanYup = object({
  name: string().required(),
  userId: string().required(),
  location: string().required(),
  isActive: boolean().required()
})

const PlannedExpenseYup = object({
  name: string().required(),
  userId: string().required(),
  amount: number().required().positive(), // need to do a check at the frontend for whether the expense is at least $0.01
  planId: string().required(),
  dueDate: date().required().min(new Date()) // the date of the planned expense cannot be before today
})

const PastExpenseYup = object({
  name: string().required(),
  userId: string().required(),
  amount: number().required().positive(),
  date: date().required().max(new Date())
})

// test route for https://<PROJECTID>.api.codehooks.io/dev/
app.get('/', (req, res) => {
  res.send('CRUD server ready')
})

// This can largely be copy-pasted, it just grabs the authorization token and parses it, stashing it on the request. from Professor Kluver's example repo
const userAuth = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (authorization) {
      const token = authorization.replace('Bearer ','');
      // NOTE this doesn't validate, but we don't need it to. codehooks is doing that for us.
      const token_parsed = jwtDecode(token);
      req.user_token = token_parsed;
    } // might need an else here if auth not given
    next();
  } catch (error) {
    console.log(error);
    res.status(403);
    res.json(error).end();
  } 
}
app.use(userAuth)

// Use Crudlify to create a REST API for any collection
crudlify(app)

// bind to serverless runtime
export default app.init();
