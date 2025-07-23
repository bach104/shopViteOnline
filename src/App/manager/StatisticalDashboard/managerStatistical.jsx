import { useState, useRef } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DashboardOverview from './DashboardOverview/index';
import RevenueReport from './RevenueReport/index';
import VisitorsReport from './VisitorsReport/index';
import statisticalData from '../../../data/statistical';
import MenuMobile from "../base/managerMenuMobile";

const StatisticalDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dateRange, setDateRange] = useState({
    start: new Date('2023-05-01'),
    end: new Date('2023-05-07')
  });
  
  // Thêm useRef để tham chiếu đến phần nội dung cần xuất
  const reportRef = useRef(null);

  const filterByDateRange = (data) => {
    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= dateRange.start && itemDate <= dateRange.end;
    });
  };

  const handleExportReport = () => {
    const input = reportRef.current;
    
    // Thêm padding cho PDF
    const padding = 10;
    
    html2canvas(input, {
      scale: 2, // Tăng chất lượng hình ảnh
      logging: false,
      useCORS: true
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // Chiều rộng A4 (mm)
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', padding, padding, imgWidth - 2*padding, imgHeight - 2*padding);
      
      // Lấy ngày hiện tại để đặt tên file
      const today = new Date();
      const dateStr = today.toISOString().split('T')[0];
      
      pdf.save(`bao-cao-thong-ke-${dateStr}.pdf`);
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
        <div className="flex items-center gap-4">
          <MenuMobile/>
          <h2 className="statistical__header-title md:text-3xl sm:text-2xl text-xs">Bảng điều khiển thống kê</h2>
        </div>
        <div className="statistical__header-controls flex flex-wrap">
          <DatePicker
            selectsRange
            startDate={dateRange.start}
            endDate={dateRange.end}
            onChange={([start, end]) => setDateRange({ start, end })}
            dateFormat="dd/MM/yyyy"
            className="statistical__date-picker"
            placeholderText="Chọn khoảng thời gian"
          />
          <button 
            className="statistical__export-btn"
            onClick={handleExportReport}
          >
            <span className="statistical__export-icon">↓</span> Xuất báo cáo
          </button>
        </div>
      </div>
      <div className="statistical__tabs" ref={reportRef}>
        <div className="statistical__tab-nav">
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