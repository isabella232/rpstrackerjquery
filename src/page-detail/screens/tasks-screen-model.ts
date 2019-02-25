import { BehaviorSubject } from "rxjs";

import { PtTask } from "../../core/models/domain";
import { PtNewTask } from "../../shared/models/dto/pt-new-task";
import { PtTaskUpdate } from "../../shared/models/dto/pt-task-update";
import { EMPTY_STRING } from "../../core/helpers";

export interface PtItemTasksScreenProps {
    tasks$: BehaviorSubject<PtTask[]>;
    addNewTask: (newTask: PtNewTask) => void;
    updateTask: (taskUpdate: PtTaskUpdate) => void;
}

export class TasksScreenModel {

    //private lastUpdatedTitle = EMPTY_STRING;
    public newTaskTitle: string = EMPTY_STRING;
    //public tasks: PtTask[] = [];

    constructor(public props: PtItemTasksScreenProps) {
        //this.props.tasks$.subscribe((tasks: PtTask[]) => {
        //    debugger;
        //    this.tasks = tasks;
        //});
    }


    public onAddTapped() {
        const newTitle = this.newTaskTitle.trim();
        if (newTitle.length === 0) {
            return;
        }
        const newTask: PtNewTask = {
            title: newTitle,
            completed: false
        };
        this.props.addNewTask(newTask);

        this.newTaskTitle = EMPTY_STRING;
    }

    public toggleTapped(taskId: number) {
        const taskUpdate: PtTaskUpdate = {
            task: this.getTaskById(taskId),
            toggle: true
        };
        this.props.updateTask(taskUpdate);
    }

    /*
        public taskTitleChange(task: PtTask, event: any) {
            if (task.title === event.target.value) {
                return;
            }
            this.lastUpdatedTitle = event.target.value;
        }
        */

    public onTaskUpdateRequested(taskId: number, newTitle: string) {
        const taskUpdate: PtTaskUpdate = {
            task: this.getTaskById(taskId),
            toggle: false,
            newTitle: newTitle
        };

        //this.lastUpdatedTitle = EMPTY_STRING;
        this.props.updateTask(taskUpdate);
    }

    /*
        public onTaskFocused(task: PtTask) {
            this.lastUpdatedTitle = task.title ? task.title : EMPTY_STRING;
        }
    
        public onTaskBlurred(task: PtTask) {
            if (task.title === this.lastUpdatedTitle) {
                return;
            }
            const taskUpdate: PtTaskUpdate = {
                task: task,
                toggle: false,
                newTitle: this.lastUpdatedTitle
            };
    
            this.lastUpdatedTitle = EMPTY_STRING;
            this.props.updateTask(taskUpdate);
        }
    
        */

    public taskDelete(taskId: number) {
        const taskUpdate: PtTaskUpdate = {
            task: this.getTaskById(taskId),
            toggle: false,
            delete: true
        };
        this.props.updateTask(taskUpdate);
    }

    private getTaskById(taskId: number): PtTask {
        const task = this.props.tasks$.value.find(t => t.id === taskId);
        return task;
    }
}
