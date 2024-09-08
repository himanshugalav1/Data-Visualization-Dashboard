# Data Visualization Dashboard

## Overview

This project is a fully dynamic and responsive data visualization dashboard built with React.js and Chart.js. It provides a comprehensive view of sales data, allowing users to analyze and interact with the information through various visualization tools and filters.
<img src="/images/bar_dashboard.png" alt="Description" />
<img src="/images/line_dashboard.png" alt="Description" />

## Features

- **Total Sales in USD per Hour**: Visualize sales data by the hour.
- **Average Rating**: Display the average rating of transactions.
- **Average Sales per Transaction**: View average sales per transaction.
- **Charts**:
  - **Sales per Hour**: Shows sales trends over time.
  - **Sales per Category**: Displays sales distribution across different categories.
- **Data Filtering**:
  - Filter data by gender, cities, and member type.
- **Chart View Options**:
  - Switch between line and bar charts.
  - Zoom in, zoom out, reset view, save as PNG, and full-screen view modes for enhanced visualization.
  - <img src="/images/hour_line_chart.png" alt="Description" />
- **Data Table**:
  - A separate tab to display all data in a table.
  - Sorting and filtering options for better data management.
  - <img src="/images/data_table.png" alt="Description" />
- **Real-Time Data**:
  - Fetches data from a Google Spreadsheet and presents it in real time.

## Technologies Used

- **Frontend**: React.js
- **Data Visualization**: Chart.js
- **Data Source**: Google Sheets API

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   ```

2. **Navigate to the project directory**:
   ```bash
   cd <project-directory>
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start the development server**:
   ```bash
   npm start
   ```

   The application will be available at `http://localhost:3000`.

