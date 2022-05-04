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
    if (!req?.body?.funfacts || !req?.body?.stateCode){
        return res.status(400).json({'message': 'State fun facts value required'});
    }
    try {
        //add code to add a new funfact to the MongoDB
    } 
    catch (err) {
        console.error(err);
    }
}

 const updateFact = async (req, res) => {
    if (!req?.body?.index){
        return res.status(400).json({'message': 'State fun fact index value required'});
    }
    //const thisState = await State.findOne({stateCode: req.})
    
}

module.exports = {
    getAllStates,
    updateFact,
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPopulation,
    getAdmission
};