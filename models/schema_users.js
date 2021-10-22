const {Schema, model} = require('mongoose');



const New_worker = new Schema ({
    chat_id: { type: Number, required: true },
    name: { type: String, default: 'Новый работник' },
    working: {type: Boolean, default: false},
    tasks: [{
      type: Schema.Types.ObjectId,
      ref: 'New_task'
    }],
    workload: {type: Number, default: 0} 
  });


  module.exports = model('New_worker', New_worker);


  /*
  tasks:  [{
             chat_id: { type: Number, required: true },
             name: { type: String, default: 'Новая задача' },
             text: { type: String, required: true },
             date: {type: Number, default: 0},
             users: String,
             priority: String,
             name_from_task: String,
             id_task: Number
    }],

    */