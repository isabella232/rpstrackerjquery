//import 'kendo-ui-core/css/web/kendo.common.css';
//import 'kendo-ui-core/css/web/kendo.default.min.css';
import './backlog.css';

import $ from "jquery";
import "bootstrap/dist/js/bootstrap";

import { PtItem } from "../core/models/domain";
import { ItemType } from "../core/constants";
import { getIndicatorClass } from "../shared/helpers/priority-styling";
import { BacklogPage } from './backlog.page';
import { PresetType, PtItemType } from '../core/models/domain/types';
import { pushUrl, getQueryParameter } from '../utils/url';
import { PtNewItem } from '../shared/models/dto/pt-new-item';

const reqPreset = getQueryParameter('preset') as PresetType;
const backlogPage = new BacklogPage(reqPreset);

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

/*
function refreshBacklogPage() {
    backlogPage.refresh()
        .then(items => {
            $('#itemsTableBody').html(renderTableRows(items));
        });
}
*/

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

