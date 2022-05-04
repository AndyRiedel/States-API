const validState = require('../middleware/validState');
const State = require('../model/States'); 
const data = {};
data.stateJSON = require('../model/states.json');
const joinHandler = require('../middleware/joinHandler');
const { json } = require('express/lib/response');



const getStates = async () => {
    //this function gets, joins and returns all of the state data
    let result = await State.find({}, '-_id').lean()
    let factsString = JSON.stringify(result);
    return joinHandler(data.stateJSON,
                        JSON.parse(factsString),
                        "code",
                        "stateCode"
                    )
    
}


const getAllStates = async (req, res) => {
    //get and join the states data
    let states = await getStates();
    if (req.query.contig === undefined){//no contig parameter passed
        res.json(states);//return the entire JSON array
    }
    else if (req.query.contig ==='true'){//if ?contig=true, pass everything except AK & HI
        res.json(states.filter(st => st.code != 'AK' && st.code != 'HI'));

    }
    else {// if ?contig passed and not true, pass only ak and hi
        res.json(states.filter(st => st.code === 'AK' || st.code === 'HI'));
    }
};


const getState = async (req, res) => {
    //handles get request for a single state
    //returns that state's json data and funfacts
    let stateParam = req.params.state;
    if (validState(stateParam)){
        let states = await getStates();
        res.json(states.filter(st => st.code == stateParam.toUpperCase())[0]);
    }
    else {
        res.json({"message": "Invalid state abbreviation parameter"});
    }
}


const getCapital = async (req, res) => {
    //given the state url param
    //return stateName and capitalName for that state
    let stateParam = req.params.state;
    if (validState(stateParam)){
        let states = await getStates();
        states = states.filter(st => st.code == stateParam.toUpperCase());
        res.json(states.map(el => ({
            state: el.state,
            capital: el.capital_city
        }))[0]);


    }   
    else {
        res.json({"message": "Invalid state abbreviation parameter"});
    }
}

const getFunFact = async (req, res) => {
    //given the state url param
    //return stateName and capitalName for that state
    let stateParam = req.params.state;
    if (validState(stateParam)){
        let states = await getStates();
        states = states.filter(st => st.code == stateParam.toUpperCase());
        states = states[0]
        //check if funfacts key in states, 0 if not and length of funfacts array if so
        let factsLength = states.hasOwnProperty('funfacts') ? states['funfacts'].length : 0;
        if (factsLength > 0){
            res.json({
                "funfact": states.funfacts[Math.floor(Math.random() * factsLength)]
            });
        }
        else {
            stateName = states.state;
            res.json({"message": "No Fun Facts found for " + stateName});
        }

    }   
    else {
        res.json({"message": "Invalid state abbreviation parameter"});
    }
}

const getPopulation = async (req, res) => {
    //given the state url param
    //return stateName and capitalName for that state
    let stateParam = req.params.state;
    if (validState(stateParam)){
        let states = await getStates();
        states = states.filter(st => st.code == stateParam.toUpperCase());
        res.json(states.map(el => ({
            state: el.state,
            population: el.population
        }))[0]);


    }   
    else {
        res.json({"message": "Invalid state abbreviation parameter"});
    }
}

const getNickname = async (req, res) => {
    //given the state url param
    //return stateName and capitalName for that state
    let stateParam = req.params.state;
    if (validState(stateParam)){
        let states = await getStates();
        states = states.filter(st => st.code == stateParam.toUpperCase());
        res.json(states.map(el => ({
            state: el.state,
            nickname: el.nickname
        }))[0]);


    }   
    else {
        res.json({"message": "Invalid state abbreviation parameter"});
    }
}


const getAdmission = async (req, res) => {
    //given the state url param
    //return stateName and capitalName for that state
    let stateParam = req.params.state;
    if (validState(stateParam)){
        let states = await getStates();
        states = states.filter(st => st.code == stateParam.toUpperCase());
        res.json(states.map(el => ({
            state: el.state,
            admitted: el.admission_date
        }))[0]);


    }   
    else {
        res.json({"message": "Invalid state abbreviation parameter"});
    }
}

const addNewFact = async (req, res) => {
    let stateParam = req.params.state.toUpperCase();
    if (!validState(stateParam)){//if no valid state abbrev. param, return invalid state message
        return res.json({"message": "Invalid state abbreviation parameter"});
    }
    if (!req?.body?.funfacts){//if funfacts not in request body, return
        return res.status(400).json({'message': 'State fun facts value required'});
    }
    let factParam = req?.body?.funfacts;
    if (!Array.isArray(factParam)){//if passed funfacts param isn't an array return
        return res.status(400).json({"message": "State fun facts value must be an array"});
    }
    try {
        const thisState = await State.findOne({stateCode: stateParam}).exec();
        if (!thisState){//if no result, create that document
            const result = await State.create({
                stateCode: stateParam,
                funfacts: factParam
            });
            return res.status(201).json(result);
        }
        else {//if result, update funfacts for that document
            //deduplicate the two arrays
            let newFacts = thisState.funfacts;
            for (let i = 0; i < factParam.length; i++){//for each new fact
                let isDupe = false;
                for (let j = 0; j < newFacts.length; j++){//check against each old fact
                    if (factParam[i] == newFacts[j]){
                        isDupe = true;
                    }
                }
                //arrive here after inner loop if no dupes found, push new fact
                if (!isDupe) {
                    newFacts = newFacts.concat(factParam[i]);
                }
            }
            thisState.funfacts = newFacts;//old array in same order, plus new facts
            const result = await thisState.save();//save the new funfacts
            return res.json(result);
        }


    } 
    catch (err) {
        console.error(err);
    }
    
}

 const updateFact = async (req, res) => {
    let stateParam = req.params.state.toUpperCase();
    if (!validState(stateParam)){//if no valid state abbrev. param, return invalid state message
        return res.json({"message": "Invalid state abbreviation parameter"});
    }
    if (!req?.body?.index || req?.body?.index < 1){//if no index value passed or index == 0
        return res.status(400).json({'message': 'State fun fact index value required'});
    }
    if (!req?.body?.funfact){//if funfacts not in request body, return
        return res.status(400).json({'message': 'State fun facts value required'});
    }
    let factParam = req?.body?.funfact;
    let indexParam = req?.body?.index;
    try {
        const thisState = await State.findOne({stateCode: stateParam}).exec();
        if (indexParam > thisState.funfacts.length){//out of bounds index passed
            //need to get state name for return message
            let states = await getStates();
            states = states.filter(st => st.code == stateParam);
            return res.json( {
                "message": "No Fun Fact found at that index for " + states[0].state
            });
        }
        //in bounds index, update the funfacts array
        indexParam = indexParam - 1;//adjust index
        thisState.funfacts[indexParam] = factParam;//update array
        const result = await thisState.save();//save the updated array
        return res.json(result);
    }
    catch (err) {
        console.error(err);
    }

}

const deleteFact = async (req, res) => {
    let stateParam = req.params.state.toUpperCase();
    if (!validState(stateParam)){//if no valid state abbrev. param, return invalid state message
        return res.json({"message": "Invalid state abbreviation parameter"});
    }
    if (!req?.body?.index || req?.body?.index < 1){//if no index value passed or index == 0
        return res.status(400).json({'message': 'State fun fact index value required'});
    }
    let indexParam = req?.body?.index;
    try {
        const thisState = await State.findOne({stateCode: stateParam}).exec();
        if (indexParam > thisState.funfacts.length){//out of bounds index passed
            let states = await getStates();
            states = states.filter(st => st.code == stateParam);
            return res.json( {
                "message": "No Fun Fact found at that index for " + states[0].state
            });
        }
        //in bounds index, update the funfacts array
        indexParam = indexParam - 1;//adjust index
        let newFacts = [];
        let oldFacts = thisState.funfacts;
        for (let i = 0; i < oldFacts.length; i++){
            if (i != indexParam){
                newFacts.push(oldFacts[i]);
            }
        }
        thisState.funfacts = newFacts;//update array
        const result = await thisState.save();//save the updated array
        return res.json(result);
    }
    catch (err) {
        console.error(err);
    }
}

module.exports = {
    getAllStates,
    updateFact,
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission,
    addNewFact,
    deleteFact
};