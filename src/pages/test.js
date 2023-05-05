import { useState } from 'react';
import { deletePlannedExpense } from '@/modules/Data';
import { useAuth, useUser } from "@clerk/nextjs";

export default function TestComponent() {
  const [authToken, setAuthToken] = useState('');
  const [plannedExpenseId, setPlannedExpenseId] = useState('');
  const [userId, setUserId] = useState('');
  const { isLoaded, getToken } = useAuth();

  const handleDeleteClick = async () => {
    const token = await getToken({ template: "codehooks" });
    setAuthToken(token);
    const result = await deletePlannedExpense(token, userId, plannedExpenseId);
    console.log(result);
  };

  return (
    <div>
      <label>
        Auth Token:
        <input disabled type="text" value={authToken} onChange={(e) => setAuthToken(e.target.value)} />
      </label>
      <br />
      <label>
        User ID:
        <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} />
      </label>
      <br />
      <label>
        Planned Expense ID:
        <input type="text" value={plannedExpenseId} onChange={(e) => setPlannedExpenseId(e.target.value)} />
      </label>
      <br />
      <button onClick={handleDeleteClick}>Delete Planned Expense</button>
    </div>
  );
}