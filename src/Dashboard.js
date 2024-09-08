// src/Dashboard.js
import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import './App.css'; // Import the CSS file
import '@fortawesome/react-fontawesome';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlassPlus, faMagnifyingGlassMinus, faMagnifyingGlass, faDownload, faUpRightAndDownLeftFromCenter, faChartLine } from '@fortawesome/free-solid-svg-icons';

ChartJS.register(...registerables, zoomPlugin);

const Dashboard = () => {
	const [data, setData] = useState([]);
	const [filteredData, setFilteredData] = useState([]);
	const [city, setCity] = useState('');
	const [customerType, setCustomerType] = useState('');
	const [gender, setGender] = useState('');
	const [chartType, setChartType] = useState('bar');
	const chartRef1 = useRef(null);
	const chartRef2 = useRef(null);

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
				setFilteredData(dataList);
			});
	}, []);

	const handleChartTypeChange = (e) => {
		setChartType(e.target.value);
	};

	const generateStars = (rating) => {
		let stars = [];
		for (let i = 1; i <= 10; i++) {
			if (i <= rating) {
				stars.push(<span key={i} className="star">&#9733;</span>);
			} else {
				stars.push(<span key={i} className="star">&#9734;</span>);
			}
		}
		return stars;
	};

	const filterData = () => {
		let filtered = data;
		if (city) filtered = filtered.filter(item => item.City === city);
		if (customerType) filtered = filtered.filter(item => item.Customer_type === customerType);
		if (gender) filtered = filtered.filter(item => item.Gender === gender);
		setFilteredData(filtered);
	};

	useEffect(() => {
		filterData();
	// eslint-disable-next-line
	}, [city, customerType, gender]);

	const salesByHour = filteredData.reduce((acc, curr) => {
		const dateComponents = curr.Date.split('/');
		const timeComponents = curr.Time.split(':');

		// Create a new Date object with the year, month, day, hours, and minutes
		const dateTime = new Date(
			parseInt(dateComponents[2]),  // year
			parseInt(dateComponents[0]) - 1,  // month (months are zero-based in JavaScript Date objects)
			parseInt(dateComponents[1]),  // day
			parseInt(timeComponents[0]),  // hours
			parseInt(timeComponents[1])   // minutes
		);

		acc[dateTime] = (acc[dateTime] || 0) + parseFloat(curr.Total);

		return acc;
	}, {});

	const salesByProductLine = filteredData.reduce((acc, curr) => {
		acc[curr['Product line']] = (acc[curr['Product line']] || 0) + parseFloat(curr.Total);
		return acc;
	}, {});

	const totalSales = filteredData.reduce((acc, curr) => acc + parseFloat(curr.Total), 0);
	const averageRating = (filteredData.reduce((acc, curr) => acc + parseFloat(curr.Rating), 0) / filteredData.length).toFixed(2);

	const salesByHourChartData = {
		labels: Object.keys(salesByHour).map(dateTime => {
			const date = new Date(dateTime);
			const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
			const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
			return `${formattedDate} ${formattedTime}`;
		}),
		datasets: [
			{
				label: 'Total Sales',
				data: Object.values(salesByHour),
				backgroundColor: 'rgba(75, 192, 192, 0.4)',
				borderColor: 'rgba(75, 192, 192, 1)',
			},
		],
	};

	const salesByProductLineChartData = {
		labels: Object.keys(salesByProductLine),
		datasets: [
			{
				label: 'Sales by Product Line',
				data: Object.values(salesByProductLine),
				backgroundColor: 'rgba(153, 102, 255, 0.4)',
				borderColor: 'rgba(153, 102, 255, 1)',
			},
		],
	};

	const handleDownload1 = () => {
		if (chartRef1.current) {
			const image = chartRef1.current.toBase64Image();
			const link = document.createElement('a');
			link.href = image;
			link.download = 'sale_each_hour.png';
			link.click();
		}
	};

	const handleZoom1 = (query) => {
		if (chartRef1.current) {
			if (query === "in") {
				chartRef1.current.zoom(1.1);
			}
			else if (query === "out") {
				chartRef1.current.zoom(0.9);
			}
			else if (query === "reset") {
				chartRef1.current.resetZoom();
			}
		}
	};

	const handleFullscreen1 = () => {
		if (chartRef1.current) {
			const chartElement = chartRef1.current.canvas;
			if (chartElement.requestFullscreen) {
				chartElement.requestFullscreen();
			} else if (chartElement.mozRequestFullScreen) { /* Firefox */
				chartElement.mozRequestFullScreen();
			} else if (chartElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
				chartElement.webkitRequestFullscreen();
			} else if (chartElement.msRequestFullscreen) { /* IE/Edge */
				chartElement.msRequestFullscreen();
			}
		}
	};

	const handleDownload2 = () => {
		if (chartRef2.current) {
			const image = chartRef2.current.toBase64Image();
			const link = document.createElement('a');
			link.href = image;
			link.download = 'sales_by_product.png';
			link.click();
		}
	};

	const handleZoom2 = (query) => {
		if (chartRef1.current) {
			if (query === "in") {
				chartRef1.current.zoom(1.1);
			}
			else if (query === "out") {
				chartRef1.current.zoom(0.9);
			}
			else if (query === "reset") {
				chartRef1.current.resetZoom();
			}
		}
	};

	const handleFullscreen2 = () => {
		if (chartRef2.current) {
			const chartElement = chartRef2.current.canvas;
			if (chartElement.requestFullscreen) {
				chartElement.requestFullscreen();
			} else if (chartElement.mozRequestFullScreen) { /* Firefox */
				chartElement.mozRequestFullScreen();
			} else if (chartElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
				chartElement.webkitRequestFullscreen();
			} else if (chartElement.msRequestFullscreen) { /* IE/Edge */
				chartElement.msRequestFullscreen();
			}
		}
	};

	const options = {
		responsive: true,
		plugins: {
			tooltip: {
				enabled: true,
			},
			legend: {
				labels: {
					color: '#e1e1e1'
				}
			},
			scales: {
				x: {
					ticks: {
						color: '#e1e1e1'
					}
				},
				y: {
					ticks: {
						color: '#e1e1e1'
					}
				}
			},
			zoom: {
				pan: {
					enabled: true,
					mode: 'xy',
				},
				zoom: {
					wheel: {
						enabled: true,
					},
					drag: {
						enabled: true,
					},
					pinch: {
						enabled: true,
					},
					mode: 'xy',
				},
				limits: {
					x: { min: 'original', max: 'original' },
					y: { min: 'original', max: 'original' },
				},
			},
		},
	};

	return (
		<div className="dashboard-container">
			<div className="sidebar">
				<div className="sidebar-container">
					<h2 className='filter-here'>Filter Here:</h2>
					<div className="filter-section">
						<label className="label">
							Select the City:
							<select onChange={(e) => setCity(e.target.value)} value={city}>
								<option value="">All</option>
								<option value="Yangon">Yangon</option>
								<option value="Naypyitaw">Naypyitaw</option>
								<option value="Mandalay">Mandalay</option>
							</select>
						</label>
						<label className="label">
							Select the Customer Type:
							<select onChange={(e) => setCustomerType(e.target.value)} value={customerType}>
								<option value="">All</option>
								<option value="Member">Member</option>
								<option value="Normal">Normal</option>
							</select>
						</label>
						<label className="label">
							Select the Gender:
							<select onChange={(e) => setGender(e.target.value)} value={gender}>
								<option value="">All</option>
								<option value="Male">Male</option>
								<option value="Female">Female</option>
							</select>
						</label>
						<label className="label">
							Select Chart Type:
							<select onChange={handleChartTypeChange} value={chartType}>
								<option value="bar">Bar Chart</option>
								<option value="line">Line Chart</option>
							</select>
						</label>
					</div>
				</div>
			</div>

			<div className="main-content">
				<div className="table-header">
					<h1 className="title"><FontAwesomeIcon icon={faChartLine} /> &nbsp; Sales Dashboard</h1>
					<p className='table-link'><Link to="/data-table">Data Table</Link></p>
				</div>

				<hr />

				<div className="stats-section">
					<p className="stat">Total Sales: <span className="stat-value">US $ {totalSales.toLocaleString()}</span></p>
					<p className="stat-star">Average Rating: <span className="stat-value-star"> <b>{averageRating}</b> &nbsp; {generateStars(averageRating)}</span></p>
					<p className="stat">Average Sales Per Transaction: <span className="stat-value">US $ {(totalSales / filteredData.length).toFixed(3)}</span></p>
				</div>

				<hr />

				<div className="chart-section">
					<div className="chart-container">
						<h3 className="chart-title">Total sale each hour</h3>
						<div className="chart-and-controls">
							{chartType === 'bar' ? (
								<Bar
									className='chart'
									data={salesByHourChartData}
									options={options}
									ref={chartRef1}
									onClick={(event) => console.log(event)}
								/>
							) : (
								<Line
									className='chart'
									data={salesByHourChartData}
									options={options}
									ref={chartRef1}
									onClick={(event) => console.log(event)}
								/>
							)}
							<div className="controls">
								<button title="Zoom In" onClick={() => handleZoom1("in")}><FontAwesomeIcon icon={faMagnifyingGlassPlus} /></button>
								<button title="Zoom Out" onClick={() => handleZoom1("out")}><FontAwesomeIcon icon={faMagnifyingGlassMinus} /></button>
								<button title="Reset Zoom" onClick={() => handleZoom1("reset")}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
								<button title="Download as png" onClick={handleDownload1}><FontAwesomeIcon icon={faDownload} /></button>
								<button title="Full Screen" onClick={handleFullscreen1}><FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} /></button>
							</div>
						</div>
					</div>
				</div>

				<div className="chart-section">
					<div className="chart-container">
						<h3 className="chart-title">Sales by Product Type</h3>
						<div className="chart-and-controls">
							{chartType === 'bar' ? (
								<Bar
									className='chart'
									data={salesByProductLineChartData}
									options={options}
									ref={chartRef2}
								/>
							) : (
								<Line
									className='chart'
									data={salesByProductLineChartData}
									options={options}
									ref={chartRef2}
								/>
							)}
							<div className="controls">
								<button title="Zoom In" onClick={() => handleZoom2("in")}><FontAwesomeIcon icon={faMagnifyingGlassPlus} /></button>
								<button title="Zoom Out" onClick={() => handleZoom2("out")}><FontAwesomeIcon icon={faMagnifyingGlassMinus} /></button>
								<button title="Reset Zoom" onClick={() => handleZoom2("reset")}><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
								<button title="Download as png" onClick={handleDownload2}><FontAwesomeIcon icon={faDownload} /></button>
								<button title="Full Screen" onClick={handleFullscreen2}><FontAwesomeIcon icon={faUpRightAndDownLeftFromCenter} /></button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
