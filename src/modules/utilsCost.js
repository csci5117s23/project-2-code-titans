import React, { useState, useEffect } from "react";
import { useAuth } from '@clerk/nextjs';

const apiNinjaKey = 'VUqM8pOYRSUXDglRoav+Vg==EuvtIuMkwpPN0t9r';

export default function CostCalculator(){
    const [loanAmt,setLoanAmt] = useState("Click to get your loan amount!");
    const [taxRate,setTaxRate] = useState("Click to get your tax rate!");
    const { isLoaded, userId, isSignedIn, getToken } = useAuth();

    // useEffect(() => {}, [isLoaded,loanAmt])

    async function getValues(){
        console.log("getValues function reached");
        // setLoanAmt(calcCost.getLoanPayables(200000,3.5,30));
        setLoanAmt(await getLoanPayables(200000,3.5,30));
        return loanAmt;
    }
    
    async function getZipTax(){
        console.log("getZipTax function reached");
        // setLoanAmt(calcCost.getLoanPayables(200000,3.5,30));
        setTaxRate(await getTotalTaxRate(55414));
        return taxRate;
    }

    return (
        <>
            <h3>Loan amount payable per month:</h3><br></br>
            <button onClick={getValues}>{loanAmt}</button>
            <h3>Total tax Rate for your zip code:</h3>
            <button onClick={getZipTax}>{taxRate}</button>
        </>
    );
}

async function getLoanPayables(amt,interestRate,duration){
    const api_url = `https://api.api-ninjas.com/v1/mortgagecalculator?loan_amount=${amt}&interest_rate=${interestRate}&duration_years=${duration}`;
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

