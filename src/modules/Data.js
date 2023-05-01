const backendBase = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getAllPlans(authToken, userId) {
    const result = await fetch(`${backendBase}/plans?userId=${userId}`,{
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

export async function getAllPastExpenses(authToken, userId) {
    const result = await fetch(`${backendBase}/pastExpenses?userId=${userId}`,{
        'method':'GET',
        'headers': {'Authorization': 'Bearer ' + authToken}
    })
    return await result.json();
}