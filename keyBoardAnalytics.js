// require('./app')
const DATE = require('formaster_date_and_time')
const date_format = new DATE()
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


class Users_msg{
    constructor(chat_id, name_event){
        this.chat_id = chat_id;
        this.name_event = name_event;
        this.map = {num: 0}
    }

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

function name_as_id(name) {
    if (name == 'Артем') return 1280484134
    if (name == 'Никита') return 1463068196
    if (name == 'Ренат') return 209057817
    if (name == 'Рустам') return undefined
    if (name == 'Илья') return 237077795
    if (name == 'Антон') return 296427186
    if (name == 'Юрий') return 577046733
}
function id_as_name(name) {
    if (name == '1280484134') return `Артем`
    if (name == '1463068196') return `Никита`
    if (name == '209057817') return `Ренат`
    if (name == 'Рустам') return undefined
    if (name == '237077795') return `Илья`
    if (name == '296427186') return `Антон` 
    if (name == '577046733') return `Юрий`
}

function workload_as_smail(workload) {
    if (workload < 5) return `🟢`
    if (workload >= 5 && workload < 7) return `🔵`
    if (workload >= 7 && workload < 10) return `🟡`
    if (workload >= 10) return `🔴`
}
let proverka = true
async function keyBoardAnalytics(query){
    const  { chat, message_id, text } = query.message

    switch (query.data) {
        case 'see_tasks':
            await bot.deleteMessage(chat.id, message_id)
            let arr_tasks_worker2 = await New_Worker.findOne({ chat_id: chat.id }).populate(`tasks`)
            
        console.log(arr_tasks_worker2);
            for (i of arr_tasks_worker2.tasks) {
                await bot.sendMessage(chat.id, `Приоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', i.date)}\n\nЗадача от: ${i.name_from_task}`,
                    {
                        reply_markup:
                            JSON.stringify({
                                inline_keyboard: [
                                    [{ text: 'Выполнена', callback_data: `win_${chat.id}_${i._id}` },
                                    {text: 'Перенести дату', callback_data: `false_${chat.id}_${i._id}`}],
                                ]
                            })
                    })
            }
            break

 
        case 'see_tasks_best':
            await bot.deleteMessage(chat.id, message_id)
            let arr_tasks_worker = await New_Worker.findOne({ chat_id: chat.id }).populate(`tasks`)
            
            for (i of arr_tasks_worker.tasks) {
                if (i.priority == '🔥🔥🔥') {
                    await bot.sendMessage(chat.id, `Приоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', i.date)}\n\nЗадача от: ${i.name_from_task}`,
                        {
                            reply_markup:
                                JSON.stringify({
                                    inline_keyboard: [
                                        [{ text: 'Выполнена', callback_data: `win_${chat.id}_${i.tasks._id}` },
                                        {text: 'Перенести дату', callback_data: `false_${chat.id}_${i.tasks._id}`}],
                                    ]
                                })
                        })
                }
            }
            break

    }
    /*
    #####################
    Когда работник хочет выполнить задачу
    */

    if(query.data.startsWith('start_working')){
        let id_users = query.data.split('_') // 2
        await New_Worker.updateOne({_id: id_users[2]}, {working: true}).then(()=>{
            bot.sendMessage(id_users[2], 'Рабочий день начат')
        })
    }

    if(query.data.startsWith('see_project_')){
        let id_project = query.data.split('_') // 3
        let project_list = await New_project.findOne({_id: id_project[3]}).populate('tasks')
        let task_number = 1
        let worses = []
        let tasks = []
        let doner = ''
        let doner_2 = ''
        let comment_from_task = ''
        let tasks_list = []

        let keyboard_from_project = []

        let task_length
        if(project_list.tasks.length == 0){
            task_length = 0
        }

        if(project_list.kurator.id == chat.id){
            task_length = project_list.tasks.length
            tasks_list = project_list.tasks
            keyboard_from_project.push([{text: 'Добавить человека в проект', callback_data: `pushnewuser_${project_list._id}`}],
                                        [{text: 'Закрыть проект', callback_data: `delited_project_${project_list._id}`}],)
        }else{
            let iter = 0
            project_list.tasks.map((i)=>{
                if(i.id_users == chat.id && i.done == false){
                    tasks_list.push(i)
                    iter++
                }
                task_length = iter
            })
            keyboard_from_project[0] = []
            keyboard_from_project[1] = []
        }

        project_list.worsers.map((i)=>{
            worses.push(i.name)
        })

        if(project_list.tasks.length !=0){
           for(task of project_list.tasks){
            if(project_list.kurator.id == chat.id){
                if(task.done){
                    doner = '<strike>'
                    doner_2 = '</strike>'
                    comment_from_task = task.comment
                }
                tasks.push(`${number_as_smailnumber(task_number)} ${doner}${task.name}${doner_2}\n${comment_from_task}`) 
                task_number++
                doner = ''
                doner_2 = ''
                comment_from_task = ''
                }else if(task.id_users == chat.id && project_list.kurator.id != chat.id){
                    if(!task.done){
                        tasks.push(`${number_as_smailnumber(task_number)} ${doner}${task.name}${doner_2}\n${comment_from_task}`) 
                        task_number++
                        doner = ''
                        doner_2 = ''
                        comment_from_task = ''
                    }
                }
            } 
        }

await  bot.sendMessage(chat.id, `«${project_list.name}»
Загруженность: ${workload_as_smail(project_list.workload)}
Куратор проекта: ${project_list.kurator.name}
Работники на проекте:\n${worses.join('\n')}
\n${tasks.join('\n')}`,{parse_mode: 'HTML',reply_markup: JSON.stringify({
    inline_keyboard: [
        inline_keyboard_projects(task_length, 'tasks', tasks_list)[0],
        inline_keyboard_projects(task_length, 'tasks', tasks_list)[1],
        [{text: 'Новая задача на проект', callback_data: `new_task_from_project_${project_list._id}`}],
        keyboard_from_project[0],
        keyboard_from_project[1],
        [{text: 'Информация по проекту', callback_data: `info_from_project_${project_list._id}`}],
    ]
})})
    }

    if(query.data.startsWith('tasks_')){
        let id_tasks = query.data.split('_') // 2
        let tasks = await New_Task.findOne({_id: id_tasks[2]})
        let board

        if(tasks.id_users != chat.id){
            board = [{ text: 'Напомнить', callback_data: `help_${tasks._id}` },
                    {text: 'Перенести дату', callback_data: `false_${chat.id}_${tasks._id}`}]
        }else{
            board = [{ text: 'Выполнена', callback_data: `win_${chat.id}_${tasks._id}` },
                    {text: 'Перенести дату', callback_data: `false_no_${chat.id}_${tasks._id}`}]
        }
        
        bot.sendMessage(chat.id, `Приоритет - ${tasks.priority}\n«${tasks.name}»\n\nОписание:\n${tasks.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', tasks.date)}\n\nКуратор: ${tasks.name_from_task}`,
                    {
                        reply_markup:
                            JSON.stringify({
                                inline_keyboard: [board]
                            })
                    })
    }

    if(query.data.startsWith('info_from_project_')){
        let id_project = query.data.split('_') // 3
        let info_project = await New_project.findOne({_id: id_project[3]})
        await bot.sendMessage(chat.id, `${info_project.name}\n\n${info_project.text.comment}\n\nКонтактные данные на входе:\n${info_project.text.name}\n${info_project.text.phone}\n${info_project.text.email}\n${info_project.text.can}`)
    }


    if(query.data.startsWith('win_')){
        // await bot.deleteMessage(chat.id, message_id)
        let id_task = query.data.split('_')
        // let tasks_arr = await New_Task.findOne({ _id: id_task[2] })
        await bot.deleteMessage(chat.id, message_id)
        
        
        win_task_context.forEach((value, index, map)=>{
            if( value.id == chat.id){
                proverka = false
            }
        })
            if(proverka){
               (async ()=>{ win_task_context.push({id: chat.id, num: 0, task_id: id_task[2], flag: 'project'})})().then((res)=>{
                bot.sendMessage(chat.id, 'Оставьте комментарий к задаче', {
                    "parse_mode": "Markdown",
                    "reply_markup": {
                        "resize_keyboard": true,
                        "one_time_keyboard": false,
                        "keyboard": [
                            [{text: 'Без комментария'}]
                        ]
                    }
                }) 
               })
            }
    }

    if(query.data.startsWith('delited_project_')){
        await bot.deleteMessage(chat.id, message_id)
        let id_project = query.data.split('_')
        bot.sendMessage(chat.id, 'Проект успешно закрыт')
        let delited_project_see_tasks = await New_project.findOne({ _id: id_project[2] })
        delited_project_see_tasks.tasks.map(async (i)=>{
            await New_Task.deleteOne({_id: i._id})
        })
        await New_project.deleteOne({ _id: id_project[2] });
    }

    if(query.data.startsWith('tasks_project_')){
        let id_task = query.data.split('_')
        await bot.deleteMessage(chat.id, message_id)
        let task_from_project = await New_project.findOne({_id: id_task[2]}).populate(`tasks`)
  
        if(task_from_project.tasks.length == 0){ 
            bot.sendMessage(chat.id, 'Задач на проекте нет')
        }
        else {
            if(task_from_project.kurator.id != chat.id){
            for(i of task_from_project.tasks){
                if(i.users == id_as_name(chat.id) && i.done != true){
                    bot.sendMessage(chat.id, `Приоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', i.date)}\n\nКуратор: ${i.name_from_task}`,
                    {
                        reply_markup:
                            JSON.stringify({
                                inline_keyboard: [
                                    [{ text: 'Выполнена', callback_data: `win_${chat.id}_${i._id}` },
                                    {text: 'Перенести дату', callback_data: `false_on_${chat.id}_${i._id}`}],
                                ]
                            })
                    })
                }
            }
        }else{
            for(i of task_from_project.tasks){
                if(i.users == id_as_name(chat.id) && i.done != true){
                    bot.sendMessage(chat.id, `Приоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', i.date)}\n\nКуратор: ${i.name_from_task}`,
                    {
                        reply_markup:
                            JSON.stringify({
                                inline_keyboard: [
                                    [{ text: 'Выполнена', callback_data: `win_${chat.id}_${i._id}` },
                                    {text: 'Перенести дату', callback_data: `false_${chat.id}_${i._id}`}],
                                ]
                            })
                    })
                }else{
                    console.log(i);
                    if(i.done != true){
                        bot.sendMessage(chat.id, `#########\nЗадача работника\n#########\nПриоритет - ${i.priority}\n«${i.name}»\n\nОписание:\n${i.text}\n\nСрок выполнения: ${date_format.formatMillis('DD.MM.YY hh:mm', i.date)}\n\nКуратор: ${i.name_from_task}`,
                        {
                            reply_markup:
                                JSON.stringify({
                                    inline_keyboard: [
                                        [{ text: 'Напомнить о выполнении', callback_data: `help_${i._id}` },
                                        {text: 'Перенести дату', callback_data: `false_${chat.id}_${i._id}`}],
                                    ]
                                })
                        })
                    }else{
                        bot.sendMessage(chat.id, 'Незакрытых задач нет')
                    }
                }
            }
        }
    }
    }

    if(query.data.startsWith('new_task_from_project_')){
        let id_task = query.data.split('_')   
        USER.set(chat.id, new Users_msg(chat.id, `new_task_from_project`))
        USER.get(chat.id).map.task_id = id_task[4]
        bot.sendMessage(chat.id, 'Введите название задачи:')  
    }

    if(query.data.startsWith('help_')){
        let id_task = query.data.split('_') 
        let task = await New_Task.findOne({"_id": id_task[1]})
        let project = await New_project.findOne({tasks: {_id: id_task[1]}}).populate('tasks')
        // console.log(task);
        bot.sendMessage(name_as_id(task.users), `Куратор ${project.kurator.name} проекта «${project.name}» напоминает о необходимости выполнить задачу «${task.name}»`)
    }


    if (query.data.startsWith('false_')) {
        let flag
        let id_task = query.data.split('_')
        if(id_task[1] == 'on'){
            flag = 'project'
        }else{
            flag = 'tasks'
        }
        // let tasks_arr = await New_Task.findOne({ _id: id_task[2] })
        await bot.deleteMessage(chat.id, message_id)
        USER.set(chat.id, new Users_msg(chat.id, `false`))
        USER.get(chat.id).map.task_id = id_task[2]
        USER.get(chat.id).map.flag = flag
        bot.sendMessage(chat.id, 'Напишите причину переноса', {
            "parse_mode": "Markdown",
            "reply_markup": {
                "resize_keyboard": true,
                "one_time_keyboard": false,
                "keyboard": [
                    [{text: 'Без причины'}]
                ]
            }
        }) 
            }


    if(query.data.startsWith('perenos_')){
        try{

        let id_task = query.data.split('_')
        console.log(id_task);
        await New_Task.updateOne({"_id": id_task[1]}, {$set:{date: +id_task[2]}})
        await bot.sendMessage(name_as_id(id_task[3]), "Задача успешно перенесена")

        }catch(e){
            console.log(e);
        }
        
    }
    /*
    #####################
    Подтверждение выполнение задачи
    #####################
    */
    if (query.data.startsWith('del_')) {
        await bot.deleteMessage(chat.id, message_id)
        let id_task = query.data.split('_')
        await New_Task.updateOne({_id: id_task[2]}, {done: true, id_users: 0, users: 'none' })
        let task_user_or_not = await New_Task.findOne({_id: id_task[2]})
        await bot.sendMessage(id_task[1], `Задача «${task_user_or_not.name}» успешна закрыта`)
        
        // console.log(task_user_or_not);
        // if (task_for_worker[0].priority == "🤷") await New_Worker.updateOne({ chat_id: id_task[1] }, { $inc: { workload: -1 } })
        // if (task_for_worker[0].priority == "🔥") await New_Worker.updateOne({ chat_id: id_task[1] }, { $inc: { workload: -2 } })
        // if (task_for_worker[0].priority == "🔥🔥") await New_Worker.updateOne({ chat_id: id_task[1] }, { $inc: { workload: -3 } })
        // if (task_for_worker[0].priority == "🔥🔥🔥") await New_Worker.updateOne({ chat_id: id_task[1] }, { $inc: { workload: -4 } })
        await New_Worker.updateOne({ chat_id: id_task[1] }, { $pull: { tasks: { _id: id_task[2] } } })
        if(task_user_or_not.from == 'worker'){
            await New_Task.deleteOne({_id: id_task[2]})
        }
    }
    /*
    #####################
    Доработка задачи
    #####################
    */
    if (query.data.startsWith('dorob_')) {
        await bot.deleteMessage(chat.id, message_id)
        let id_task = query.data.split('_')
        let tasks_arr1 = await New_Worker.findOne({ tasks:{_id : id_task[1]} })
        
        await bot.sendMessage(id_task[1], `Задача «${tasks_arr1.name}» не закрыта, продолжайте выполнение`)

    }

}


module.exports = {
    keyBoardAnalytics
}