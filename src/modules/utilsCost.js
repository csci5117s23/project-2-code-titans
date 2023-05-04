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
    const [rentAmount,setRentAmount] = useState("Click to get your monthly apartment rent");

    const [state,setState] = useState("Click to find your state!");
    const [zipcode,setZipcode] = useState(null);
    const [avgHomeInsuranceCost,setAvgHomeInsuranceCost] = useState(0);
    const [curPropertyTax,setCurPropertyTax] = useState(0);
    const [avgRentersInsurance,setAvgRentersInsurance] = useState(0);

    const { isLoaded, userId, isSignedIn, getToken } = useAuth();

    // useEffect(() => {}, [isLoaded,state]);

    

    // return (
    //     <>
    //         <h3>Enter your zipcode to find the state</h3>
    //         <textarea placeholder="Enter 5 digit zipcode" onChange={(e) => setZipcode(e.target.value)}></textarea>
    //         <button onClick={async () => getStateOfZipCode(zipcode)}>{state}</button>
    //         <h3>House Loan amount payable per month:</h3><br></br>
    //         <textarea placeholder="Enter your house loan amount" onChange={(e) => setPrincipal(e.target.value)}></textarea>
    //         <textarea placeholder="Enter the (%) interest rate on your loan" onChange={(e) => setIntRate(e.target.value)}></textarea>
    //         <textarea placeholder="Enter the duration of the loan period" onChange={(e) => setLoanDuration(e.target.value)}></textarea>
    //         <button onClick={async () => getValues(principal,intRate,loanDuration,avgHomeInsuranceCost * principal,curPropertyTax * principal)}>{loanAmt}</button>
    //         <h3>Rent amount payable per month:</h3>
    //         <textarea placeholder="Enter monthly rent payment" onChange={(e) => setRentAmount(e.target.value)}></textarea>
    //         <button onClick={async () => getValues(rentAmount * 12,0.1,1,avgRentersInsurance,0)}>{loanAmt}</button>
    //         <h3>Total tax Rate for your zip code:</h3>
    //         <button onClick={getZipTax}>{taxRate}</button>
    //         <h3>Get Car Make:</h3>
    //         <textarea placeholder="Enter your VIN" onChange={(e) => getCarManufacturer(e.target.value)}></textarea>
    //         <h5>{carMake}</h5>
    //         <h3>Get Car Price:</h3>
    //         <button onClick={async () => {getCarPriceEstimate(carMake,carYear,carModel)}}>{carPrice}</button>
    //     </>
    // );
}

    

    // async function getCarModel(VIN){
    //     const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
    //     const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data.Results[9].Value"); console.log(data.Results[9].Value); return data.Results[9].Value;}).catch(error => console.error(error));
    //     return response;
    // }

// This is to get the city tax rate
// async function getCityTaxRate(zip){
//     const api_url = `https://api.api-ninjas.com/v1/salestax?zip_code=${zip}`;
//     const response = await fetch(api_url, {headers: {
//         "X-Api-Key": apiNinjaKey
//       }}).then(response => response.json()).then(data => {console.log("Data[0].city_rate: "); console.log(data[0].city_rate); return data[0].city_rate;}).catch(error => console.error(error));
//     return response;
// }



//Getting the year the car was made (i.e. 2015, 2022 etc.)




// async function getCarModel(VIN){
//     const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
//     const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data.Results[9].Value"); console.log(data.Results[9].Value); return data.Results[9].Value;}).catch(error => console.error(error));
//     return response;
// }
// 
// async function buyCarInFull(price,tax){
//     const response = getTotalTaxRate(req.query.zip).then((tax) => {return getCarPaidInFull(req.query.price,tax)});
//     res.send((await response).toString());
// }

export async function getValues(principal,intRate,loanDuration,avgHomeInsurance,propertyTax){
    console.log("getValues function reached");
    getLoanPayables(principal,intRate,loanDuration,avgHomeInsurance,propertyTax).then((res) => setLoanAmt(res));
    return loanAmt;
}

export async function getZipTax(){
    console.log("getZipTax function reached");
    // setLoanAmt(calcCost.getLoanPayables(200000,3.5,30));
    setTaxRate(await getTotalTaxRate(55414));
    return taxRate;
}

// Yennodu VIN L5YZCABP1N1146187
export async function getCarManufacturer(VIN){
    console.log("getCarManufacturer function reached");
    setCarVIN(VIN);
    setCarMake(await getCarMake(VIN));
    setCarYear(await getCarYear(VIN));
    setCarModel(await getCarModel(VIN));
    return carMake;
}

export async function getStateOfZipCode(zip){
    console.log("getStateOfZipcode function reached");
    console.log("Zipcode: " + zip);
    getStateByZip(zip).then((derState) => {
        getAvgHomeInsuranceCost(derState).then((res) => {
            setAvgHomeInsuranceCost(res[0]);
            setCurPropertyTax(res[1]);
            setAvgRentersInsurance(res[2]);
            setState(derState);
        });
    })
    // const res = (await getAvgHomeInsuranceCost(state)).then((data) => {setAvgHomeInsuranceCost(data[0]); setCurPropertyTax(data[1]);});
    // setAvgHomeInsuranceCost(res[0]);
    // setCurPropertyTax(res[1]);
    
    return state;
}

export async function getCarPriceEstimate(carMake,carYear,carModel){
    console.log("getCarPriceEstimate function reached");
    setCarPrice(await getCarPrice(carMake,carYear,carModel));
    return carPrice;
}

export async function getValuableCarInfo(VIN){
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

export async function getStateByZip(zip){
    const api_url = `https://api.api-ninjas.com/v1/zipcode?zip=${zip}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => { console.log(data[0].state); return data[0].state;}).catch(error => console.error(error));
    return response;
}

export async function getLoanPayables(amt,interestRate,duration,avgHomeInsurance,propertyTax){
    const api_url = `https://api.api-ninjas.com/v1/mortgagecalculator?loan_amount=${amt}&interest_rate=${interestRate}&duration_years=${duration}&annual_home_insurance=${avgHomeInsurance}&annual_property_tax=${propertyTax}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => {return (data.monthly_payment.total).toFixed(2);}).catch(error => console.error(error));
    return response;
}

export async function getTotalTaxRate(zip){
    const api_url = `https://api.api-ninjas.com/v1/salestax?zip_code=${zip}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => {console.log("Data[0].total_rate: "); console.log(data[0].total_rate); return data[0].total_rate;}).catch(error => console.error(error));
    return response;
}

//Getting the manufacturer/make of the car (i.e. Acura, Buick etc.)
export async function getCarMake(VIN){
    const api_url = `https://api.api-ninjas.com/v1/vinlookup?vin=${VIN}`;
    const response = await fetch(api_url, {headers: {
        "X-Api-Key": apiNinjaKey
    }}).then(response => response.json()).then(data => {console.log("Data.manufacturer: "); console.log(data.manufacturer); return data.manufacturer;}).catch(error => console.error(error));
    return response;
}

export async function getCarYear(VIN){
    const api_url = `https://vpic.nhtsa.dot.gov/api/vehicles/decodevin/${VIN}?format=json`;
    const response = await fetch(api_url).then(response => response.json()).then(data => {console.log("data.Results[10].Value"); console.log(data.Results[10].Value); return data.Results[10].Value;}).catch(error => console.error(error));
    return response;
}

export function getCarPaidInFull(price,tax){
    console.log("price: " + price + " tax: " + tax);
    return (parseFloat(price) * (1 + parseFloat(tax))).toFixed(2);
}

export async function getCarPrice(carMake,carYear,carModel){
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
    
    avgPrice = carPriceSum / numCars;
    
    console.log("Average Price: " + avgPrice);

    return avgPrice;
}

export async function getAvgHomeInsuranceCost(state){
    const response = await fetch("/avgHomeInsuranceCosts.txt");
    const data = await response.text();
    const lines = data.split("\n");

    let avgCostPercent = 0;
    let propertyTaxPercent = 0;
    let rentInsurance = 0;

    for (let i = 0; i < lines.length; i++) {
      const [stateAbbr,cost,propertyTax,rentersInsurance] = lines[i].split(",");
      if(stateAbbr == state){
        avgCostPercent = (cost / 250000);
        propertyTaxPercent = propertyTax;
        rentInsurance = rentersInsurance;
      }
    }
    
    console.log("Average Insurance cost (%) for " + state + ": " + avgCostPercent);
    console.log("Property tax (%): " + propertyTaxPercent);
    console.log("Renters insurance: " + rentInsurance);

    return [avgCostPercent,propertyTaxPercent,rentInsurance];
}