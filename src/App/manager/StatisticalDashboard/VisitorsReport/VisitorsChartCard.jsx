import { useState, useRef, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { 
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import { formatNumber } from '../shared/Formatters';

const CHART_COLORS = {
  visitors: '#ffc658',
  revenue: '#8884d8'
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border rounded shadow">
        <p className="font-bold mb-2">{label}</p>
        <p style={{ color: CHART_COLORS.revenue }}>
          Khách mới: {formatNumber(payload.find(item => item.dataKey === 'new')?.value || 0)}
        </p>
        <p style={{ color: CHART_COLORS.visitors }}>
          Tổng truy cập: {formatNumber(payload.find(item => item.dataKey === 'count')?.value || 0)}
        </p>
      </div>
    );
  }
  return null;
};

const VisitorsChartCard = ({ filteredData, timeRange, onTimeRangeChange }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  const chartData = useMemo(() => {
    return filteredData.map(item => ({
      ...item,
      date: timeRange === 'day' ? item.date : undefined,
      week: timeRange === 'week' ? `Tuần ${item.week?.replace('Tuần ', '')}` : undefined,
      month: timeRange === 'month' ? `Tháng ${item.month?.replace('Tháng ', '')}` : undefined,
      count: item.count || 0,
      new: item.new || 0,
      returning: item.returning || 0
    }));
  }, [filteredData, timeRange]);

  return (
    <Card className="chart-card mb-4">
      <Card.Header className="chart-card__header">
        <div className="flex w-full gap-2 justify-between align-items-center">
          <span>Biểu đồ lượng truy cập</span>
          <div className="relative" ref={dropdownRef}>
            <div 
              className="border border-black rounded-md px-2 py-1 cursor-pointer"
              style={{ width: '150px' }}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {timeRange === 'day' ? 'Theo ngày' : 
               timeRange === 'week' ? 'Theo tuần' : 'Theo tháng'}
            </div>
            {showDropdown && (
              <ul 
                className="absolute bg-white rounded-md statistical-dashboard__menu border border-black"
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
              </ul>
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body className="chart-card__body">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey={timeRange === 'day' ? 'date' : 
                        timeRange === 'week' ? 'week' : 'month'} 
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone"
                dataKey="new"
                name="Khách mới"
                stroke={CHART_COLORS.revenue}
                fill={CHART_COLORS.revenue}
                fillOpacity={0.8}
                activeDot={{ r: 6 }}
                isAnimationActive={false}
              />
              <Area 
                type="monotone"
                dataKey="count"
                name="Tổng truy cập"
                stroke={CHART_COLORS.visitors}
                fill={CHART_COLORS.visitors}
                fillOpacity={0.2}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center py-4">Không có dữ liệu để hiển thị</div>
        )}
      </Card.Body>
    </Card>
  );
};
VisitorsChartCard.propTypes = {
  filteredData: PropTypes.arrayOf(
    PropTypes.shape({
      count: PropTypes.number.isRequired,
      new: PropTypes.number.isRequired,
      returning: PropTypes.number.isRequired,
      date: PropTypes.string,
      week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      month: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    })
  ).isRequired,
  timeRange: PropTypes.oneOf(['day', 'week', 'month']).isRequired,
  onTimeRangeChange: PropTypes.func.isRequired
};

export default VisitorsChartCard;