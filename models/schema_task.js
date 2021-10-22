const {Schema, model} = require('mongoose');



const New_task = new Schema ({
    chat_id: { type: Number, required: true },        // Постановщик задач
    name: { type: String, default: 'Новая задача' },  // Название задачи
    text: { type: String, required: true },           // Описание задачи
    date: {type: Number, default: 0},                 // Срок выполнения
    from: String,                                     // Для проекта, или для пользователя персонально
    users: String,                                    // Для кого это задача
    id_users: Number,                                 // id того, для кого эта задача
    priority: String,
    name_from_task: String,
    two_h: {type: Boolean, default: false},
    twenteen_m: {type: Boolean, default: false},
    over_time: {type: Boolean, default: false},
    comment: String,
    done: {type: Boolean, default: false}
    
  });


  module.exports = model('New_task', New_task);
