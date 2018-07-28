import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Task } from './tasks'
 
export const Companies = new Mongo.Collection('companies');

Meteor.methods({

    // Removing Company
    'companies.removeCompany'(company_id) {
        check(company_id, String);
        Companies.remove(company_id);
    },

    // Get Total Company Count
    // 'companies.getTotalCompany'()

    
})