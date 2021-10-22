const {Schema, model} = require('mongoose');



const New_project = new Schema ({
    name: { type: String, default: 'Новый проект' },
    text: {
            comment: String,
            name: String,
            phone: { type: String, default: 'Нет номера' },
            email: { type: String, default: 'Нет почты' },
            can: { type: String, default: 'Цель не ясна' },
        },
    tasks:   [{
        type: Schema.Types.ObjectId,
        ref: 'New_task'
      }],
    worsers: [
        {
            name: String,
            id: Number
        }
    ],
    workload: {type: Number, default: 0},
    kurator: {
        name: String,
        id: Number
    }
  });


  module.exports = model('New_project', New_project);
