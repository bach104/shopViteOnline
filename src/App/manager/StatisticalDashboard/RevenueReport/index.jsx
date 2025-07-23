import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip
} from 'recharts';
import GrowthIndicator from '../DashboardOverview/GrowthIndicator';
import { formatCurrency, calculateGrowthRate } from '../shared/Formatters';
import RevenueChart from './RevenueChart';
import RevenueDetailsTable from './RevenueDetailsTable';

const CHART_COLORS = {
  revenue: '#8884d8',
  orders: '#00c351' 
};

const RevenueReport = ({ data, filterByDateRange }) => {
  const [timeRange, setTimeRange] = useState('day');

  const filteredData = useMemo(() => {
    switch(timeRange) {
      case 'week':
        return data.weeklyRevenue || [];
      case 'month':
        return data.monthlyRevenue || [];
      case 'year':
        return data.yearlyRevenue || [];
      case 'day':
      default:
        return filterByDateRange(data.dailyRevenue);
    }
  }, [timeRange, data, filterByDateRange]);

  const metrics = useMemo(() => {
    const revenue = filteredData.reduce((sum, item) => sum + (item.revenue || 0), 0);
    const orders = filteredData.reduce((sum, item) => sum + (item.orders || 0), 0);
    const count = filteredData.length || 1; // Tránh chia cho 0
    
    return {
      totalRevenue: revenue,
      totalOrders: orders,
      avgRevenue: revenue / count,
      avgOrders: orders / count,
      avgOrderValue: orders > 0 ? revenue / orders : 0
    };
  }, [filteredData]);

  const formatPeriodValue = (value) => {
    if (value === undefined || value === null) return '';
    if (timeRange === 'week') return `Tuần ${value}`;
    if (timeRange === 'month') return `Tháng ${value}`;
    return value;
  };

  return (
    <div className="revenue-report statistical__mobile">
      <Row>
        <Col md={8}>
          <RevenueChart 
            filteredData={filteredData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </Col>
        
        <Col md={4}>
          <Card className="chart-card mb-4">
            <Card.Header className="chart-card__header">Phân tích doanh thu</Card.Header>
            <Card.Body className="chart-card__body">
              <div className="analysis__container">
                <div className="analysis__item">
                  <div className="analysis__label">
                    {timeRange === 'day' ? 'Tổng doanh thu ngày' :
                     timeRange === 'week' ? 'Tổng doanh thu tuần' :
                     timeRange === 'month' ? 'Tổng doanh thu tháng' : 'Tổng doanh thu năm'}
                  </div>
                  <div className="analysis__value">
                    {formatCurrency(metrics.totalRevenue)}
                    <GrowthIndicator 
                      value={calculateGrowthRate(
                        metrics.totalRevenue,
                        data.dailyRevenue.reduce((sum, item) => sum + (item.revenue || 0), 0)
                      )} 
                    />
                  </div>
                </div>
                <div className="analysis__item">
                  <div className="analysis__label">
                    {timeRange === 'day' ? 'Tổng đơn hàng ngày' :
                     timeRange === 'week' ? 'Tổng đơn hàng tuần' :
                     timeRange === 'month' ? 'Tổng đơn hàng tháng' : 'Tổng đơn hàng năm'}
                  </div>
                  <div className="analysis__value">
                    {metrics.totalOrders}
                    <GrowthIndicator 
                      value={calculateGrowthRate(
                        metrics.totalOrders,
                        data.dailyRevenue.reduce((sum, item) => sum + (item.orders || 0), 0)
                      )} 
                    />
                  </div>
                </div>
                <div className="analysis__item">
                  <div className="analysis__label">Giá trị đơn hàng trung bình</div>
                  <div className="analysis__value">
                    {formatCurrency(metrics.avgOrderValue)}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="chart-card">
            <Card.Header className="chart-card__header">Xu hướng doanh thu</Card.Header>
            <Card.Body className="chart-card__body">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.yearlyRevenue}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke={CHART_COLORS.revenue} 
                    strokeWidth={2}
                    activeDot={{ r: 6 }} 
                    animationDuration={1500}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <RevenueDetailsTable 
        filteredData={filteredData}
        timeRange={timeRange}
        formatPeriodValue={formatPeriodValue}
      />
    </div>
  );
};

RevenueReport.propTypes = {
  data: PropTypes.shape({
    dailyRevenue: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        revenue: PropTypes.number,
        orders: PropTypes.number
      })
    ).isRequired,
    weeklyRevenue: PropTypes.arrayOf(
      PropTypes.shape({
        week: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        revenue: PropTypes.number,
        orders: PropTypes.number
      })
    ),
    monthlyRevenue: PropTypes.arrayOf(
      PropTypes.shape({
        month: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        revenue: PropTypes.number,
        orders: PropTypes.number
      })
    ),
    yearlyRevenue: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        revenue: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired,
  filterByDateRange: PropTypes.func.isRequired,
};

export default RevenueReport;