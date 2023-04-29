// api_url = 'https://api.api-ninjas.com/v1/mortgagecalculator?loan_amount=200000&interest_rate=3.5&duration_years=30'
// response = requests.get(api_url, headers={'X-Api-Key': 'fV0XIGqLLhe+rJZOdlL8fg==NBTZZZuSwSq7vddE'})

export default function getLoanPayables(amt,interestRate,duration){
    const api_url = "https://api.api-ninjas.com/v1/mortgagecalculator?loan_amount={}&interest_rate={}&duration_years={}".format(amt,interestRate,duration)
    response = req.get(api_url, headers={'X-Api-Key': 'VUqM8pOYRSUXDglRoav+Vg==EuvtIuMkwpPN0t9r'})
    if(response.status_code == requests.codes.ok){
        print(response.text)
        return response.text
    }else{
        print("Error:", response.status_code, response.text)
    }
}