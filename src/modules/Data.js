const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getAllPlans(authToken, userId) {
    const result = await fetch(`${backendBase}/plans?userId=${userId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getPlan(authToken, userId, planId) {
    const result = await fetch(`${backendBase}/plans?userId=${userId}&_id=${planId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getAllActivePlans(authToken, userId) {
    const result = await fetch(`${backendBase}/plans?userId=${userId}&isActive=true`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getAllInactivePlans(authToken, userId) {
    const result = await fetch(`${backendBase}/plans?userId=${userId}&isActive=false`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getAllPlannedExpenses(authToken, userId) {
    const result = await fetch(`${backendBase}/plannedExpenses?userId=${userId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getSpecificPlannedExpenses(authToken, userId, planId) {
    const result = await fetch(`${backendBase}/plannedExpenses?userId=${userId}&planId=${planId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getSinglePlannedExpense(authToken, userId, plannedExpenseId) {
    const result = await fetch(`${backendBase}/plannedExpenses?userId=${userId}&_id=${plannedExpenseId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getAllPastExpenses(authToken, userId) {
    const result = await fetch(`${backendBase}/pastExpenses?userId=${userId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function getSinglePastExpense(authToken, userId, pastExpenseId) {
    const result = await fetch(`${backendBase}/pastExpenses?userId=${userId}&_id=${pastExpenseId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}

export async function addPlan(authToken, plan) {
    const result = await fetch(`${backend_base}/plans`, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(plan)
    })
    return result;
}

export async function addPlan(authToken, plan) {
    const result = await fetch(`${backend_base}/plans`, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(plan)
    })
    return result;
}

export async function addPlannedExpense(authToken, plannedExpense) {
    const result = await fetch(`${backend_base}/plannedExpenses`, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(plannedExpense)
    })
    return result;
}

export async function addPastExpense(authToken, pastExpense) {
    const result = await fetch(`${backend_base}/pastExpenses`, {
        'method': 'POST',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        },
        'body': JSON.stringify(pastExpense)
    })
    return result;
}

export async function deletePlan(authToken, userId, planId) {
    const result = await fetch(`${backend_base}/deletePlan?userId=${userId}&_id=${planId}`,{
        'method':'DELETE',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        }
    })
    return await result.json();
}

export async function deletePlannedExpense(authToken, userId, plannedExpenseId) {
    const result = await fetch(`${backend_base}/deletePlanned?userId=${userId}&_id=${plannedExpenseId}`,{
        'method':'DELETE',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        }
    })
    return await result.json();
}

export async function deletePastExpense(authToken, userId, pastExpenseId) {
    const result = await fetch(`${backend_base}/deletePast?userId=${userId}&_id=${pastExpenseId}`,{
        'method':'DELETE',
        'headers': {
            'Authorization': 'Bearer ' + authToken,
            'Content-Type': 'application/json'
        }
    })
    return await result.json();
}

export async function editPlan(authToken, userId, planId, plan) {
    const result = fetch(`${backend_base}/updatePlan?userId=${userId}&_id=${planId}`, {
        'method': 'PUT',
        'headers': {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(plan)
      });
      return result;
}

export async function editPlannedExpense(authToken, userId, plannedExpenseId, plannedExpense) {
    const result = fetch(`${backend_base}/updatePlannedExpense?userId=${userId}&_id=${plannedExpenseId}`, {
        'method': 'PUT',
        'headers': {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(plannedExpense)
      });
      return result;
}

export async function editPastExpense(authToken, userId, pastExpenseId, pastExpense) {
    const result = fetch(`${backend_base}/updatePastExpense?userId=${userId}&_id=${pastExpenseId}`, {
        'method': 'PUT',
        'headers': {
          'Authorization': 'Bearer ' + authToken,
          'Content-Type': 'application/json',
        },
        'body': JSON.stringify(pastExpense)
      });
      return result;
}