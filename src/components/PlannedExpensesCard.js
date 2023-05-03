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
            style={{ marginRight: "1rem" }}
          >
            Edit
          </Button>
          <Button variant="danger" onClick={onDelete}>
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PlannedExpenseCard;
