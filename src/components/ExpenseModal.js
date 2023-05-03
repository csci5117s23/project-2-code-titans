import React, { useState, useEffect } from "react";
import { Modal, Button, Container, Row, Col, Form } from "react-bootstrap";
import { getCarInfo, buyCarInFull, getCarLoanPayments, getHomePrice, getAptPrice, getSinglePlannedExpense, addPlannedExpense, editPlannedExpense } from "@/modules/Data";
import { useRouter } from "next/router";
import { useAuth, useUser } from "@clerk/nextjs";

const ExpenseModal = ({ show, expense, handleClose, expenseId, planId, location, }) => {
  const { isLoaded, userId, sessionId, getToken } = useAuth();
  const { user } = useUser();
  const router = useRouter();

  const [name, setName] = useState(null);
  const [amount, setAmount] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const [customAutoPrice, setCustomAutoPrice] = useState(null);
  const [vinOrPrice, setVinOrPrice] = useState("Price");
  const [vin, setVin] = useState(null);
  const [financeOrFull, setFinanceOrFull] = useState("Finance");
  const [downpayment, setDownpayment] = useState(null);
   const [APR, setAPR] = useState(null);
  const [term, setTerm] = useState(null);
  const [dueDate, setDueDate] = useState(new Date());
  const [carInfo, setCarInfo] = useState(null);
  const [rentOrOwn, setRentOrOwn] = useState("Rent");
  const [homePrice, setHomePrice] = useState(null);
  const [rent, setRent] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    setName(expense);
    setIsDisabled(name === "Auto" || name === "Home");
  }, [expense]);

  useEffect( () => {
    if(expenseId && expenseId.length > 0){
      getToken({ template: "codehooks" }).then(async (token) => {
        async function process() {
          const res =  (await getSinglePlannedExpense(token, userId, expenseId))[0];
          return res;
        }
        process().then((res) => {
          setName(res.name);
          setAmount(res.amount);
          if(res.name == "Auto" && res.carVin){
            setVinOrPrice("VIN");
            setCarInfo({year: res.carYear, make: res.carMark, model: res.carModel});
          }
          if(res.apr)
            setAPR(res.apr);
          if(res.term)
            setTerm(res.term);
          if(res.downpayment)
            setDownpayment(res.downpayment);
        });
      });
    }
  }, [expenseId])

  useEffect(() => {
    setZipCode(location);
  }, [location])

  const handleSaveChanges = async () => {
    // Do something with the expense data
    if(name.trim()==="" || amount===null || amount===undefined || dueDate==="") return;
    const token = await getToken({ template: "codehooks" })
    let savedChanges = {
      name: name,
      userId: userId,
      amount: amount,
      planId: planId,
      dueDate: dueDate,
    };
    if(carInfo){
      savedChanges['carModel'] = carInfo.model;
      savedChanges['carMake'] = carInfo.make;
      savedChanges['carYear'] = carInfo.year;
    }
    if(vin)
      savedChanges['carVin'] = vin;
    if(APR)
      savedChanges['apr'] = APR;
    if(term)
      savedChanges['term'] = term;
    if(downpayment)
      savedChanges['downpayment'] = downpayment;
    if(expenseId){
      console.log('expenseId: ' + expenseId);
      await editPlannedExpense(token, userId, expenseId, savedChanges);
    }else{
      await addPlannedExpense(token, savedChanges);
    }
    
    
    handleClose();
  };

  const handleVinOrPriceChange = (e) => {
    setVinOrPrice(e.target.value);
  };
  const handleFinanceOrFullChange = (e) => {
    setFinanceOrFull(e.target.value);
  };
  const handleRentOrOwn = (e) => {
    setRentOrOwn(e.target.value);
  };

  const handleLookup = async () => {
    const token = await getToken({ template: "codehooks" });
    const res = await getCarInfo(token, vin);
    setCustomAutoPrice(res.price);
    setCarInfo(res);
  };

  const handleComputeCarAPR = async () => {
    console.log("Clicked!");
    const token = await getToken({ template: "codehooks" });
    const res = await getCarLoanPayments(token, (vinOrPrice=="VIN" ? carInfo.price : customAutoPrice) - downpayment, APR, term);
    setAmount(parseFloat(res));
  };


  const handleFullPaymentCar = async() => {
    const token = await getToken({ template: "codehooks" });
    const res = await buyCarInFull(token, zipCode, (vinOrPrice=="VIN" ? carInfo.price : customAutoPrice));
    setAmount (parseFloat(res));
  };

  const handleOwnHomeCosts = async() => {
    const token = await getToken({ template: "codehooks" });
    const res = await getHomePrice(token, zipCode, homePrice - downpayment, APR, term);
    setAmount(parseFloat(res));
  };

  const handleRentCosts = async() => {
    const token = await getToken({ template: "codehooks" });
    const res = await getAptPrice(token, zipCode, rent);
    setAmount(parseFloat(res));
  };
  
  const renderAutoFields = () => {
    return (
      <div>
        <Form.Group controlId="vinOrPrice">
          <Form.Label>
            <span className="light-brown">VIN or Price</span>
          </Form.Label>
          <Form.Check
            inline
            label="VIN"
            type="radio"
            value="VIN"
            checked={vinOrPrice === "VIN"}
            onChange={handleVinOrPriceChange}
          />
          <Form.Check
            inline
            label="Price"
            type="radio"
            value="Price"
            checked={vinOrPrice === "Price"}
            onChange={handleVinOrPriceChange}
          />
        </Form.Group>
        {vinOrPrice === "VIN" && (
          <Form.Group controlId="vin">
            <Form.Label>
              <span className="light-brown">VIN</span>
            </Form.Label>
            <Form.Control
              type="text"
              style={{
                background: "#F7E7D5",
                borderRadius: "11px",
              }}
              value={vin}
              required
              onChange={(e) => setVin(e.target.value)}
            />
            <Button className="my-3" type="submit" onClick={handleLookup}>
              Lookup
            </Button>
          </Form.Group>
        )}
        {carInfo && vinOrPrice === "VIN" && (
          <>
            <Form.Group controlId="year">
              <Form.Label>
                <span className="light-brown">Year</span>
              </Form.Label>
              <Form.Control className="custom-input" type="text" value={carInfo.year} disabled />
            </Form.Group>
            <Form.Group controlId="model">
              <Form.Label>
                <span className="light-brown">Model</span>
              </Form.Label>
              <Form.Control type="text" value={carInfo.model} disabled />
            </Form.Group>
            <Form.Group controlId="make">
              <Form.Label>
                <span className="light-brown">Make</span>
              </Form.Label>
              <Form.Control type="text" value={carInfo.make} disabled />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>
                <span className="light-brown">Price</span>
              </Form.Label>
              <Form.Control type="text" value={customAutoPrice} disabled />
            </Form.Group>
          </>
        )}
        {vinOrPrice === "Price" && (
          <Form.Group controlId="priceInput">
            <Form.Label>
              <span className="light-brown">Price</span>
            </Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter auto price"
              value={customAutoPrice}
              required
              onChange={(e) => setCustomAutoPrice(e.target.value)}
            />
          </Form.Group>
        )}
      </div>
    );
  };

  const renderAutoPaymentFields = () => {
    return (
      <div>
        <Form.Group controlId="financeOrFull">
          <Form.Label>
            <span className="light-brown">Finance or Full</span>
          </Form.Label>
          <Form.Check
            inline
            label="Finance"
            type="radio"
            value="Finance"
            checked={financeOrFull === "Finance"}
            onChange={handleFinanceOrFullChange}
          />
          <Form.Check
            inline
            label="Full"
            type="radio"
            value="Full"
            checked={financeOrFull === "Full"}
            onChange={handleFinanceOrFullChange}
          />
        </Form.Group>
        {financeOrFull === "Finance" && (
          <>
            <Form.Group controlId="downpayment">
              <Form.Label>
                <span className="light-brown">Downpayment ($)</span>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter downpayment"
                value={downpayment}
                required
                onChange={(e) => setDownpayment(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="APR">
              <Form.Label>
                <span className="light-brown">APR (%)</span>
              </Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter APR"
                value={APR}
                required
                onChange={(e) => setAPR(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="term">
              <Form.Label>
                <span className="light-brown">Term (years)</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type="number"
                  required
                  placeholder="Enter term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                />
                <div className="input-group-append">
                  <span className="input-group-text">years</span>
                </div>
              </div>
            </Form.Group>
            or Automatically...
            <Button
              style={{
                backgroundColor: "#47B1ED",
                boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                width: "fit-content",
                border: "none"
              }}
              className="my-3"
              variant="primary"
              type="submit"
              onClick={handleComputeCarAPR}>
              Compute Costs
            </Button>
          </>
        )}
        {financeOrFull ===
          "Full" && (
            <Button className="my-3" type="submit" variant="primary" onClick={handleFullPaymentCar}>
              Compute Costs
            </Button>
          )}
      </div>
    );
  };

  const renderHomeFields = () => {
    return (
      <div>
        <Form.Group controlId="rentOrOwn">
          <Form.Label>
            <span className="light-brown">Finance or Full</span>
          </Form.Label>
          <Form.Check
            inline
            label="Rent"
            type="radio"
            value="Rent"
            checked={rentOrOwn === "Rent"}
            onChange={handleRentOrOwn}
          />
          <Form.Check
            inline
            label="Own"
            type="radio"
            value="Own"
            checked={rentOrOwn === "Own"}
            onChange={handleRentOrOwn}
          />
        </Form.Group>
        {rentOrOwn === "Own" && (
          <>
              <Form.Group controlId="cost">
              <Form.Label>
                <span className="light-brown">Home Price ($)</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={homePrice}
                required
                onChange={(e) => setHomePrice(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="downpayment">
              <Form.Label>
                <span className="light-brown">Downpayment ($)</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={downpayment}
                required
                onChange={(e) => setDownpayment(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="APR">
              <Form.Label>
                <span className="light-brown">APR (%)</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={APR}
                required
                onChange={(e) => setAPR(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="term">
              <Form.Label>
                <span className="light-brown">Term (years)</span>
              </Form.Label>
              <div className="input-group">
                <Form.Control
                  type="number"
                  value={term}
                  required
                  onChange={(e) => setTerm(e.target.value)}
                />
                <div className="input-group-append">
                  <span className="input-group-text">years</span>
                </div>
              </div>
            </Form.Group>
            <Button
              style={{backgroundColor: "#47B1ED",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      width: "fit-content",
                      border: "none"}}
              className="my-3"
              variant="primary"
              type="submit"
              onClick={handleOwnHomeCosts}>
              Compute Costs
            </Button>
          </>
        )}
        {rentOrOwn ===
          "Rent" && (
            <>
            <Form.Group controlId="cost">
              <Form.Label>
                <span className="light-brown">Monthly Rent ($)</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={rent}
                required
                onChange={(e) => setRent(e.target.value)}
              />
            </Form.Group>
            <Button
              style={{backgroundColor: "#47B1ED",
                      boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                      width: "fit-content",
                      border: "none"}}
              className="my-3"
              variant="primary"
              type="submit"
              onClick={handleRentCosts}>
              Compute Costs
            </Button>
            </>
          )}
      </div>
    );
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Form>
        <Modal.Header style={{ backgroundColor: "#F8F4F1" }} closeButton>
          <Modal.Title>
            <h1>Add Expense</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: "#F8F4F1" }}>
          <Container fluid className="p-0">
            <Row>
              <Col>
                <Form.Group controlId="planName">
                  <Form.Label>
                    <span className="light-brown">Name</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    style={{
                      background: "#F7E7D5",
                      borderRadius: "11px",
                    }}
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value)
                    }}
                    disabled={isDisabled}
                    required
                  />
                  <>
                    <Form.Label>
                      <span className="light-brown">Monthly Expense ($)</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      style={{
                        background: "#F7E7D5",
                        borderRadius: "11px",
                      }}
                      placeholder="Enter manually or compute costs below"
                      value={amount}
                      required
                      onChange={(e) => setAmount(e.target.value)}
                    />
                  </>
                  <Form.Label>
                    <span className="light-brown">Zip Code</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    style={{
                      background: "#F7E7D5",
                      borderRadius: "11px",
                    }}
                    placeholder="Enter zip code"
                    value={zipCode}
                    required
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </Form.Group>
                {expense === "Auto" && renderAutoFields()}
                {expense === "Auto" && renderAutoPaymentFields()}
                {expense === "Home" && renderHomeFields()}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: "#F8F4F1" }}>
          <p style={{ color: "#876C44" }}>Due Date</p>
          <Form.Group controlId="dueDate">
            <Form.Control
              type="date"
              style={{
                background: "#F7E7D5",
                borderRadius: "11px",
              }}
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </Form.Group>
          <Button
            style={{
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              width: "fit-content",
              border: "none"
            }}
            variant="secondary"
            onClick={handleClose}>
            Close
          </Button>
          <Button
            style={{
              backgroundColor: "#47B1ED",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              width: "fit-content",
              border: "none"
            }}
            variant="primary"
            type="submit"
            onClick={handleSaveChanges}>
            Create Expense
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default ExpenseModal;
