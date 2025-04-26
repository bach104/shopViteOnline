import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DashboardOverview from './DashboardOverview/index';
import RevenueReport from './RevenueReport/index';
import VisitorsReport from './VisitorsReport/index';
import statisticalData from '../../../data/statistical';

const StatisticalDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    start: new Date('2023-05-01'),
    end: new Date('2023-05-07')
  });

  const filterByDateRange = (data) => {
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardOverview 
            data={statisticalData} 
            filterByDateRange={filterByDateRange}
            dateRange={dateRange}
          />
        );
      case 'revenue':
        return (
          <RevenueReport 
            data={statisticalData} 
            filterByDateRange={filterByDateRange}
          />
        );
      case 'visitors':
        return (
          <VisitorsReport 
            data={statisticalData.visitors} 
            filterByDateRange={filterByDateRange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="statistical-dashboard">
      <div className="statistical__header">
        <h2 className="statistical__header-title">Bảng điều khiển thống kê</h2>
        <div className="statistical__header-controls">
          <DatePicker
            selectsRange
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={([start, end]) => setDateRange({ start, end })}
            dateFormat="dd/MM/yyyy"
            className="statistical__date-picker"
            placeholderText="Chọn khoảng thời gian"
          />
          <button className="statistical__export-btn">
            <span className="statistical__export-icon">↓</span> Xuất báo cáo
          </button>
        </div>
      </div>
      <div className="statistical__tabs">
        <div className="statistical__tab-nav ">
          <button
            className={`statistical__tab-btn ${activeTab === 'dashboard' ? 'statistical__tab-btn--active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Tổng quan
          </button>
          <button
            className={`statistical__tab-btn ${activeTab === 'revenue' ? 'statistical__tab-btn--active' : ''}`}
            onClick={() => setActiveTab('revenue')}
          >
            Doanh thu
          </button>
          <button
            className={`statistical__tab-btn ${activeTab === 'visitors' ? 'statistical__tab-btn--active' : ''}`}
            onClick={() => setActiveTab('visitors')}
          >
            Truy cập
          </button>
        </div>
        
        <div className="statistical__tab-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default StatisticalDashboard;