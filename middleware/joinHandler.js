
const joinHandler = (leftTable, rightTable) => {
    //left outer joins leftTable & rightTable on rightTable.stateCode and leftTable.code
    //returns array of joined JSONs
    return leftTable.map(function (e) {
        return Object.assign({}, e, rightTable.reduce(function(acc, val){
            if (val.stateCode == e.code) {
                return {"funfacts": val.funfacts};
            }
            else {
                return acc;
            }
        }, {} ))
    });
}

module.exports = joinHandler;