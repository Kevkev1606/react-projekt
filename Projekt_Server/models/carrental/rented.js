let mongoose = require('mongoose');


module.exports = rentedSchema = new mongoose.Schema({
    userId:{type:mongoose.Schema.Types.ObjectId,required:true},
    //name:{type:String,required:true}, kein Anwendungsbedarf, lieber ID mitgeben
    rentalId:{type:mongoose.Schema.Types.ObjectId,required:true},
    //von date:{type:Number,required:true}, auf Start- und Enddatum gewechselt, für bessere Strukturierung
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    price:{type:Number,required:true},
});

//const rentedModel = mongoose.model('rented',rentedSchema);

//module.exports = rentedModel;

//Selber hinzugefügt
module.exports = rentedSchema;