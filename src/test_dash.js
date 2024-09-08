// Import necessary modules
import * as XLSX from 'xlsx';

const XLSX = require('xlsx');

// Read the Excel file
const workbook = XLSX.readFile('../public/sales.xlsx');

// Get the first sheet
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Initialize arrays to store column data
const invoiceId = [];
const branch = [];
const city = [];
const customerType = [];
const gender = [];
const productLine = [];
const unitPrice = [];
const quantity = [];
const tax = [];
const total = [];
const date = [];
const time = [];
const payment = [];
const cogs = [];
const grossMarginPercentage = [];
const grossIncome = [];
const rating = [];

// Iterate through each row of the sheet
XLSX.utils.sheet_to_json(sheet, { header: 1 }).forEach(row => {
    invoiceId.push(row[0]);
    branch.push(row[1]);
    city.push(row[2]);
    customerType.push(row[3]);
    gender.push(row[4]);
    productLine.push(row[5]);
    unitPrice.push(row[6]);
    quantity.push(row[7]);
    tax.push(row[8]);
    total.push(row[9]);
    date.push(row[10]);
    time.push(row[11]);
    payment.push(row[12]);
    cogs.push(row[13]);
    grossMarginPercentage.push(row[14]);
    grossIncome.push(row[15]);
    rating.push(row[16]);
});

// Log the data to verify
console.log('Invoice ID:', invoiceId);
console.log('Branch:', branch);
console.log('City:', city);
console.log('Customer Type:', customerType);
console.log('Gender:', gender);
console.log('Product Line:', productLine);
console.log('Unit Price:', unitPrice);
console.log('Quantity:', quantity);
console.log('Tax:', tax);
console.log('Total:', total);
console.log('Date:', date);
console.log('Time:', time);
console.log('Payment:', payment);
console.log('COGS:', cogs);
console.log('Gross Margin Percentage:', grossMarginPercentage);
console.log('Gross Income:', grossIncome);
console.log('Rating:', rating);
