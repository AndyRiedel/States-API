


const validState = (stateCode) => {
    //given a state code from the url
    //return true if it's a valid state code, otherwise false
    let statesArr = [
            'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA',
            'HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
            'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
            'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
            'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',   
        ];
    if (statesArr.indexOf(stateCode.toUpperCase()) > -1){
        return true;
    }
    else {
        return false;
    }
}





module.exports = validState;
