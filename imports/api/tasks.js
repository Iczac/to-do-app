import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
 
export const Tasks = new Mongo.Collection('tasks');

Meteor.methods({

    // Removing Task related to Company upon Company Deletion
    'tasks.removeRelatedTasks'(company_id) {
        check(company_id, Number);
        Tasks.remove({},{company_id: company_id});
    },

    // Toggle Done Check
    'tasks.toggleCheck'(task_id, checked) {
        check(task_id, String);
        check(checked, Boolean);

        Tasks.update(task_id, {
            $set: { checked: !checked },
        });
    },

    // Change Priority of Task
    'tasks.changePriority'(task_id, priority_no) {
        check(task_id, String)
        check(priority_no, Number)

        Tasks.update(task_id, {
            $set: { priority: priority_no}
        })
    },

    // Delete the task
    'tasks.deleteTask'(task_id) {
        check(task_id, String)
        Tasks.remove(task_id);
    },

    // Insert Task
    'tasks.insertTask'( text, priority, company) {
        check(text, String)
        check(priority, Number)
        check(company, Number)

        Tasks.insert({
            text,
            priority: priority,
            company_id: company,
            checked: false,
            createdAt: new Date(),
        });
    }


})