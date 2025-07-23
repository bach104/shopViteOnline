import { useState, useRef, useEffect,useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col } from 'react-bootstrap';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ReferenceLine
} from 'recharts';
import KPICard from './KPICard';

const DashboardOverview = ({ data, filterByDateRange }) => {
  const [timeRange, setTimeRange] = useState('day');
  const [showSecondaryAxis, setShowSecondaryAxis] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi click bên ngoài
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
    setTimeRange(value);
    setShowDropdown(false);
  };

  const chartData = useMemo(() => {
    const baseData = timeRange === 'day' 
      ? filterByDateRange(data.dailyRevenue) 
      : timeRange === 'week' 
      ? data.weeklyRevenue 
      : data.monthlyRevenue;

    return baseData.map(item => ({
      time: timeRange === 'day' ? item.date : 
            timeRange === 'week' ? `Tuần ${item.week}` : 
            `Tháng ${item.month}`,
      revenue: item.revenue,
      orders: item.orders,
      visitors: data.visitors[timeRange === 'day' ? 'daily' : 
                timeRange === 'week' ? 'weekly' : 'monthly']
                .find(v => timeRange === 'day' ? v.date === item.date : 
                      timeRange === 'week' ? v.week === item.week : 
                      v.month === item.month)?.count || 0
    }));
  }, [timeRange, data, filterByDateRange]);

  return (
    <div className="statistical__mobile">
      <div className="statistical__header flex mb-4">
        <h2 className="statistical__header-title">Bảng điều khiển thống kê</h2>
      </div>
      <Row className="mb-4 gap-4 statistical__kpi">
        <Col className="statistical__kpi-item" md={3}>
          <KPICard 
            title="Doanh thu" 
            value={data.yearlyRevenue[0].revenue.toLocaleString('vi-VN') + '₫'} 
            growth={data.yearlyRevenue[0].growth}
            icon="dollar"
            color="primary"
          />
        </Col>
        <Col className="statistical__kpi-item" md={3}>
          <KPICard 
            title="Đơn hàng" 
            value={data.yearlyRevenue[0].orders.toLocaleString('vi-VN')} 
            growth={8.5}
            icon="cart"
            color="success"
          />
        </Col>
        <Col className="statistical__kpi-item" md={3}>
          <KPICard 
            title="Truy cập" 
            value={data.visitors.total.toLocaleString('vi-VN')} 
            growth={12.3}
            icon="users"
            color="warning"
          />
        </Col>
        <Col className="statistical__kpi-item" md={3}>
          <KPICard 
            title="Chuyển đổi" 
            value={`${data.visitors.conversion}%`} 
            growth={0.8}
            icon="trend"
            color="info"
          />
        </Col>
      </Row>

      <Card className="chart-card mb-4 shadow-sm">
        <Card.Header className="chart-card__header">
          <Row className="align-items-center">
            <Col xs={12} md={6}>
              <h5 className="statistical__header-title">Phân tích tổng hợp</h5>
            </Col>
            <Col xs={12} md={6} className="mt-2 mt-md-0">
              <div className="flex gap-2 align-items-center justify-content-md-end">
                <div className="relative" ref={dropdownRef}>
                  <div 
                    className="border-black border rounded px-2 py-1 bg-white"
                    style={{ width: '150px' }}
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {timeRange === 'day' ? 'Ngày' : 
                     timeRange === 'week' ? 'Tuần' : 'Tháng'}
                  </div>
                  {showDropdown && (
                    <ul 
                      className="border statistical-dashboard__menu dar bg-white border-black show absolute"
                      style={{ width: '100%', zIndex: 1000 }}
                    >
                      <li
                        className={`dropdown-item ${timeRange === 'day' ? 'active' : ''}`}
                        onClick={() => handleSelect('day')}
                      >
                          Ngày
                      </li>
                      <li
                        className={`dropdown-item ${timeRange === 'week' ? 'active' : ''}`}
                        onClick={() => handleSelect('week')}
                      >
                          Tuần
                      </li>
                      <li
                        className={`dropdown-item ${timeRange === 'month' ? 'active' : ''}`}
                        onClick={() => handleSelect('month')}
                      >
                          Tháng
                      </li>
                    </ul>
                  )}
                </div>
                
                <button
                  size="sm" 
                  className="border-black border rounded px-2 py-1 bg-white"
                  onClick={() => setShowSecondaryAxis(!showSecondaryAxis)}
                >
                  {showSecondaryAxis ? 'Ẩn trục phụ' : 'Hiện trục phụ'}
                </button>
              </div>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body className="chart-card__body">
          <div style={{ height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="#8884d8" 
                  label={{ value: 'Doanh thu (₫)', angle: -90, position: 'insideLeft' }}
                />
                {showSecondaryAxis && (
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    stroke="#ffc658" 
                    label={{ value: 'Lượt/Đơn hàng', angle: 90, position: 'insideRight' }}
                  />
                )}
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'Doanh thu') return [`${value.toLocaleString('vi-VN')}₫`, name];
                    return [value, name];
                  }}
                />
                <Legend />
                <Area
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Doanh thu"
                  fill="#8884d8"
                  stroke="#8884d8"
                  fillOpacity={0.2}
                />
                <Line
                  yAxisId={showSecondaryAxis ? "right" : "left"}
                  type="monotone"
                  dataKey="orders"
                  name="Đơn hàng"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  yAxisId={showSecondaryAxis ? "right" : "left"}
                  type="monotone"
                  dataKey="visitors"
                  name="Lượt truy cập"
                  stroke="#ffc658"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <ReferenceLine 
                  y={0} 
                  stroke="#ddd" 
                  yAxisId={showSecondaryAxis ? "right" : "left"} 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

DashboardOverview.propTypes = {
  data: PropTypes.shape({
    dailyRevenue: PropTypes.array.isRequired,
    weeklyRevenue: PropTypes.array.isRequired,
    monthlyRevenue: PropTypes.array.isRequired,
    visitors: PropTypes.object.isRequired,
    yearlyRevenue: PropTypes.array.isRequired
  }).isRequired,
  filterByDateRange: PropTypes.func.isRequired,
  dateRange: PropTypes.shape({
    start: PropTypes.instanceOf(Date).isRequired,
    end: PropTypes.instanceOf(Date).isRequired
  }).isRequired
};

export default DashboardOverview;