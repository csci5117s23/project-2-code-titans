import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';

const apiNinjaKey = 'VUqM8pOYRSUXDglRoav+Vg==EuvtIuMkwpPN0t9r';

export default function CostCalculator(){
    const [loanAmt,setLoanAmt] = useState("Click to get your loan amount!");
    const [taxRate,setTaxRate] = useState("Click to get your tax rate!");
    const [carMake,setCarMake] = useState("Enter your VIN and find the Manufacturer!");
    const [carPrice,setCarPrice] = useState("Click to get your estimated car price!");

    const [carYear,setCarYear] = useState(null);
    const [carModel,setCarModel] = useState(null);
    const [carVIN,setCarVIN] = useState(null);

    const [principal,setPrincipal] = useState(0);
    const [intRate,setIntRate] = useState(0);
    const [loanDuration,setLoanDuration] = useState(0);

    const [zipcode,setZipcode] = useState(null);
    const [state,setState] = useState("Click to find your state!");
    const [avgHomeInsuranceCost,setAvgHomeInsuranceCost] = useState(0);

    const { isLoaded, userId, isSignedIn, getToken } = useAuth();

    // useEffect(() => {}, [isLoaded,loanAmt])

    async function getValues(principal,intRate,loanDuration,avgHomeInsurance){
        console.log("getValues function reached");
        // setLoanAmt(calcCost.getLoanPayables(200000,3.5,30));
        setLoanAmt(await getLoanPayables(principal,intRate,loanDuration,avgHomeInsurance));
        return loanAmt;
    }
    
    async function getZipTax(){
        console.log("getZipTax function reached");
        // setLoanAmt(calcCost.getLoanPayables(200000,3.5,30));
        setTaxRate(await getTotalTaxRate(55414));
        return taxRate;
    }

    // Yennodu VIN L5YZCABP1N1146187
    async function getCarManufacturer(VIN){
        console.log("getCarManufacturer function reached");
        setCarVIN(VIN);
        setCarMake(await getCarMake(VIN));
        setCarYear(await getCarYear(VIN));
        setCarModel(await getCarModel(VIN));
        return carMake;
    }

    async function getStateOfZipCode(zip){
        console.log("getStateOfZipcode function reached");
        setState(await getStateByZip(zip));
        setAvgHomeInsuranceCost(await getAvgHomeInsuranceCost(state));
        return state;
    }

    async function getCarPriceEstimate(carMake,carYear,carModel){
        console.log("getCarPriceEstimate function reached");
        setCarPrice(await getCarPrice(carMake,carYear,carModel));
        return carPrice;
    }

    return (
        <>
            <h3>Enter your zipcode to find the state</h3>
            <textarea placeholder="Enter 5 digit zipcode" onChange={(e) => setZipcode(e.target.value)}></textarea>
            <button onClick={async () => getStateOfZipCode(zipcode)}>{state}</button>
            <h3>Loan amount payable per month:</h3><br></br>
            <textarea placeholder="Enter your house loan amount" onChange={(e) => setPrincipal(e.target.value)}></textarea>
            <textarea placeholder="Enter the (%) interest rate on your loan" onChange={(e) => setIntRate(e.target.value)}></textarea>
            <textarea placeholder="Enter the duration of the loan period" onChange={(e) => setLoanDuration(e.target.value)}></textarea>
            <button onClick={async () => getValues(principal,intRate,loanDuration,avgHomeInsuranceCost)}>{loanAmt}</button>
            <h3>Total tax Rate for your zip code:</h3>
            <button onClick={getZipTax}>{taxRate}</button>
            <h3>Get Car Make:</h3>
            <textarea placeholder="Enter your VIN" onChange={(e) => getCarManufacturer(e.target.value)}></textarea>
            <h5>{carMake}</h5>
            <h3>Get Car Price:</h3>
            <button onClick={async () => {getCarPriceEstimate(carMake,carYear,carModel)}}>{carPrice}</button>
        </>
    );
}

async function getStateByZip(zip){
    const api_url = `https://api.api-ninjas.com/v1/zipcode?zip=${zip}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
      }}).then(response => response.json()).then(data => { console.log(data[0].state); return data[0].state;}).catch(error => console.error(error));
    return response;
}

async function getLoanPayables(amt,interestRate,duration,avgHomeInsurance){
    const api_url = `https://api.api-ninjas.com/v1/mortgagecalculator?loan_amount=${amt}&interest_rate=${interestRate}&duration_years=${duration}&annual_home_insurance=${avgHomeInsurance}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
      }}).then(response => response.json()).then(data => {return data.monthly_payment.total;}).catch(error => console.error(error));
    return response;
}

// This is to get the total tax rate (including any additional, city, county and state taxes)
async function getTotalTaxRate(zip){
    const api_url = `https://api.api-ninjas.com/v1/salestax?zip_code=${zip}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
      }}).then(response => response.json()).then(data => {console.log("Data[0].total_rate: "); console.log(data[0].total_rate); return data[0].total_rate;}).catch(error => console.error(error));
    return response;
}

// This is to get the city tax rate
// async function getCityTaxRate(zip){
//     const api_url = `https://api.api-ninjas.com/v1/salestax?zip_code=${zip}`;
//     const response = await fetch(api_url, {headers: {
//         "X-Api-Key": apiNinjaKey
//       }}).then(response => response.json()).then(data => {console.log("Data[0].city_rate: "); console.log(data[0].city_rate); return data[0].city_rate;}).catch(error => console.error(error));
//     return response;
// }

//Getting the manufacturer/make of the car (i.e. Acura, Buick etc.)
async function getCarMake(VIN){
    const api_url = `https://api.api-ninjas.com/v1/vinlookup?vin=${VIN}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
      }}).then(response => response.json()).then(data => {console.log("Data.manufacturer: "); console.log(data.manufacturer); return data.manufacturer;}).catch(error => console.error(error));
    return response;
}

//Getting the year the car was made (i.e. 2015, 2022 etc.)
async function getCarYear(VIN){
    const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
    const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data.Results[10].Value"); console.log(data.Results[10].Value); return data.Results[10].Value;}).catch(error => console.error(error));
    return response;
}

async function getCarPrice(carMake,carYear,carModel){
    console.log("CarYear: " + carYear);
    const response = await fetch("/cars.txt");
    const data = await response.text();
    const lines = data.split("\n");

    let avgPrice = 0;
    let carPriceSum = 0;
    let numCars = 0;

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

async function getCarModel(VIN){
    const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
    const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data.Results[9].Value"); console.log(data.Results[9].Value); return data.Results[9].Value;}).catch(error => console.error(error));
    return response;
}

async function getAvgHomeInsuranceCost(state){
    const response = await fetch("/avgHomeInsuranceCosts.txt");
    const data = await response.text();
    const lines = data.split("\n");

    let avgCost = 0;

    for (let i = 0; i < lines.length; i++) {
      const [stateAbbr,cost] = lines[i].split(",");
      if(stateAbbr == state){
        avgCost = cost;
      }
    }
    
    console.log("Average Insurance cost for " + state + ": " + avgCost);

    return avgCost;
}