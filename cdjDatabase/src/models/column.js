import constants from '../constants.js';
class Column {
    is_primary = false;

    constructor(name, type , is_primary = false) {
       
        if(this.validateType(type)) {
            this.type = type;
        }
        else {
            throw new Error("Invalid type specified : "
             + type + " Valid types are : " + constants.types);
        }

        this.name = name;
        this.is_primary = is_primary;
        
    }

    validateType(type) {
        return constants.types.includes(type);
    }

}

export default Column;