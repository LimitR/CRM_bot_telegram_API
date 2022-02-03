require('dotenv').config();

const TelegramStarted = require('node-telegram-bot-api')
const token = process.env.TOKEN_BOT // релизный бот на сервере
// const token = process.env.TESTING_TOKEN_BOT
const fs = require('fs')
const bot = new TelegramStarted(token, { polling: true })
const request = require("request")
const mongoose = require('mongoose');
const MONGO_USERNAME = process.env.LOCAL_MONGO_USERNAME
const MONGO_PASSWORD = process.env.LOCAL_MONGO_PASSWORD
const MONGO_HOSTNAME = process.env.LOCAL_MONGO_HOSTNAME
const MONGO_PORT     = process.env.LOCAL_MONGO_PORT
const MONGO_DB       = process.env.LOCAL_MONGO_DB
const Schema = mongoose.Schema;
const event = require('events')
const myEmitter = new event.EventEmitter()
const DATE = require('formaster_date_and_time')
const date_format = new DATE()
const url = process.env.DB
// const url = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOSTNAME}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`; // relise
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true });
const queryKeyBoard = require('./keyBoardAnalytics.js')


global.users_from_cotnext = []
global.set_project_task = []
global.win_task_context = []

const tim_worker = new Set()
tim_worker.add(1280484134).add(237077795).add(296427186)
global.New_project = require('./models/schema_project')
global.New_Task = require('./models/schema_task')
global.New_Worker = require('./models/schema_users')

myEmitter.addListener('/reencrypt', ()=>{})
myEmitter.addListener('/encrypt', ()=>{})
myEmitter.addListener('/new_task', ()=>{})
myEmitter.addListener('/save', ()=>{})
myEmitter.addListener('new_task_from_project', ()=>{})
const USER = new Map()
class Users_msg{
    constructor(chat_id, name_event){
        this.chat_id = chat_id;
        this.name_event = name_event;
        this.map = {num: 0}
    }

}

myEmitter.on('/encrypt', async (msg)=>{
    USER.get(msg.chat.id).map.text = msg.text.split('')
    USER.get(msg.chat.id).map.num = Math.floor(Math.random() * 100)
    USER.get(msg.chat.id).map.text = USER.get(msg.chat.id).map.text.map((x)=>{
        x = x.charCodeAt(0) + USER.get(msg.chat.id).map.num + 'O'
        return x
    })
    bot.sendMessage(USER.get(msg.chat.id).chat_id, `${USER.get(msg.chat.id).map.text.join('')}\n${USER.get(msg.chat.id).map.num}`)
    USER.delete(msg.chat.id)
})

myEmitter.on('/reencrypt', async msg =>{
    if(USER.get(msg.chat.id).map.num == 1){
        USER.get(msg.chat.id).map.text = msg.text.split('O') 
        bot.sendMessage(msg.chat.id, 'Введите ключ')
    }
    if(USER.get(msg.chat.id).map.num == 2){
        USER.get(msg.chat.id).map.number_text = msg.text
        USER.get(msg.chat.id).map.text = USER.get(msg.chat.id).map.text.map(x=>{
        x = String.fromCharCode(parseInt(x - USER.get(msg.chat.id).map.number_text))
        return x
    }) 
    bot.sendMessage(USER.get(msg.chat.id).chat_id, `${USER.get(msg.chat.id).map.text.join('')}`)
    USER.delete(msg.chat.id)
    }
    
    
})


bot.on('callback_query', async (query)=>{
    queryKeyBoard.keyBoardAnalytics(query)
   })

function name_as_id(name) {
    if (name == 'XXXX') return "XXXX"
    if (name == 'XXXX') return "XXXX"
    if (name == 'XXXX') return "XXXX"
    if (name == 'XXXX') return "XXXX"
}

function id_as_name(name) {
    if (name == 'XXXX') return `XXXX`
    if (name == 'XXXX') return `XXXX`
    if (name == 'XXXX') return `XXXX`
    if (name == 'XXXX') return `XXXX` 
}


function number_as_smailnumber(number){
    switch(number){
        case 0:
            return '0️⃣'
        break
        case 1:
            return '1️⃣'
        break
        case 2:
            return '2️⃣'
        break
        case 3:
            return '3️⃣'
        break
        case 4:
            return '4️⃣'
        break
        case 5:
            return '5️⃣'
        break
        case 6:
            return '6️⃣'
        break
        case 7:
            return '7️⃣'
        break
        case 8:
            return '8️⃣'
        break
        case 9:
            return '9️⃣'
        break
        case 10:
            return '🔟'
        break
        
    }
}

function inline_keyboard_projects(number, name_callback, id_data = Array.from(Array(100), ()=>{return ''})){
    let arr_board = [[]]
    if(number != 0 && number <= 5){

        for(let i = 0; i < number; i++){
                arr_board[0].push({text: number_as_smailnumber(i + 1), callback_data: `${name_callback}_${i}_${id_data[i]._id}`})
        }
        arr_board[1] = []
    }else if(number != 0 && number > 5){
        let iter = 0
        for(let i = 0; i < number; i++){
            if(i%5 == 0) {
                iter++
                arr_board.push([])
            }
            arr_board[iter].push({text: number_as_smailnumber(i + 1), callback_data: `${name_callback}_${i}_${id_data[i]._id}`})

        }
        arr_board = arr_board.splice(1,100)
    }else if(number == 0){
        arr_board[1] = [] 
        arr_board[0] = [] 
    }
    return arr_board
}

// /new_client

bot.setMyCommands([
    { command: '/new_task', description: 'Поставить задачу' },
    { command: '/new_client', description: 'Новый клиент' },
    { command: '/my_tasks', description: 'Задачи и проекты' },
    { command: '/workers', description: 'Загруженность работников' },
    { command: '/new_project', description: 'Новый проект' }, 
    { command: '/stop', description: 'Отмена ввода команды' }, 
    { command: '/encrypt', description: 'Зашифровать сообщение' }, 
    { command: '/reencrypt', description: 'Расшифровать сообщение' }, 
    
])

let _name_puser_project
let New_Task_Schema = {}


let arr_date = []


function* generator_new_user() {
    yield (f) => {
        New_Users_Schema.chat_id = f.forward_from.id
        New_Users_Schema.name = f.forward_from.first_name
        let NewWorker = new New_Worker({ chat_id: f.forward_from.id, name: f.forward_from.first_name })
        NewWorker.save((err) => { console.log(err); })
        console.log(New_Users_Schema);
        flag = false
    }
}


setInterval(async ()=>{
    let loop_task = await New_Task.find({})
    
    if(loop_task != []){
       loop_task.map(async (i, index)=>{

           if(i.done != true){
                if(i.date - Date.now() < 60000 && i.over_time != true && i.two_h == true && i.twenteen_m == true ){
                    await New_Task.updateOne({_id: i._id}, {$set: {over_time: true}})

                  await  bot.sendMessage(name_as_id(i.users),  `❗❗❗❗❗❗❗❗❗❗❗❗\nЗадача просрочена\n❗❗❗❗❗❗❗❗❗❗❗❗\n\nПриоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm',i.date)}\n\nЗадача от: ${i.name_from_task}`)
                }else if(i.date - Date.now() < 1200000 && i.two_h == true && i.twenteen_m != true ){
                    await New_Task.updateOne({_id: i._id}, {$set: {twenteen_m: true}})

                  await  bot.sendMessage(name_as_id(i.users),  `❗❗❗❗❗❗❗❗❗❗❗❗\nЗадача будет просрочена через 20 минут просрочена\nПриступите к выполнению\n❗❗❗❗❗❗❗❗❗❗❗❗\n\nПриоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm',i.date)}\n\nЗадача от: ${i.name_from_task}`)
                }else if(i.date - Date.now() < 7200000 && i.two_h != true && i.over_time != true && i.twenteen_m != true){
                    await New_Task.updateOne({_id: i._id}, {$set: {two_h: true}})

                  await  bot.sendMessage(name_as_id(i.users),  `❗❗❗❗❗❗❗❗❗❗❗❗\nЗадача будет просрочена через 2 часа\nПриступите к выполнению\n❗❗❗❗❗❗❗❗❗❗❗❗\n\nПриоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm',i.date)}\n\nЗадача от: ${i.name_from_task}`)
                }
        }
    }) 
    }
    // if(new Date().getHours() == 9){
    //     for(id of tim_worker){
    //         bot.sendMessage(id, 'Вы приступили к работе?\n\nНажмите «Начать рабочий день»', {
    //             parse_mode: 'HTML',
    //             reply_markup: JSON.stringify({
    //                 inline_keyboard: [
    //                     [{ text: 'Начать рабочий день', callback_data: `start_working_${id}` }],
    //                 ]
    //             })
    //         })
    //     }
    // }

}, 60000)



let id_task_schema
let arr_workers
myEmitter.on('/new_task', async (data)=>{
    if (USER.get(data.chat.id).map.num == 1) {
        USER.get(data.chat.id).map.task_name = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Введите описание:') 
        

    }
    if (USER.get(data.chat.id).map.num == 2) {
        let arr_date =[]
        for (let i = 0; i < 336; i = i + 24){
            if(+date_format.formatUsers('hh') < 18){
                arr_date.push(
                    [{ text: `${date_format.formatUsers('DD.MM.YY', +i )}`, }]
                    )
            }else{
                arr_date.push(
                    [{ text: `${date_format.formatUsers('DD.MM.YY', +i + 24)}`, }]
                    )
            }
        }
        // return async ()=>{
            USER.get(data.chat.id).map.text = data.text
         bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите дату', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": arr_date
            }
        })
    // }

    }
    if (USER.get(data.chat.id).map.num == 3) {
        let arr_date_date = []
        if(USER.get(data.chat.id).map.num == 3 && date_format.formatUsers('DD.MM.YY') == data.text){
            for(let i = 0; i < 10; i++){
                if(+date_format.formatUsers('hh') + i < 19 && +date_format.formatUsers('hh') + i != +date_format.formatUsers('hh')){
                    arr_date_date.push(
                        [{text: `${+date_format.formatUsers('hh') + i}:00`}]
                        )
                }
            }
        }else{
            arr_date_date = [
                [{ text: `09:00`, }],
                [{ text: `10:00`, }],
                [{ text: `11:00`, }],
                [{ text: `12:00`, }],
                [{ text: `13:00`, }],
                [{ text: `14:00`, }],
                [{ text: `15:00`, }],
                [{ text: `16:00`, }],
                [{ text: `17:00`, }],
                [{ text: `18:00`, }],
            ]
        }
        // return async ()=>{
            USER.get(data.chat.id).map._date = []
            USER.get(data.chat.id).map._date.push(data.text)
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите время:', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": arr_date_date
                
            }
        })
    // }
    }
    if (USER.get(data.chat.id).map.num == 4) {
        // return async ()=>{
            USER.get(data.chat.id).map._date.push(data.text)
            USER.get(data.chat.id).map.date = date_format.formatParse(USER.get(data.chat.id).map._date[0]) + date_format.formatParse(`${USER.get(data.chat.id).map._date[1]}:00`) - (3600 * 3 * 1000)
        await bot.sendMessage(data.chat.id, 'Выбирите исполнителя:', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": [
                    [{ text: "Артем", }],
                    [{ text: "Ренат", }],
                    [{ text: "Илья", }],
                    [{ text: "Антон", }],
                ]
            }
        })
    // }
    }
    if (USER.get(data.chat.id).map.num == 5) {
        // return async ()=>{
            USER.get(data.chat.id).map.users = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите приоритет задачи:', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": [
                    [{ text: "🤷", }],
                    [{ text: "🔥", }],
                    [{ text: "🔥🔥", }],
                    [{ text: "🔥🔥🔥", }],
                ]
            }
        })
    // }
    }
    if (USER.get(data.chat.id).map.num == 6) {
        id_task_schema = Date.now()
        USER.get(data.chat.id).map.priority = data.text
        USER.get(data.chat.id).map.chat_id = data.chat.id
        USER.get(data.chat.id).map.name_from_task = id_as_name(data.chat.id)
        USER.get(data.chat.id).map.id_task = id_task_schema
        console.log( USER.get(data.chat.id).map);
        let NewTask = new New_Task({
            chat_id: USER.get(data.chat.id).map.chat_id,
            name: USER.get(data.chat.id).map.task_name,
            text: USER.get(data.chat.id).map.text,
            date: USER.get(data.chat.id).map.date,
            users: USER.get(data.chat.id).map.users,
            priority: USER.get(data.chat.id).map.priority,
            name_from_task: data.from.first_name,
            id_task: id_task_schema,
            id_users: name_as_id(USER.get(data.chat.id).map.users),
            from: 'worker'
        })
        NewTask.save((err) => { console.log(err); })
        await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $push: { tasks: NewTask._id } })
        if (USER.get(data.chat.id).map.priority == "🤷") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 1 } })
        if (USER.get(data.chat.id).map.priority == "🔥") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 2 } })
        if (USER.get(data.chat.id).map.priority == "🔥🔥") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 3 } })
        if (USER.get(data.chat.id).map.priority == "🔥🔥🔥") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 4 } })
        
        await    bot.deleteMessage(data.chat.id, data.message_id)
        await    bot.deleteMessage(data.chat.id, data.message_id - 1)
        await    bot.deleteMessage(data.chat.id, data.message_id - 2)
        await    bot.deleteMessage(data.chat.id, data.message_id - 3)
        await    bot.deleteMessage(data.chat.id, data.message_id - 4)
        await    bot.deleteMessage(data.chat.id, data.message_id - 5)
        await    bot.deleteMessage(data.chat.id, data.message_id - 6)
        await    bot.deleteMessage(data.chat.id, data.message_id - 7)
        await    bot.deleteMessage(data.chat.id, data.message_id - 8)
        await    bot.deleteMessage(data.chat.id, data.message_id - 9)
        await    bot.deleteMessage(data.chat.id, data.message_id - 10)
        await    bot.deleteMessage(data.chat.id, data.message_id - 11)
        await bot.sendMessage(name_as_id(USER.get(data.chat.id).map.users), `Приоритет - ${USER.get(data.chat.id).map.priority}\n«${USER.get(data.chat.id).map.name}»\n\nОписание:\n${USER.get(data.chat.id).map.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', USER.get(data.chat.id).map.date)}\n\nПостановщик: ${id_as_name(USER.get(data.chat.id).chat_id)}`)
        await bot.sendMessage(USER.get(data.chat.id).chat_id, `Приоритет - ${USER.get(data.chat.id).map.priority}\n«${USER.get(data.chat.id).map.name}»\n\nОписание:\n${USER.get(data.chat.id).map.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', USER.get(data.chat.id).map.date)}\nИсполнитель: ${USER.get(data.chat.id).map.users}`, {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": [
                    [{ text: "Продолжайте работать", }],
                ]
            }
        })
        await    bot.deleteMessage(data.chat.id, data.message_id + 1)
        USER.delete(data.chat.id)

    }
})

myEmitter.on('/new_project', async data => {
    if (USER.get(data.chat.id).map.num == 1) {
        USER.get(data.chat.id).map.name = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Введите имя челвоека, с кем общаетесь по проекту:') 
    } 
    if (USER.get(data.chat.id).map.num == 2 ) {
        USER.get(data.chat.id).map.text = {}
        USER.get(data.chat.id).map.text.name = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Введите телефон человека с проекта или "0", если его нет:') 
    } 
    if (USER.get(data.chat.id).map.num == 3) {
        if(data.text != `0`) USER.get(data.chat.id).map.text.phone = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Введите почту человека с проекта или "0", если его нет:') 
    } 
    if (USER.get(data.chat.id).map.num == 4) {
        if(data.text != `0`) USER.get(data.chat.id).map.text.email = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Введите кратко цель проекта:') 
    } 
    if (USER.get(data.chat.id).map.num == 5) {
        USER.get(data.chat.id).map.text.can = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Опишите проект, или просто оставьте замечание по нему:') 
    }  
    if (USER.get(data.chat.id).map.num == 6) {
            arr_workers  = [
            [{text: 'Готово'}],
            [{ text: "Артем", }],
            [{ text: "Ренат", }],
            [{ text: "Илья", }],
            [{ text: "Антон", }],
        ]
        USER.get(data.chat.id).map.text.comment = data.text
        USER.get(data.chat.id).map.worsers = []
        // arr_workers.map((i, index)=>{
        //     if(i[0].text == id_as_name(data.chat.id)){
        //         _name_puser_project = i[0].text
        //         arr_workers.splice(index, 1)
        //     }
        // })
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Введите тех, кто работает на проекте и нажмите "Готово"', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": arr_workers
            }
        }).then((res)=>{
            control_message_id = res.message_id
        })
    } 
    if ( USER.get(data.chat.id).map.num > 6 && USER.get(data.chat.id).map.num < 100 && data.text != 'Готово') {
       await bot.deleteMessage(USER.get(data.chat.id).chat_id, control_message_id)
       USER.get(data.chat.id).map.worsers.push({name: data.text, id: +name_as_id(data.text)})
    //    arr_workers.push(_name_puser_project)
         arr_workers.map((i, index)=>{
                    if(i[0].text == data.text){
                        arr_workers.splice(index, 1)
                    }
                })

       await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Готово?',
            {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": arr_workers
            }} 
            ).then((res)=>{
                control_message_id = res.message_id
               })
         
    }
    // END
    if ( USER.get(data.chat.id).map.num > 7   && data.text == 'Готово') {
        USER.get(data.chat.id).map.num = USER.get(data.chat.id).map.num + 100
        await bot.deleteMessage(USER.get(data.chat.id).chat_id, control_message_id)
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Ввебирите куратора проекта, который будет отвечать за выполнение проектов:', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": arr_workers
            }
        }).then((res)=>{
            control_message_id = res.message_id
        })
    }
        if ( USER.get(data.chat.id).map.num > 100 &&  data.text != 'Готово' ) {
        await bot.deleteMessage(USER.get(data.chat.id).chat_id, control_message_id)
        USER.get(data.chat.id).map.num = USER.get(data.chat.id).map.num + 100
        USER.get(data.chat.id).map.kurator = {name: data.text, id: +name_as_id(data.text)}
        USER.get(data.chat.id).map.worsers.push({name: data.text, id: +name_as_id(data.text)})

        }


    if ( USER.get(data.chat.id).map.num > 200 ){
            const New_project_save = new New_project({
                                                    name: USER.get(data.chat.id).map.name,
                                                    text: {
                                                        comment: USER.get(data.chat.id).map.text.comment,
                                                        name: USER.get(data.chat.id).map.text.name,
                                                        phone: USER.get(data.chat.id).map.text.phone,
                                                        email: USER.get(data.chat.id).map.text.email,
                                                        can: USER.get(data.chat.id).map.text.can
                                                    },
                                                    worsers: USER.get(data.chat.id).map.worsers,
                                                    kurator: USER.get(data.chat.id).map.kurator


                                                })
        New_project_save.save()
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Успешно', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": [
                    [{ text: "Продолжайте работать", }],
                ]
            }})
            console.log(USER.get(data.chat.id).map);
            USER.delete(data.chat.id)
       
         }
})

myEmitter.on('new_task_from_project', async data =>{
    if (USER.get(data.chat.id).map.num == 1) {
        USER.get(data.chat.id).map.task_name = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Введите описание:') 
        

    }
    if (USER.get(data.chat.id).map.num == 2) {
        let arr_date =[]
        for (let i = 0; i < 336; i = i + 24){
            if(+date_format.formatUsers('hh') < 18){
                arr_date.push(
                    [{ text: `${date_format.formatUsers('DD.MM.YY', +i )}`, }]
                    )
            }else{
                arr_date.push(
                    [{ text: `${date_format.formatUsers('DD.MM.YY', +i + 24)}`, }]
                    )
            }
        }
        // return async ()=>{
            USER.get(data.chat.id).map.text = data.text
         bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите дату', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": arr_date
            }
        })
    // }

    }
    if (USER.get(data.chat.id).map.num == 3) {
        let arr_date_date = []
        if(USER.get(data.chat.id).map.num == 3 && date_format.formatUsers('DD.MM.YY') == data.text){
            for(let i = 0; i < 10; i++){
                if(+date_format.formatUsers('hh') + i < 19 && +date_format.formatUsers('hh') + i != +date_format.formatUsers('hh')){
                    arr_date_date.push(
                        [{text: `${+date_format.formatUsers('hh') + i}:00`}]
                        )
                }
            }
        }else{
            arr_date_date = [
                [{ text: `09:00`, }],
                [{ text: `10:00`, }],
                [{ text: `11:00`, }],
                [{ text: `12:00`, }],
                [{ text: `13:00`, }],
                [{ text: `14:00`, }],
                [{ text: `15:00`, }],
                [{ text: `16:00`, }],
                [{ text: `17:00`, }],
                [{ text: `18:00`, }],
            ]
        }
        // return async ()=>{
            USER.get(data.chat.id).map._date = []
            USER.get(data.chat.id).map._date.push(data.text)
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите время:', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": arr_date_date
                
            }
        })
    // }
    }
    if (USER.get(data.chat.id).map.num == 4) {
        // return async ()=>{
            USER.get(data.chat.id).map._date.push(data.text)
            USER.get(data.chat.id).map.date = date_format.formatParse(USER.get(data.chat.id).map._date[0]) + date_format.formatParse(`${USER.get(data.chat.id).map._date[1]}:00`) - (3600 * 3 * 1000)
        await bot.sendMessage(data.chat.id, 'Выбирите исполнителя:', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": [
                    [{ text: "Артем", }],
                    [{ text: "Ренат", }],
                    [{ text: "Илья", }],
                    [{ text: "Антон", }],
                ]
            }
        })
    // }
    }
    if (USER.get(data.chat.id).map.num == 5) {
        // return async ()=>{
            USER.get(data.chat.id).map.users = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите приоритет задачи:', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": [
                    [{ text: "🤷", }],
                    [{ text: "🔥", }],
                    [{ text: "🔥🔥", }],
                    [{ text: "🔥🔥🔥", }],
                ]
            }
        })
    // }
    }
    if (USER.get(data.chat.id).map.num == 6) {
        let kurator_project = await New_project.findOne({_id: USER.get(data.chat.id).map.task_id})

        id_task_schema = Date.now()
        USER.get(data.chat.id).map.priority = data.text
        USER.get(data.chat.id).map.chat_id = data.chat.id
        USER.get(data.chat.id).map.name_from_task = id_as_name(data.chat.id)
        USER.get(data.chat.id).map.id_task = id_task_schema
        console.log( USER.get(data.chat.id).map);
        let NewTask = new New_Task({
            chat_id: USER.get(data.chat.id).map.chat_id,
            name: USER.get(data.chat.id).map.task_name,
            text: USER.get(data.chat.id).map.text,
            date: USER.get(data.chat.id).map.date,
            users: USER.get(data.chat.id).map.users,
            priority: USER.get(data.chat.id).map.priority,
            name_from_task: kurator_project.kurator.name,
            id_task: id_task_schema,
            id_users: name_as_id(USER.get(data.chat.id).map.users),
            from : 'project'
        })
        NewTask.save((err) => { console.log(err); })
        await New_project.updateOne({ _id: USER.get(data.chat.id).map.task_id }, { $push: { tasks: NewTask._id } })
        if (USER.get(data.chat.id).map.priority == "🤷") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 1 } })
        if (USER.get(data.chat.id).map.priority == "🔥") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 2 } })
        if (USER.get(data.chat.id).map.priority == "🔥🔥") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 3 } })
        if (USER.get(data.chat.id).map.priority == "🔥🔥🔥") await New_Worker.updateOne({ name: USER.get(data.chat.id).map.users }, { $inc: { workload: 4 } })
        
        await    bot.deleteMessage(data.chat.id, data.message_id)
        await    bot.deleteMessage(data.chat.id, data.message_id - 1)
        await    bot.deleteMessage(data.chat.id, data.message_id - 2)
        await    bot.deleteMessage(data.chat.id, data.message_id - 3)
        await    bot.deleteMessage(data.chat.id, data.message_id - 4)
        await    bot.deleteMessage(data.chat.id, data.message_id - 5)
        await    bot.deleteMessage(data.chat.id, data.message_id - 6)
        await    bot.deleteMessage(data.chat.id, data.message_id - 7)
        await    bot.deleteMessage(data.chat.id, data.message_id - 8)
        await    bot.deleteMessage(data.chat.id, data.message_id - 9)
        await    bot.deleteMessage(data.chat.id, data.message_id - 10)
        await    bot.deleteMessage(data.chat.id, data.message_id - 11)
        await bot.sendMessage(name_as_id(USER.get(data.chat.id).map.users), `Приоритет - ${USER.get(data.chat.id).map.priority}\n«${USER.get(data.chat.id).map.task_name}»\n\nОписание:\n${USER.get(data.chat.id).map.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', USER.get(data.chat.id).map.date)}\n\nПостановщик: ${id_as_name(USER.get(data.chat.id).chat_id)}`)
        await bot.sendMessage(USER.get(data.chat.id).chat_id, `Приоритет - ${USER.get(data.chat.id).map.priority}\n«${USER.get(data.chat.id).map.task_name}»\n\nОписание:\n${USER.get(data.chat.id).map.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', USER.get(data.chat.id).map.date)}\nИсполнитель: ${USER.get(data.chat.id).map.users}`, {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": true,
                "keyboard": [
                    [{ text: "Продолжайте работать", }],
                ]
            }
        })
        await    bot.deleteMessage(data.chat.id, data.message_id + 1)
        USER.delete(data.chat.id)

    }
})

myEmitter.on('false', async data =>{
    if (USER.get(data.chat.id).map.num == 1) {
        USER.get(data.chat.id).map.text = data.text
        let arr_date_date =[]
            for(let i = 0; i < 336; i = i + 24){
                if(+date_format.formatUsers('hh') < 18){
                    arr_date_date.push(
                        [{ text: `${date_format.formatUsers('DD.MM.YY', +i)}`, }]
                        )
                }else{
                    arr_date_date.push(
                        [{ text: `${date_format.formatUsers('DD.MM.YY', +i + 24)}`, }]
                        )
                }
            }
            await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите дату', {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "resize_keyboard": true,
                    "one_time_keyboard": true,
                    "keyboard": arr_date_date
                }
            })
    } 
    if (USER.get(data.chat.id).map.num == 2) {
        let arr_date_time = []
            if(USER.get(data.chat.id).map.num == 2 && date_format.formatUsers('DD.MM.YY') == data.text){
                for(let i = 0; i < 10; i++){
                    if(date_format.formatUsers('hh', + i) < 19 && +date_format.formatUsers('hh', + i) != date_format.formatUsers('hh')){
                        arr_date_time.push(
                            [{text: `${date_format.formatUsers('hh',  + i)}:00`}]
                            )
                    }
                }
            }else{
                arr_date_time = [
                    [{ text: `09:00`, }],
                    [{ text: `10:00`, }],
                    [{ text: `11:00`, }],
                    [{ text: `12:00`, }],
                    [{ text: `13:00`, }],
                    [{ text: `14:00`, }],
                    [{ text: `15:00`, }],
                    [{ text: `16:00`, }],
                    [{ text: `17:00`, }],
                    [{ text: `18:00`, }],
                ]
            }
            // return async ()=>{
                USER.get(data.chat.id).map._date = []
                USER.get(data.chat.id).map._date.push(data.text)
            await bot.sendMessage(USER.get(data.chat.id).chat_id, 'Выбирите время:', {
                "parse_mode": "Markdown",
                "reply_markup": {
                    "resize_keyboard": true,
                    "one_time_keyboard": true,
                    "keyboard": arr_date_time
                    
                }
            }) 
    } 

    if (USER.get(data.chat.id).map.num == 3){
        if(USER.get(data.chat.id).map.flag != 'project'){
            USER.get(data.chat.id).map._date.push(data.text)
            USER.get(data.chat.id).map.date = date_format.formatParse(USER.get(data.chat.id).map._date[0]) + date_format.formatParse(`${USER.get(data.chat.id).map._date[1]}:00`) - (3600 * 3 * 1000)
        console.log(date_format.formatMillis('DD.MM.YY hh:mm', USER.get(data.chat.id).map.date));
        let task = await New_Task.findOne({_id: USER.get(data.chat.id).map.task_id})
        let project_id_kurator = await New_project.findOne({tasks: {_id: USER.get(data.chat.id).map.task_id}}).populate('tasks')
        let us_id
        if(project_id_kurator == null){
            us_id = task.chat_id
        }else{
            us_id =  project_id_kurator.chat_id 
        }
        bot.sendMessage(task.chat_id, `${task.users} хочет перенести задачу «${task.name}»\nС описанием: ${task.text}\n\nНа ${USER.get(data.chat.id).map._date[0]} ${USER.get(data.chat.id).map._date[1]}\n\nКомментарий: ${USER.get(data.chat.id).map.text}\n\nПодтвердите:`,
        {
            reply_markup:
                JSON.stringify({
                    inline_keyboard: [
                        [{ text: 'Перенос одобряю', callback_data: `perenos_${task._id}_${USER.get(data.chat.id).map.date}_${id_as_name(USER.get(data.chat.id).chat_id)}` },
                        { text: 'Не переносить', callback_data: `doroesfsefesf` }],
                    ]
                })
             })
         }else{
            USER.get(data.chat.id).map._date.push(data.text)
            USER.get(data.chat.id).map.date = date_format.formatParse(USER.get(data.chat.id).map._date[0]) + date_format.formatParse(`${USER.get(data.chat.id).map._date[1]}:00`) - (3600 * 3 * 1000)
            console.log(date_format.formatMillis('DD.MM.YY hh:mm', USER.get(data.chat.id).map.date));
            let task = await New_Task.findOne({_id: USER.get(data.chat.id).map.task_id})
            let project_id_kurator = await New_project.findOne({tasks: {_id: USER.get(data.chat.id).map.task_id}}).populate('tasks')
            let us_id
            if(project_id_kurator == null){
                us_id = task.chat_id
            }else{
                us_id =  project_id_kurator.kurator.id
            }
            bot.sendMessage(us_id, `${task.users} хочет перенести задачу «${task.name}»\nС описанием: ${task.text}\n\nНа ${iterator._date[0]} ${iterator._date[1]}\n\nКомментарий: ${iterator.text}\n\nПодтвердите:`,
            {
                reply_markup:
                    JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Перенос одобряю', callback_data: `perenos_${task._id}_${USER.get(data.chat.id).map.date}_${id_as_name(USER.get(data.chat.id).chat_id)}` },
                            { text: 'Не переносить', callback_data: `doroesfsefesf` }],
                        ]
                    })
                 })
         }
         USER.delete(data.chat.id)
    }
})
myEmitter.on('/new_client', async data =>{
    if (USER.get(data.chat.id).map.num == 1){
        USER.get(data.chat.id).map.name_client = data.text
        await bot.sendMessage(USER.get(data.chat.id).chat_id, `Введите номер:`, {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": [
                    [{text: 'Без номера'}]
                ]
            }
        })
    }
    if (USER.get(data.chat.id).map.num == 2){
        if(data.text == 'Без номера'){
            USER.get(data.chat.id).map.number_phone = 0
        }else{
            USER.get(data.chat.id).map.number_phone = data.text
        }
        await bot.sendMessage(USER.get(data.chat.id).chat_id, `Введите почту:`, {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": [
                    [{text: 'Без почты'}]
                ]
            }
        })
    }
    if (USER.get(data.chat.id).map.num == 3){
        if(data.text == 'Без почты'){
            USER.get(data.chat.id).map.mail = 'Почты нет'
        }else{
            USER.get(data.chat.id).map.mail = data.text
        }
        await bot.sendMessage(USER.get(data.chat.id).chat_id, `Цель заявки:`, {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": [
                    [{text: 'Цель не ясна'}]
                ]
            }
        })
    }
    if (USER.get(data.chat.id).map.num == 4){
        if(data.text == 'Цель не ясна'){
            USER.get(data.chat.id).map.con = 'Цель не указана'
        }else{
            USER.get(data.chat.id).map.con = data.text
        }
        await bot.sendMessage(USER.get(data.chat.id).chat_id, `Комментарий к клиенту:`, {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": [
                    [{text: 'Без комментария'}]
                ]
            }
        })
    }
    if (USER.get(data.chat.id).map.num == 5){
        if(data.text == 'Без комментария'){
            USER.get(data.chat.id).map.comment = 'Не оставил комментарий'
        }else{
            USER.get(data.chat.id).map.comment = data.text
        }
        console.log(USER.get(data.chat.id).map);
        USER.delete(data.chat.id)
    }
})

let flag = false
bot.onText(/\/new_task/, async msg => { 
    await    bot.deleteMessage(msg.chat.id, msg.message_id)
    USER.set(msg.chat.id, new Users_msg(msg.chat.id, msg.text)) 
    bot.sendMessage(msg.chat.id, 'Введите название задачи:') 
})

bot.onText(/\/new_client/, async msg =>{
    await  bot.deleteMessage(msg.chat.id, msg.message_id)
    USER.set(msg.chat.id, new Users_msg(msg.chat.id, msg.text)) 
    bot.sendMessage(msg.chat.id, 'Введите имя клиента:') 

})

bot.onText(/\/new_project/, async msg =>{
    await    bot.deleteMessage(msg.chat.id, msg.message_id)
    USER.set(msg.chat.id, new Users_msg(msg.chat.id, msg.text)) 
    bot.sendMessage(msg.chat.id, 'Введите название проекта:')
})

bot.onText(/\/workers/, async msg =>{
    await bot.deleteMessage(msg.chat.id, msg.message_id)
    let work_load = await New_Worker.find({})
    let message_as_workers = []
    work_load.map((i)=>{
        message_as_workers.push(i.name + ' ' + workload_as_smail(i.workload))
    })

    await bot.sendMessage(msg.chat.id, message_as_workers.join('\n')) 
})
bot.onText(/\/stop/, async msg =>{
    await bot.deleteMessage(msg.chat.id, msg.message_id)
    USER.delete(msg.from.id)
    await bot.sendMessage(msg.chat.id, 'Ввод отменен').then((data)=>{
        setTimeout(()=>{
             bot.deleteMessage(data.chat.id, data.message_id)
        }, 800)
       
    })
})


// bot.onText('/test', async msg =>{
//   await  bot.sendMessage(msg.chat.id, '[s]TEST[/s]')
// })


let New_Users_Schema
bot.onText(/\/newuser/, async msg => {
    await bot.deleteMessage(msg.chat.id, msg.message_id)
    New_Users_Schema = {}
    if (msg.chat.id == 1280484134) {
        flag = 'new_user'
        it = generator_new_user()
        await bot.sendMessage(msg.chat.id, 'Перешли сообщение от пользователя')
    }
})

function workload_as_smail(workload) {
    if (workload < 5) return `🟢`
    if (workload >= 5 && workload < 7) return `🔵`
    if (workload >= 7 && workload < 10) return `🟡`
    if (workload >= 10) return `🔴`
}
bot.onText(/\/my_tasks/, async msg => {
    await bot.deleteMessage(msg.chat.id, msg.message_id)
    let project_users = await New_project.find({"worsers.id": msg.chat.id}).populate(`tasks`)

    let arr_name_project = []
    let users_arr = await New_Worker.findOne({ chat_id: msg.chat.id }).populate(`tasks`)
    let length_task_from_user = 0
    let prsrochka = ''
    let tasks_from_project = []
    let tasks_arr = []
    let doner = ''
    let doner_2 = ''
    let iterator_tasks = 1
    if(project_users.length != 0 && project_users.length != undefined){
    for(i of project_users[0].tasks){
        if( i.users == id_as_name(msg.chat.id))  length_task_from_user = length_task_from_user + 1 
    }
    
    project_users.map((i, iterable)=>{
        if(i.tasks.length > 1){
            for(tasks of i.tasks){
                if(tasks.id_users == msg.chat.id || i.kurator.id == msg.chat.id){
                        if(tasks.two_h){
                            prsrochka =  `🔥`
                        }else if(tasks.twenteen_m){
                            prsrochka =  `🔥🔥`
                        }else if(tasks.over_time){
                            prsrochka =  `🔥🔥🔥`
                        }
                    if(tasks.done){
                        doner = '<strike>'
                        doner_2 = '</strike>'
                    }
                        tasks_from_project.push(`${iterator_tasks}. ${doner}${tasks.name}${doner_2} ${prsrochka}`)
                        iterator_tasks++
                        prsrochka = ''
                        doner = ''
                        doner_2 = ''
                }
            }
            iterator_tasks= 1
        }else if (i.tasks.length == 1){
            if(i.tasks.done){
                doner = '<strike>'
                doner_2 = '</strike>'
            }
            tasks_from_project.push(`${iterator_tasks}. ${doner}${i.tasks[0].name}${doner_2} ${prsrochka}`)
            prsrochka = ''
            doner = ''
            doner_2 = ''
            iterator_tasks= 1
        }else if(i.tasks.length == 0){
            tasks_from_project = ['']
        }

        
        arr_name_project.push(`${number_as_smailnumber(iterable + 1)}«${i.name}» ${workload_as_smail(i.workload)}
Моих задач: ${length_task_from_user}
${tasks_from_project.join('\n')}`)
        length_task_from_user = 0
        tasks_from_project = ['']
        })
    }else{
        project_users.length = 0
        arr_name_project = ['Вы пока не учавствуете в проектах']
    }
    users_arr.tasks.map((i)=>{
    // if(i.id_users == msg.chat.id ||)
    if(i.two_h){
        prsrochka =  `🔥`
    }else if(i.twenteen_m){
        prsrochka =  `🔥🔥`
    }else if(i.over_time){
        prsrochka =  `🔥🔥🔥`
    }
    if(i.done){
            doner = '<strike>'
            doner_2 = '</strike>'
    }
    tasks_arr.push(`${iterator_tasks}. ${doner}${i.name}${doner_2} ${prsrochka}`)
    prsrochka = ''
    doner = ''
    doner_2 = ''
    })
    console.log(inline_keyboard_projects(project_users.length, 'see_project', project_users)[1]);
    await bot.sendMessage(msg.chat.id, `Загруженность: ${workload_as_smail(users_arr.workload)}\nКоличество задач: ${users_arr.tasks.length}
${tasks_arr.join('\n')}\n\nПроекты:\n${arr_name_project.join('\n')}`, {
        parse_mode: 'HTML',
        reply_markup: JSON.stringify({
            inline_keyboard: [
                inline_keyboard_projects(project_users.length, 'see_project', project_users)[0],
                inline_keyboard_projects(project_users.length, 'see_project', project_users)[1],
                [{ text: 'Мои задачи вне проекта', callback_data: 'see_tasks' }],
                [{ text: 'Посмотреть только важные задачи', callback_data: 'see_tasks_best' }],
            ]
        })
    })
})


async function win_task(iterator, data){
    if (iterator.num == 1 && iterator.id == data.chat.id) {

        iterator.tasks = data.text
       await bot.sendMessage(data.chat.id, 'Отправлено на рассмотрение').then((res)=>{
           setTimeout(()=>{
           bot.deleteMessage(data.chat.id ,res.message_id)
        },1500)
       })
    
       let send_from_kurator_or_user
    // if (iterator.num == 2 && iterator.id == data.chat.id) {
        let tasks_arr1 = await New_Task.findOne({ _id: iterator.task_id })
        if(tasks_arr1.from == 'project'){
            send_from_kurator_or_user = name_as_id(tasks_arr1.name_from_task)
        }else{
            send_from_kurator_or_user = tasks_arr1.chat_id
        }
        await New_Task.updateOne({_id: iterator.task_id}, {comment: iterator.tasks})
        await bot.sendMessage(send_from_kurator_or_user, `${tasks_arr1.users} выполнил задачу «${tasks_arr1.name}»\nКомментарий:\n${iterator.tasks}\n\nПодтвердите, или отправьте на доработку`,
            {
                reply_markup:
                    JSON.stringify({
                        inline_keyboard: [
                            [{ text: 'Задача выполнена', callback_data: `del_${data.chat.id}_${tasks_arr1._id}` }],
                            [{ text: 'Нужна доработка', callback_data: `dorob_${data.chat.id}_${tasks_arr1._id}` }],
                        ]
                    })
            })
    }
}


bot.onText(/\/encrypt/, async msg =>{
    USER.set(msg.chat.id, new Users_msg(msg.chat.id, msg.text)) 
    bot.sendMessage(msg.chat.id, 'Введите сообщение для зашифровки') 
})

bot.onText(/\/reencrypt/, async msg =>{
    USER.set(msg.chat.id, new Users_msg(msg.chat.id, msg.text)) 
    bot.sendMessage(msg.chat.id, 'Введите сообщение для дешифровки') 
})

bot.on('message', async msg => {
    
    if(tim_worker.has(msg.chat.id)){



    if(!msg.text.startsWith('/')){
        if(USER.has(msg.chat.id)){
            USER.get(msg.chat.id).map.num++
           myEmitter.emit(USER.get(msg.chat.id).name_event, msg) 
           USER.get(msg.chat.id)
        }
    }
    



//users_from_cotnext

let index_arr_users_from_cotnext = async ()=>{
    return  users_from_cotnext.findIndex( (i, index, set)=>{return i.id == msg.chat.id})
  } 

  if (users_from_cotnext[ await index_arr_users_from_cotnext()] != undefined) {

    if(users_from_cotnext[ await index_arr_users_from_cotnext()].num == 3){
       flag = false
       proverka = true
       users_from_cotnext.splice(await index_arr_users_from_cotnext(), 1)
    //    bot.sendMessage(users_from_cotnext.id, 'OK')
    }

    if(users_from_cotnext[await index_arr_users_from_cotnext()] != undefined){
        users_from_cotnext[await index_arr_users_from_cotnext()].num++
        await perenos(users_from_cotnext[await index_arr_users_from_cotnext()], msg)
        bot.sendMessage(users_from_cotnext[await index_arr_users_from_cotnext()].id, 'Отправлено на рассмотрение')
    }
}
//win_task_context



let index_win_task_context = async ()=>{
    return  win_task_context.findIndex( (i, index, set)=>{return i.id == msg.chat.id})
  } 

  if (win_task_context[ await index_win_task_context()] != undefined) {

    if(win_task_context[ await index_win_task_context()].num == 1){
       flag = false
       proverka = true
       win_task_context.splice(await index_win_task_context(), 1)
    //    bot.sendMessage(users_from_cotnext.id, 'OK')
    }

    if(win_task_context[await index_win_task_context()] != undefined){
        win_task_context[await index_win_task_context()].num++
        await win_task(win_task_context[await index_win_task_context()], msg)
        // console.log(users_from_cotnext);
        // bot.sendMessage(users_from_cotnext[await index_arr_users_from_cotnext()].id, 'Отправлено на рассмотрение')
        // await push_project(users_from_cotnext[await index_arr_users_from_cotnext()], msg, users_from_cotnext)
    }
}




    if (flag == 'new_user') {
        let g = generator_new_user()
            let k = g
            let b = k.next().value
            b(msg)
    }
}
})

