
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app,Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
// const {Storage} = require('@google-cloud/storage');
import { object, string, boolean, date, number } from 'yup';
import jwtDecode from 'jwt-decode';
const punycode = require('punycode/');

const PlanYup = object({
  name: string().required(),
  userId: string().required(),
  location: string().required(),
  projectedIncome: number().default(0),
  isActive: boolean().required(),
  inProgress: boolean().optional()
})

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
})

const PastExpenseYup = object({
  name: string().required(),
  userId: string().required(),
  amount: number().required().positive(),
  date: date().required().max(new Date())
})

// const { Storage } = require('@google-cloud/storage');
const apiNinjaKey = 'VUqM8pOYRSUXDglRoav+Vg==EuvtIuMkwpPN0t9r';

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

const gcpKey = {
  "type": "service_account",
  "project_id": "duckget",
  "private_key_id": "9ef2f5ff415880d9457f699d4c21cab11e51b998",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCPJawOLUvHtzOm\n7vLhuJ1Cv+WMc5l7yTiXovboKFE4R7J4D9rbNO1WIQH+Gv+KhR9m1mqC6/+sc4CQ\nGxoQ89FxNsE0CxVRo5+4xvsQs51b4og/eECq8MGp8Srvmw8phq15obm3rQKsk+60\nTC+h/VoHYyDAp9sLibK3Pgqs41f+WaYaFY+glS3mvxeciRuzO5dwTYcmCqkVE+GE\nF7LpI627YfZUFX7BFui7sx5BpRc+Sti9KEbu9sJ0q1AdyOeaaOAb/y6iYH8W90MO\npZ27MxzbBgdEizN/+TXkfdOAtjpsnyh/MLvilTWoD/zgNlNnetJEpaWwZK3xOw1W\nd9JCRHMVAgMBAAECggEAHhz/8rSLME6lLk0uqZbveEMLvG32IBEO13F4LRMMMQF+\nNR0qvnoGIpwLggP2dZK3LihVnEiezs22gjo9U8si6ITrBHJ/b97ywwmS9+q9I/8G\nCAoZWoyOxRwfmuu89xCmrkN8IPxjp1/wc5viWlrEhXDQS08UeLslLkC+OKwTzwUG\n54GOtJVn4jA5Isg5MDjHPPiPOgSXzexJCb6JTbG4+z2ZS20/2EmVIqsEN78hPUAG\nj0NBqLFrAfj2rZ/niPyqnTh7ljH9Q1oYy5MKM3Bnh4jNVESmd2kkZmvBxgITeiX3\n+K2gZoYNUpLH5kxms1yXrnMs2c5fdv42y3e9FJvASQKBgQDEZNavk7QKXigZNYHx\n5fTiNoMrtLR6Fo/gTDeE/QHQ9Ua2JdHqwEN4rQ/uqmQBmxg84NgqFgg36OTluMiW\nNsuVPDNwDRgpobF6rZ4klxT0Uh+28BhlfGLHRruQwDT5v0hhZVRJ1JHje9Erx4df\nPXK4tkCY3PyImycK2pSbe2jviQKBgQC6l7x6bmihJxf5ZLuUnlS0Z3Mb82TnBt6s\n/HIXFowIvE9fOhPQlRtAxuiwq339WO/no13ZqHPYg0MMsPtzMyfyVjg8HM7xU1KV\nQIE6C6gLWvzGZY9MaLW/MEyHIpF2mJSRKBnz0Eq/brk4n7jm4f5/xBtfsDXq4oqS\n6CHfZpGYLQKBgEfnz77LKoEdRjssnx4tHsLwSIhpCiclOZpa7XzwkYirNS+dm0UD\nDfESFCJDGoiH+5DWle6a0Hl/+MavKCnveAx01TRyZuVfQTb0eFFXS6HEq730HEqU\nByqFGEmARiUmxt56FilN/fg3LjeEP2k8e1NrzyzoxEFT5TCRJRXkUmBZAoGAavGw\nyxMg0MyRRxVfFa0xqzxnkyuLN4aOdeMymN0JYbBcZZ3p4XC0cAoRL8D6swwYZFET\n5z5PN1b0RP/i/oHhcVnNXVa9nT8+Y+DWsCgiJm/91NA8s3SIRo4uLn23lZuZ+yBa\nz40galvRuQyCc4Iv1ZbWgZ+DJ560AcMeNuaYp/kCgYBS21UwymSp1KwyGMrV2qJi\nzBRS1Xpt3nNsOsWncnOREIdZ7wzhVN24r93XBGJuC70MN3BHnqAEhi+z2MsY2olX\nCDuglXORGKNNZVjH6gNngqRy2WMHzxDj1muo4jbEGzKlWf7HbYbQVD5iIp9C3VEi\noVOVy3vPb9Sr+F7Aaow+Og==\n-----END PRIVATE KEY-----\n",
  "client_email": "duckgetbackend@duckget.iam.gserviceaccount.com",
  "client_id": "106203557928817560558",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/duckgetbackend%40duckget.iam.gserviceaccount.com"
}

// const storage = new Storage({
//   credentials: gcpKey,
//   projectId: 'duckget',
// });

const filename = 'cars.txt';

const bucketName = 'car_info';

const secondFilename = 'avgHomeInsuranceCosts.txt';

const secondBucketName = 'housing_stuff';

// const thirdFilename = 

// const thirdBucketName = 'location_stuff';

// const file = storage.bucket(secondBucketName).file(secondFilename);
// const contents = await file.download();
// const resp = contents;
// const data = resp[0].toString();
// const lines = data.split("\n");

// Sample Data.js function?
// export async function getCarInfo(authToken,userId,carMake,carYear,carModel) {
//   const result = await fetch(`${backend_base}/carPage?userId=${userId}&make=${carMake}&year=${carYear}&model=${carModel}`,{
//     'method':'GET',
//     'headers': {'Authorization': 'Bearer ' + authToken},
//     'X-Api-Key': apiNinjaKey
//   })
//   return await result.json();
// }

async function getStateByZip(zip){
  const api_url = `https://api.api-ninjas.com/v1/zipcode?zip=${zip}`;
  const response = await fetch(api_url, {headers: {
      "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => { console.log(data[0].state); return data[0].state;}).catch(error => console.error(error));
  return response;
}

async function getLoanPayables(amt,interestRate,duration,avgHomeInsurance,propertyTax){
  const api_url = `https://api.api-ninjas.com/v1/mortgagecalculator?loan_amount=${amt}&interest_rate=${interestRate}&duration_years=${duration}&annual_home_insurance=${avgHomeInsurance}&annual_property_tax=${propertyTax}`;
  const response = await fetch(api_url, {headers: {
      "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => {return data.monthly_payment.total;}).catch(error => console.error(error));
  return response;
}

async function getTotalTaxRate(zip){
  const api_url = `https://api.api-ninjas.com/v1/salestax?zip_code=${zip}`;
  const response = await fetch(api_url, {headers: {
      "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => {console.log("Data[0].total_rate: "); console.log(data[0].total_rate); return data[0].total_rate;}).catch(error => console.error(error));
  return response;
}

async function getCarMake(VIN){
  const api_url = `https://api.api-ninjas.com/v1/vinlookup?vin=${VIN}`;
  const response = await fetch(api_url, {headers: {
      "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => {console.log("Data.manufacturer: "); console.log(data.manufacturer); return data.manufacturer;}).catch(error => console.error(error));
  return response;
}

// async function getCarPrice(carMake,carYear,carModel){
//   // await storage.bucket(bucketName).upload(filename, options);
//   // console.log(`File ${filename} uploaded to ${bucketName}.`);

//   const file = storage.bucket(bucketName).file(filename);

//   const contents = await file.download();
//   // console.log(`Contents of ${filename}: ${contents}`);
//   // console.log("CarYear: " + carYear);
//   const response = contents;
//   const data = response[0].toString();
//   const lines = data.split("\n");

//   let avgPrice = 0;
//   let carPriceSum = 0;
//   let numCars = 0;
//   console.log('line length: ' + lines.length)
//   for (let i = 0; i < lines.length; i++) {
//     const [id,price,year,mileage,city,state,vin,make,model] = lines[i].split(",");
//     if(make == carMake && model.includes(carModel) && year == carYear){
//       numCars++;
//       carPriceSum += parseInt(price);
//     }
//   }
//   console.log("Type of carYear: " + typeof(carYear));
//   console.log("All " + carYear + " " + carMake + " " + carModel + " prices total to: " + carPriceSum);
//   console.log("Total number of cars: " + numCars);
//   // let sampleModel = "TL4dr";
//   // console.log("Sample model (TL4dr) includes TL?: " + sampleModel.includes("TL"));
  
//   avgPrice = carPriceSum / numCars;
  
//   console.log("Average Price: " + avgPrice);

//   return avgPrice.toFixed(2);
// }

// async function getCarInfo(VIN){
//   const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
//   const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data:"); console.log(data); return data;}).catch(error => console.error(error));
//   return response;
// }

async function getCarModel(VIN){
  const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
  const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data.Results[9].Value"); console.log(data.Results[9].Value); return data.Results[9].Value;}).catch(error => console.error(error));
  return response;
}

async function getValuableCarInfo(VIN){
  const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
  const info1 = await fetch(api_url).then(response => response.json()).then((data) => {
    return [data.Results[7].Value.charAt(0) + data.Results[7].Value.slice(1).toLowerCase(),data.Results[9].Value,data.Results[10].Value];
  }).catch(error => console.error(error));
  // const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data"); console.log(data.Results[9].Value); return [data.Results[7].Value,data.Results[9].Value,data.Results[10].Value];}).catch(error => console.error(error));
  const price = await getCarPrice(info1[0],info1[2],info1[1]);
  const info = {
    'make': info1[0],
    'model': info1[1],
    'year': info1[2],
    'price': price
  };
  return info;
}

// async function getAvgHomeInsuranceCost(state){

//   const file = storage.bucket(secondBucketName).file(secondFilename);

//   const contents = await file.download();
//   // console.log(`Contents of ${filename}: ${contents}`);
//   // console.log("CarYear: " + carYear);
//   const response = contents;
//   const data = response[0].toString();
//   const lines = data.split("\n");
  
//   let avgCostPercent = 0;
//   let propertyTaxPercent = 0;
//   let rentInsurance = 0;

//   for (let i = 0; i < lines.length; i++) {
//     const [stateAbbr,cost,propertyTax,rentersInsurance] = lines[i].split(",");
//     if(stateAbbr == state){
//       avgCostPercent = (cost / 250000);
//       propertyTaxPercent = propertyTax;
//       rentInsurance = rentersInsurance;
//     }
//   }
  
//   console.log("Average Insurance cost (%) for " + state + ": " + avgCostPercent);
//   console.log("Property tax (%): " + propertyTaxPercent);
//   console.log("Renters insurance: " + rentInsurance);

//   return [avgCostPercent,propertyTaxPercent,rentInsurance];
// }

function getCarPaidInFull(price,tax){
  return price * (1 + parseFloat(tax));
}

app.get('/getState', async (req, res) => {
  const response = await getStateByZip(req.query.zip);
  res.send(response.toString());
});

// Totalcost, downpayment, APR, loan term
app.get('/getHomePrice', async (req, res) => {
  const response = getStateByZip(req.query.zip).then((state) => getAvgHomeInsuranceCost(state)).then((insurance) => 
  getLoanPayables(req.query.amt,req.query.apr,req.query.term,insurance[0] * req.query.amt,insurance[1] * req.query.amt));
  // const state = await getStateByZip(req.query.zip);
  // const youHaveAHouseButNoInsurance = await getAvgHomeInsuranceCost(state);
  // const response = await getLoanPayables(req.query.amt,req.query.apr,req.query.term,youHaveAHouseButNoInsurance[0] * req.query.amt,youHaveAHouseButNoInsurance[1] * req.query.amt);
  // const response = await getLoanPayables(req.query.amt,req.query.apr,req.query.term,insurance[0] * req.query.amt,insurance[1] * req.query.amt);
  res.send((await response).toString());
});

app.get('/getAptPrice', async (req, res) => {
  const response = getStateByZip(req.query.zip).then((state) => getAvgHomeInsuranceCost(state)).then((insurance) => getLoanPayables(req.query.amt * 12,0.1,1,insurance[2],0));
  // const state = await getStateByZip(req.query.zip);
  // const youHaveAHouseButNoInsurance = await getAvgHomeInsuranceCost(state);
  // const response = await getLoanPayables(req.query.amt,req.query.apr,req.query.term,youHaveAHouseButNoInsurance[0] * req.query.amt,youHaveAHouseButNoInsurance[1] * req.query.amt);
  // const response = await getLoanPayables(req.query.amt * 12,0.1,1,insurance[2],0);
  res.send((await response).toString());
});

app.get('/buyCarInFull', async (req, res) => {
  const response = getTotalTaxRate(req.query.zip).then((tax) => {return getCarPaidInFull(req.query.price,tax)});
  res.send((await response).toString());
});

app.get('/getCarLoanPayments', async (req, res) => {
  const response = await getLoanPayables(req.query.amt,req.query.apr,req.query.term,0,0);
  res.send(response.toString());
});

app.get('/getTaxRate', async (req, res) => {
  const response = await getTotalTaxRate(req.query.zip);
  res.send(response.toString());
});

app.get('/getCarMake', async (req, res) => {
  const response = await getCarMake(req.query.vin);
  res.send(response.toString());
});

app.get('/getCarPrice', async (req, res) => {
  const response = await getCarPrice(req.query.carMake,req.query.carYear,req.query.carModel);
  res.send(response.toString());
});

app.get('/getTaxedAmount', async (req, res) => {
  const response = getTotalTaxRate(req.query.zip).then((tax) => (1 + parseFloat(tax)) * req.query.amount);
  res.send((await response).toString());
});

app.get('/getCarModel', async (req, res) => {
  const response = await getCarInfo(req.query.vin);
  res.send(response);
});

app.get('/getValuableCarInfo', async (req, res) => {
  const response = await getValuableCarInfo(req.query.vin);
  res.send(response);
});


app.get('/calculateCarPrice', async (req, res) => {
  console.log("In /carPage");
  const db = await Datastore.open();
  const data = await db.replaceOne('plans',req.query._id,req.body);

  res.send((await getAcuras("Acura","2014","TL")).toString());
});

app.delete('/deletePlan', async (req, res) => {
  const db = await Datastore.open();
  const data = await db.removeOne('plans',req.query._id);
  res.json(data);
});

app.delete('/deletePlanned', async (req, res) => {
  const db = await Datastore.open();
  const data = await db.removeOne('plannedExpenses',req.query._id);
  res.json(data);
});

app.delete('/deletePast', async (req, res) => {
  const db = await Datastore.open();
  const data = await db.removeOne('pastExpenses',req.query._id);
  res.json(data);
});

app.put('/updatePlan', async (req, res) => {
  const db = await Datastore.open();
  const data = await db.updateOne('plans',req.query._id, req.body);
  res.json(data);
});

app.put('/updatePlannedExpense', async (req, res) => {
  const db = await Datastore.open();
  const data = await db.updateOne('plannedExpenses',req.query._id, req.body);
  res.json(data);
});

app.put('/updatePastExpense', async (req, res) => {
  const db = await Datastore.open();
  const data = await db.updateOne('pastExpenses',req.query._id, req.body);
  res.json(data);
});

// app.use(getAcuras);
// Use Crudlify to create a REST API for any collection
crudlify(app, {plans: PlanYup, plannedExpenses: PlannedExpenseYup, pastExpenses: PastExpenseYup})

// bind to serverless runtime
export default app.init();
