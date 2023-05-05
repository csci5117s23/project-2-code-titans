export function getUniqueNames(expenses) {
    const rtn = new Set();
    expenses.map((expense) => {
        rtn.add(expense["name"]);
    })
    return Array.from(rtn);
}

export function getSummaryData(labels,data) {
    const nameToData = {};
    // go thru data, add to a dict for each thing
    // get or default to 0 while doing calculating expense for each type
    // put it all back into an array with the same array order
    data.map((val) => {
        if(nameToData[val["name"]]) nameToData[val["name"]] += val["amount"];
        else nameToData[val["name"]] = val["amount"];
    })

    const rtnData = [];
    labels.map((label) => {
        rtnData.push(nameToData[label]);
    })

    return rtnData;
}