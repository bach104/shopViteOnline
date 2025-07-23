import { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { 
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { formatCurrency } from '../shared/Formatters';

const CHART_COLORS = {
  revenue: '#8884d8',
  orders: '#00c351' 
};

const RevenueChart = ({ 
  filteredData, 
  timeRange, 
  onTimeRangeChange 
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Xử lý dữ liệu để chỉ lấy 12 tháng gần nhất khi chọn theo tháng
  const chartData = useMemo(() => {
    if (timeRange === 'month') {
      // Sắp xếp dữ liệu theo tháng giảm dần (nếu cần) và lấy 12 tháng gần nhất
      // Giả sử dữ liệu đã được sắp xếp từ server hoặc từ nguồn khác
      return [...filteredData].slice(0, 12);
    }
    return filteredData;
  }, [filteredData, timeRange]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value) => {
    onTimeRangeChange(value);
    setShowDropdown(false);
  };

  const getXAxisDataKey = () => {
    switch(timeRange) {
      case 'week': return 'week';
      case 'month': return 'month';
      case 'year': return 'year';
      default: return 'date';
    }
  };

  return (
    <Card className="chart-card mb-4">
      <Card.Header className="chart-card__header">
        <div className="flex justify-between w-full">
          <span>Biểu đồ doanh thu</span>
          <div className="relative" ref={dropdownRef}>
            <div 
              className="border border-black rounded-md px-2 py-1 cursor-pointer"
              style={{ width: '150px' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {timeRange === 'day' ? 'Theo ngày' : 
                timeRange === 'week' ? 'Theo tuần' : 
                timeRange === 'month' ? 'Theo tháng' : 'Theo năm'}
            </div>
            
            {showDropdown && (
              <ul 
                className="absolute statistical-dashboard__menu border bg-white border-black rounded-md"
                style={{ width: '100%', zIndex: 1000 }}
              >
                <li
                    className={`dropdown-item ${timeRange === 'day' ? 'active' : ''}`}
                    onClick={() => handleSelect('day')}
                >
                    Theo ngày
                </li>
                <li
                    className={`dropdown-item ${timeRange === 'week' ? 'active' : ''}`}
                    onClick={() => handleSelect('week')}
                >
                    Theo tuần
                </li>
                <li
                    className={`dropdown-item ${timeRange === 'month' ? 'active' : ''}`}
                    onClick={() => handleSelect('month')}
                >
                    Theo tháng
                </li>
                <li
                    className={`dropdown-item ${timeRange === 'year' ? 'active' : ''}`}
                    onClick={() => handleSelect('year')}
                >
                    Theo năm
                </li>
              </ul>
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body className="chart-card__body">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}  
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey={getXAxisDataKey()} />
            <YAxis yAxisId="left" orientation="left" stroke={CHART_COLORS.revenue} />
            <YAxis yAxisId="right" orientation="right" stroke={CHART_COLORS.orders} />
            <Tooltip 
              formatter={(value, name) => [
                name === 'revenue' ? formatCurrency(value) : value,
                name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
              ]}
              labelFormatter={(label) => 
                `${timeRange === 'day' ? 'Ngày' : 
                  timeRange === 'week' ? 'Tuần' : 
                  timeRange === 'month' ? 'Tháng' : 'Năm'}: ${label}`
              }
            />
            <Legend />
            <Bar 
              yAxisId="left"
              dataKey="revenue" 
              fill={CHART_COLORS.revenue} 
              name="Doanh thu" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
            <Bar 
              yAxisId="right"
              dataKey="orders" 
              fill={CHART_COLORS.orders} 
              name="Đơn hàng" 
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
              animationBegin={100}
            />
          </BarChart>
        </ResponsiveContainer>
      </Card.Body>
    </Card>
  );
};

RevenueChart.propTypes = {
  filteredData: PropTypes.array.isRequired,
  timeRange: PropTypes.oneOf(['day', 'week', 'month', 'year']).isRequired,
  onTimeRangeChange: PropTypes.func.isRequired
};

export default RevenueChart;