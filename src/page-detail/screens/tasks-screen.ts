import $ from "jquery";

import { PtTask } from "../../core/models/domain";
import { TasksScreenModel } from "./tasks-screen-model";


let tasksScreenModel: TasksScreenModel = undefined;


$(document).on('blur', '#inputNewTaskTitle', (e) => {
    //save changes
    tasksScreenModel.newTaskTitle = $(e.currentTarget).val() as string;
})
    .on('keyup', '#inputNewTaskTitle', (e) => {
        const inputObj = $(e.currentTarget);
        const newValue = inputObj.val() as string;
        if (newValue.trim().length === 0) {
            $('#btnTaskAdd').attr('disabled', 'disabled');
        } else {
            $('#btnTaskAdd').removeAttr('disabled');
        }
    })
    .on('click', '#btnTaskAdd', () => {
        tasksScreenModel.onAddTapped();
        $('#inputNewTaskTitle').val('');
    })
    .on('click', '.checkbox-pt-task', (e) => {
        const taskId = Number($(e.currentTarget).attr('data-task-id'));
        tasksScreenModel.toggleTapped(taskId);
    })
    .on('click', '.btn-task-delete', (e) => {
        const taskId = Number($(e.currentTarget).attr('data-task-id'));
        tasksScreenModel.taskDelete(taskId);
    })
    .on('blur', '.input-task-title', (e) => {
        const inputObj = $(e.currentTarget);
        const taskId = Number(inputObj.attr('data-task-id'));
        const newValue = inputObj.val() as string;
        tasksScreenModel.onTaskUpdateRequested(taskId, newValue);
    });

/*
$(document).on('click', '.pt-assignee-item', (e) => {
    const selUserId = Number($(e.currentTarget).attr('data-user-id'));
    tasksScreenModel.selectUserById(selUserId);
});

function onFieldChange(e: any) {
    const fieldObj = $(e.currentTarget);
    const fieldName = fieldObj.attr('name');
    (tasksScreenModel.itemForm as any)[fieldName] = fieldObj.val();
}

function onNonTextFieldChange(e: any) {
    onFieldChange(e);
    tasksScreenModel.notifyUpdateItem();
}
*/

export function renderScreenTasks(model: TasksScreenModel) {
    tasksScreenModel = model;

    tasksScreenModel.props.tasks$.subscribe((tasks: PtTask[]) => {
        if (tasks.length > 0) {
            renderTasks(tasks);
        }
    });

    const tasksTemplate = $('#tasksTemplate').html();

    const renderedHtml = tasksTemplate;
    //.replace(/{{title}}/ig, tasksScreenModel.itemForm.title)
    //.replace(/{{description}}/ig, tasksScreenModel.itemForm.description)
    //.replace(/{{assigneeName}}/ig, tasksScreenModel.itemForm.assigneeName);

    $('#detailScreenContainer').html(renderedHtml);

    /*
    $('#imgAssigneeAvatar').attr('src', tasksScreenModel.selectedAssignee.avatar);

    const selectItemTypeObj = $('#selItemType');
    $.each(tasksScreenModel.itemTypesProvider, (key, value) => {
        selectItemTypeObj.append($("<option></option>")
            .attr("value", value)
            .text(value));
    });
    selectItemTypeObj
        .val(tasksScreenModel.itemForm.typeStr)
        .change(onNonTextFieldChange);

    const selectStatusObj = $('#selStatus');
    $.each(tasksScreenModel.statusesProvider, (key, value) => {
        selectStatusObj.append($("<option></option>")
            .attr("value", value)
            .text(value));
    });
    selectStatusObj
        .val(tasksScreenModel.itemForm.statusStr)
        .change(onNonTextFieldChange);

    const selectPriorityObj = $('#selPriority');
    $.each(tasksScreenModel.prioritiesProvider, (key, value) => {
        selectPriorityObj.append($("<option></option>")
            .attr("value", value)
            .text(value));
    });
    selectPriorityObj
        .val(tasksScreenModel.itemForm.priorityStr)
        .change(onNonTextFieldChange);

    const inputEstimateObj = $('#inputEstimate');
    inputEstimateObj
        .val(tasksScreenModel.itemForm.estimate)
        .change(onNonTextFieldChange);
        */
}


export function renderTasks(tasks: PtTask[]) {
    const listTasksObj = $('#listTasks').empty();
    $.each(tasks, (key, task) => {
        listTasksObj.append($(
            `
            <div class="input-group mb-3 col-sm-6">
                <div class="input-group-prepend">
                    <div class="input-group-text">
                        <input type="checkbox" class="checkbox-pt-task" ${task.completed ? 'checked' : ''} data-task-id="${task.id}"
                            name="${'checked' + task.id}" />
                    </div>
                </div>
                <input value="${task.title}" (ngModelChange)="taskTitleChange(task, $event)" data-task-id="${task.id}"
                    type="text" class="form-control input-task-title" aria-label="Text input with checkbox" name="${'tasktitle' + task.id}" />
        
                <div class="input-group-append">
                    <button class="btn btn-danger btn-task-delete" type="button" data-task-id="${task.id}">Delete</button>
                </div>
            </div>
            `
        ));
    });
}
