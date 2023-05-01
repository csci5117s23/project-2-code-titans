import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";

const ExpenseModal = ({ show, expense, handleClose }) => {
  const [selectedExpense, setSelectedExpense] = useState();
  useEffect(() => {
    setSelectedExpense(expense);
  }, [expense])
  return (
    <Modal  show={show} onHide={handleClose}>
      <Modal.Header style={{backgroundColor: '#F8F4F1'}} closeButton>
        <Modal.Title>{selectedExpense}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{backgroundColor: '#F8F4F1'}}>
        <p>Put your content here</p>
      </Modal.Body>
      <Modal.Footer style={{backgroundColor: '#F8F4F1'}}>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExpenseModal;