const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getAllPlans(authToken, userId) {
  const result = await fetch(`${backendBase}/plans?userId=${userId}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + authToken },
  });
  return await result.json();
}

export async function getPlan(authToken, userId, planId) {
  const result = await fetch(
    `${backendBase}/plans?userId=${userId}&_id=${planId}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function getAllActivePlans(authToken, userId) {
  const result = await fetch(
    `${backendBase}/plans?userId=${userId}&isActive=true`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function getAllInactivePlans(authToken, userId) {
  const result = await fetch(
    `${backendBase}/plans?userId=${userId}&isActive=false`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function activatePlan(authToken, userId, planId) {
  const activePlans = await getAllActivePlans(authToken, userId);
  await activePlans.map(async (plan) => {
    plan.isActive = false;

    await editPlan(authToken, userId, plan._id, plan);
  });
  const currentPlan = await getPlan(authToken, userId, planId);

  currentPlan[0].isActive = true;
  return await editPlan(authToken, userId, planId, currentPlan[0]);
}

export async function getAllInProgressPlans(authToken, userId) {
  const result = await fetch(
    `${backendBase}/plans?userId=${userId}&inProgress=true`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function getAllPlannedExpenses(authToken, userId) {
  const result = await fetch(
    `${backendBase}/plannedExpenses?userId=${userId}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function getSpecificPlannedExpenses(authToken, userId, planId) {
  const result = await fetch(
    `${backendBase}/plannedExpenses?userId=${userId}&planId=${planId}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function getSinglePlannedExpense(
  authToken,
  userId,
  plannedExpenseId
) {
  const result = await fetch(
    `${backendBase}/plannedExpenses?userId=${userId}&_id=${plannedExpenseId}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function getAllPastExpenses(authToken, userId) {
  const result = await fetch(`${backendBase}/pastExpenses?userId=${userId}`, {
    method: "GET",
    headers: { Authorization: "Bearer " + authToken },
  });
  return await result.json();
}

export async function getSinglePastExpense(authToken, userId, pastExpenseId) {
  const result = await fetch(
    `${backendBase}/pastExpenses?userId=${userId}&_id=${pastExpenseId}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}
export async function getPastExpensesByDate(authToken, userId, date) {
  const result = await fetch(
    `${backendBase}/pastExpenses?userId=${userId}&date=${date}`,
    {
      method: "GET",
      headers: { Authorization: "Bearer " + authToken },
    }
  );
  return await result.json();
}

export async function addPlan(authToken, plan) {
  const result = await fetch(`${backendBase}/plans`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plan),
  });
  return await result.json();
}

export async function addPlannedExpense(authToken, plannedExpense) {
  const result = await fetch(`${backendBase}/plannedExpenses`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(plannedExpense),
  });
  return result;
}

export async function addPastExpense(authToken, pastExpense) {
  const result = await fetch(`${backendBase}/pastExpenses`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + authToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pastExpense),
  });
  return result;
}

export async function deletePlan(authToken, userId, planId) {
  const result = await fetch(
    `${backendBase}/deletePlan?userId=${userId}&_id=${planId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }
  );
  return await result.json();
}

export async function deleteAllInProgressPlans(authToken, userId) {
  const result = getAllInProgressPlans(authToken, userId).then(async (res) => {
    res.map(
      async (plan) =>
        await fetch(
          `${backendBase}/deletePlan?userId=${userId}&_id=${plan._id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + authToken,
              "Content-Type": "application/json",
            },
          }
        )
    );
  });
  return await result;
}

export async function deletePlannedExpense(
  authToken,
  userId,
  plannedExpenseId
) {
  const result = await fetch(
    `${backendBase}/deletePlanned?userId=${userId}&_id=${plannedExpenseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }
  );
  console.log(result);
  return await result.json();
}

export async function deletePastExpense(authToken, userId, pastExpenseId) {
  const result = await fetch(
    `${backendBase}/deletePast?userId=${userId}&_id=${pastExpenseId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
    }
  );
  return await result.json();
}

export async function editPlan(authToken, userId, planId, plan) {
  const result = fetch(
    `${backendBase}/updatePlan?userId=${userId}&_id=${planId}`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plan),
    }
  );
  return result;
}

export async function editPlannedExpense(
  authToken,
  userId,
  plannedExpenseId,
  plannedExpense
) {
  const result = fetch(
    `${backendBase}/updatePlannedExpense?userId=${userId}&_id=${plannedExpenseId}`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(plannedExpense),
    }
  );
  return result;
}

export async function editPastExpense(
  authToken,
  userId,
  pastExpenseId,
  pastExpense
) {
  const result = fetch(
    `${backendBase}/updatePastExpense?userId=${userId}&_id=${pastExpenseId}`,
    {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + authToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pastExpense),
    }
  );
  return result;
}

export async function getCarInfo(authToken, vin) {
  const result = await fetch(`${backendBase}/getValuableCarInfo?vin=${vin}`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + authToken,
    },
  });
  return await result.json();
}

export async function getHomePrice(authToken, zip, amt, apr, term) {
  const result = await fetch(
    `${backendBase}/getHomePrice?zip=${zip}&amt=${amt}&apr=${apr}&term=${term}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  );
  return await result.json();
}

export async function getAptPrice(authToken, zip, amt) {
  const result = await fetch(
    `${backendBase}/getAptPrice?zip=${zip}&amt=${amt}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  );
  return await result.json();
}

export async function getCarLoanPayments(authToken, amt, apr, term) {
  const result = await fetch(
    `${backendBase}/getCarLoanPayments?amt=${amt}&apr=${apr}&term=${term}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  );
  return await result.text();
}

export async function buyCarInFull(authToken, zip, price) {
  const result = await fetch(
    `${backendBase}/buyCarInFull?zip=${zip}&price=${price}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  );
  return await result.json();
}

export async function getTaxedAmount(authToken, zip, amount) {
  const result = await fetch(
    `${backendBase}/getTaxedAmount?zip=${zip}&amount=${amount}`,
    {
      method: "GET",
      headers: {
        Authorization: "Bearer " + authToken,
      },
    }
  );
  return await result.json();
}
