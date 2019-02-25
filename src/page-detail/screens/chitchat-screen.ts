import $ from "jquery";

import './chitchat-screen.css';

import { PtComment } from "../../core/models/domain";
import { ChitchatScreenModel } from "./chitchat-screen-model";

let chitchatScreenModel: ChitchatScreenModel = undefined;

$(document).on('blur', '#inputNewCommentText', (e) => {
    //save changes
    chitchatScreenModel.newCommentText = $(e.currentTarget).val() as string;
})
    .on('keyup', '#inputNewCommentText', (e) => {
        const inputObj = $(e.currentTarget);
        const newValue = inputObj.val() as string;
        if (newValue.trim().length === 0) {
            $('#btnCommentAdd').attr('disabled', 'disabled');
        } else {
            $('#btnCommentAdd').removeAttr('disabled');
        }
    })
    .on('click', '#btnCommentAdd', () => {
        chitchatScreenModel.onAddTapped();
        $('#inputNewCommentText').val('');
    });

export function renderScreenChitchat(model: ChitchatScreenModel) {
    chitchatScreenModel = model;

    chitchatScreenModel.props.comments$.subscribe((comments: PtComment[]) => {
        if (comments.length > 0) {
            renderComments(comments);
        }
    });

    const commentsTemplate = $('#chitchatTemplate').html();

    const renderedHtml = commentsTemplate;
    //.replace(/{{title}}/ig, tasksScreenModel.itemForm.title)
    //.replace(/{{description}}/ig, tasksScreenModel.itemForm.description)
    //.replace(/{{assigneeName}}/ig, tasksScreenModel.itemForm.assigneeName);

    $('#detailScreenContainer').html(renderedHtml);


    $('#imgCurrentUserAvatar').attr('src', chitchatScreenModel.props.currentUser.avatar);

    /*
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


export function renderComments(comments: PtComment[]) {
    const listCommentsObj = $('#listComments').empty();
    $.each(comments, (key, comment) => {
        listCommentsObj.append($(
            `
            <li class="media chitchat-item">
                <img src="${comment.user.avatar}" class="mr-3 li-avatar rounded" />
                <div class="media-body">
                    <h6 class="mt-0 mb-1"><span>${comment.user.fullName}</span><span class="li-date">${comment.dateCreated.toDateString()}</span></h6>
        
                    <span type="text" class="chitchat-text ">${comment.title}</span>
                </div>
            </li>
            `
        ));
    });
}
