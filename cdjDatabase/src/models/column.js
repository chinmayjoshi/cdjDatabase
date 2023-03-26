import constants from '../constants.js';
class Column {

    constructor(name, type) {
       
        if(this.validateType(type)) {
            this.type = type;
        }
        else {
            throw new Error("Invalid type specified : "
             + type + " Valid types are : " + constants.types);
        }

        this.name = name;
        
    }

    validateType(type) {
        return constants.types.includes(type);
    }

}

export default Column;