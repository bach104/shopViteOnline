import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Card, Row, Col, ButtonGroup, Button } from 'react-bootstrap';
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
    <div className="statistical-dashboard">
      <div className="statistical__header mb-4">
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
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h5 className="mb-0">Phân tích tổng hợp</h5>
            <div className="d-flex mt-2 mt-md-0">
              <ButtonGroup size="sm gap-4 flex">
                <Button 
                  variant={timeRange === 'day' ? 'primary' : 'outline-secondary'}
                  onClick={() => setTimeRange('day')}
                >
                  Ngày
                </Button>
                <Button 
                  variant={timeRange === 'week' ? 'primary' : 'outline-secondary'}
                  onClick={() => setTimeRange('week')}
                >
                  Tuần
                </Button>
                <Button 
                  variant={timeRange === 'month' ? 'primary' : 'outline-secondary'}
                  onClick={() => setTimeRange('month')}
                >
                  Tháng
                </Button>
                <Button 
                    variant="outline-secondary" 
                    size="sm" 
                    className="ms-2"
                    onClick={() => setShowSecondaryAxis(!showSecondaryAxis)}
                >
                    {showSecondaryAxis ? 'Ẩn trục phụ' : 'Hiện trục phụ'}
                </Button>
              </ButtonGroup>
            </div>
          </div>
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