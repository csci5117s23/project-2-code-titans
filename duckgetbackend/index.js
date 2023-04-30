
/*
* Auto generated Codehooks (c) example
* Install: npm i codehooks-js codehooks-crudlify
*/
import {app, Datastore} from 'codehooks-js'
import {crudlify} from 'codehooks-crudlify'
import { date, object, string, number, boolean} from 'yup';
import jwtDecode from 'jwt-decode';

const { Storage } = require('@google-cloud/storage');

// test route for https://<PROJECTID>.api.codehooks.io/dev/
app.get('/', (req, res) => {
  res.send('CRUD server ready')
})

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

const storage = new Storage({
  credentials: gcpKey,
  projectId: 'duckget',
});

const filename = 'cars.txt';

const bucketName = 'car_info';



const getAcuras = async function (carMake,carYear,carModel){
  // await storage.bucket(bucketName).upload(filename, options);
  // console.log(`File ${filename} uploaded to ${bucketName}.`);

  const file = storage.bucket(bucketName).file(filename);

  const contents = await file.download();
  // console.log(`Contents of ${filename}: ${contents}`);
  // console.log("CarYear: " + carYear);
  const response = contents;
  const data = response[0].toString();
  const lines = data.split("\n");

  let avgPrice = 0;
  let carPriceSum = 0;
  let numCars = 0;
  console.log('line length: ' + lines.length)
  for (let i = 0; i < lines.length; i++) {
    const [id,price,year,mileage,city,state,vin,make,model] = lines[i].split(",");
    if(make == carMake && model.includes(carModel) && year == carYear){
      numCars++;
      carPriceSum += parseInt(price);
    }
  }
  console.log("Type of carYear: " + typeof(carYear));
  console.log("All " + carYear + " " + carMake + " " + carModel + " prices total to: " + carPriceSum);
  console.log("Total number of cars: " + numCars);
  // let sampleModel = "TL4dr";
  // console.log("Sample model (TL4dr) includes TL?: " + sampleModel.includes("TL"));
  
  avgPrice = carPriceSum / numCars;
  
  console.log("Average Price: " + avgPrice);

  return avgPrice;
}



app.get('/pongal', async (req, res) => {
  console.log("Woo PongaloPongal");

  res.send((await getAcuras("Acura","2014","TL")).toString());
});

// app.use(getAcuras);
// Use Crudlify to create a REST API for any collection
crudlify(app)

// bind to serverless runtime
export default app.init();
