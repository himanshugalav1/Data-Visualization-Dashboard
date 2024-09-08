import React, { useEffect, useState } from 'react';
import { useTable, useFilters, useSortBy } from 'react-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import './App.css';
import { Link } from 'react-router-dom';

const DataTableFile = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://docs.google.com/spreadsheets/d/1Iqz2Amth8Ot2xHANjclrcDSg2IFSnhq4WsL27Re_lSk/export?format=csv')
      .then(response => response.text())
      .then(csvData => {
        const dataArray = csvData.split('\n').map(row => row.split(','));
        const columns = dataArray[0];
        columns[columns.length - 1] = columns[columns.length - 1].replace("\r", "");
        const dataList = dataArray.slice(1).map(row => {
          row[row.length - 1] = row[row.length - 1].replace("\r", "");
          return row.reduce((obj, value, index) => {
            obj[columns[index]] = value;
            return obj;
          }, {});
        });
        setData(dataList);
      });
  }, []);

  const columns = React.useMemo(
    () => [
      { Header: 'Invoice ID', accessor: 'Invoice ID' },
      { Header: 'Date', accessor: 'Date' },
      { Header: 'Time', accessor: 'Time' },
      { Header: 'Branch', accessor: 'Branch' },
      { Header: 'City', accessor: 'City' },
      { Header: 'Customer Type', accessor: 'Customer_type' },
      { Header: 'Gender', accessor: 'Gender' },
      { Header: 'Product Line', accessor: 'Product line' },
      { Header: 'Unit Price', accessor: 'Unit price' },
      { Header: 'Quantity', accessor: 'Quantity' },
      { Header: 'Total', accessor: 'Total' },
      { Header: 'Payment', accessor: 'Payment' },
      { Header: 'Rating', accessor: 'Rating' },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy
  );

  return (
    <div className="table-container">
      <div className="table-header">
        <h1 className="title">Data Table</h1>
        <span class="line-break"></span>
        <p className="dash-link"><Link to="/">Dashboard</Link></p>
      </div>
      <div className="table-wrapper">
        <table {...getTableProps()} className="data-table">
          <thead>
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' 🔽'
                          : ' 🔼'
                        : ''}
                    </span>
                    &nbsp; <FontAwesomeIcon icon={faSort} />
                    <div className="filter-container">
                      <input
                        className="filter-box"
                        value={column.filterValue || ''}
                        onChange={e => column.setFilter(e.target.value)}
                        placeholder={`Filter ${column.render('Header')}`}
                      />
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="row-with-rounded-corners">
                  {row.cells.map(cell => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTableFile;
