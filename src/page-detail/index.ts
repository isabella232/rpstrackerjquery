import $ from "jquery";
import "bootstrap/dist/js/bootstrap";

import { PtItem } from "../core/models/domain";
import { ItemType } from "../core/constants";
import { getIndicatorClass } from "../shared/helpers/priority-styling";
import { PresetType, PtItemType } from '../core/models/domain/types';
import { pushUrl, getQueryParameter } from '../utils/url';
import { PtNewItem } from '../shared/models/dto/pt-new-item';
import { DetailScreenType } from "../shared/models/ui/types/detail-screens";
import { DetailPage } from "./detail.page";

const reqScreen = getQueryParameter('screen') as DetailScreenType;
const reqItemId = Number(getQueryParameter('itemId'));
const detailPage = new DetailPage(reqScreen, reqItemId);


detailPage.item$.subscribe(item => {
    if (item) {
        renderPageChanges();
        switch (detailPage.currentScreen) {
            case 'details':
                renderScreenDetails();
                break;
            case 'tasks':
                renderScreenTasks();
                break;
            case 'chitchat':
                renderScreenChitchat();
                break;
        }
    }
});

$(document).on('keyup', '.pt-text-field', (e) => {
    //update form model/
    const fieldObj = $(e.currentTarget);
    const formFieldName = fieldObj.attr('name');
    (detailPage.itemForm as any)[formFieldName] = fieldObj.val();
});

$(document).on('blur', '.pt-text-field', (e) => {
    //save changes
    detailPage.notifyUpdateItem();
});

function renderPageChanges() {
    $('#itemTitle').text(detailPage.itemForm.title);
}

function onFieldChange(e: any) {
    const fieldObj = $(e.currentTarget);
    const fieldName = fieldObj.attr('name');
    (detailPage.itemForm as any)[fieldName] = fieldObj.val();
}

function onNonTextFieldChange(e: any) {
    onFieldChange(e);
    detailPage.notifyUpdateItem();
}

function renderScreenDetails() {
    const detailsTemplate = $('#detailsTemplate').html();
    const renderedHtml = detailsTemplate
        .replace(/{{title}}/ig, detailPage.itemForm.title)
        .replace(/{{description}}/ig, detailPage.itemForm.description);
    $('#detailScreenContainer').html(renderedHtml);

    const selectItemTypeObj = $('#selItemType');
    $.each(detailPage.itemTypesProvider, (key, value) => {
        selectItemTypeObj.append($("<option></option>")
            .attr("value", value)
            .text(value));
    });
    selectItemTypeObj
        .val(detailPage.itemForm.typeStr)
        .change(onNonTextFieldChange);

    const selectStatusObj = $('#selStatus');
    $.each(detailPage.statusesProvider, (key, value) => {
        selectStatusObj.append($("<option></option>")
            .attr("value", value)
            .text(value));
    });
    selectStatusObj
        .val(detailPage.itemForm.statusStr)
        .change(onNonTextFieldChange);

    const selectPriorityObj = $('#selPriority');
    $.each(detailPage.prioritiesProvider, (key, value) => {
        selectPriorityObj.append($("<option></option>")
            .attr("value", value)
            .text(value));
    });
    selectPriorityObj
        .val(detailPage.itemForm.priorityStr)
        .change(onNonTextFieldChange);

    const inputEstimateObj = $('#inputEstimate');
    inputEstimateObj
        .val(detailPage.itemForm.estimate)
        .change(onNonTextFieldChange);

}

function renderScreenTasks() {

}

function renderScreenChitchat() {

}

detailPage.refresh();


/*
backlogPage.items$.subscribe(items => {
    $('#itemsTableBody').html(renderTableRows(items));
});

const newItemTypeSelectObj = $('#newItemType');
$.each(backlogPage.itemTypesProvider, (key, value) => {
    newItemTypeSelectObj.append($("<option></option>")
        .attr("value", value)
        .text(value));
});

function getIndicatorImage(item: PtItem) {
    return ItemType.imageResFromType(item.type);
}

function renderTableRows(items: PtItem[]): string {
    return items.map(i => renderTableRow(i)).join();
}
function renderTableRow(item: PtItem): string {
    return `
    <tr class="pt-table-row" data-id="${item.id}">
        <td><img src="${getIndicatorImage(item)}" class="backlog-icon"></td>
        <td><img src="${item.assignee.avatar}"
                class="li-avatar rounded mx-auto d-block" /></td>
        <td><span class="li-title">${item.title}</span></td>
        <td><span class="${'badge ' + getIndicatorClass(item.priority)}">${item.priority}</span></td>
        <td><span class="li-estimate">${item.estimate}</span></td>
        <td><span class="li-date">${item.dateCreated.toDateString()}</span></td>
    </tr>
    `;
}


$('.btn-backlog-filter').click((e) => {
    const selPreset = $(e.currentTarget).attr('data-preset') as PresetType;
    pushUrl('', 'backlog/backlog.html', '?preset=' + selPreset);
    backlogPage.currentPreset = selPreset;
    backlogPage.refresh();
});

$('#btnAddItemSave').click(() => {
    const newTitle = $('#newItemTitle').val() as string;
    const newDescription = $('#newItemDescription').val() as string;
    const newItemType = $('#newItemType').val() as PtItemType;
    const newItem: PtNewItem = {
        title: newTitle,
        description: newDescription,
        typeStr: newItemType
    };
    backlogPage.onAddSave(newItem);
});

$(document).on("click", "#itemsTableBody tr", (e) => {
    const itemId = $(e.currentTarget).attr('data-id');
    console.log(itemId);
});

backlogPage.refresh();
*/
