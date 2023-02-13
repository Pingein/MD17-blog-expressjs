const randInt = (start:number, stop:number) => {
    return Math.round(start+Math.random()*(stop-start))
}

function generateId() {
    return Math.floor(Math.random() * 1000000);
}

export {randInt, generateId}