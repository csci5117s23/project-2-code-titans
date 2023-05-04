import React from "react";
import { Button, Card } from "react-bootstrap";

const PlannedExpenseCard = ({ plannedExpense, onEdit, onDelete }) => {
  const { name, amount } = plannedExpense;
  console.log(name + " -:- " + amount)
  return (
    <Card className="mb-3 rounded-5 shadow">
      <Card.Body>
        <Card.Title className="mb-1">
          <h3>{name}</h3>
        </Card.Title>
        <Card.Subtitle className="text-muted mb-3">
          Monthly Expenditure
        </Card.Subtitle>
        <h3 style={{color: "#044303"}}>${parseFloat(amount).toFixed(2)}</h3>
        <div className="d-flex justify-content-end">
          <Button
            variant="primary"
            onClick={onEdit}
            style={{
              marginRight: "1rem",
              backgroundColor: "#47B1ED",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              width: "fit-content",
              border: "none"
            }}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            style={{
              backgroundColor: "#FF1D18",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
              width: "fit-content",
              border: "none"
            }}
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlannedExpenseCard;
