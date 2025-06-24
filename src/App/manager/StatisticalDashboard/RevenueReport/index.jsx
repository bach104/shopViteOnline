import PropTypes from 'prop-types';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { BiDownload } from 'react-icons/bi';
import { 
  ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line
} from 'recharts';
import GrowthIndicator from '../DashboardOverview/GrowthIndicator';
import { formatCurrency, calculateGrowthRate } from '../shared/Formatters';

const CHART_COLORS = {
  revenue: '#8884d8',
  orders: '#00c351' 
};

const RevenueReport = ({ data, filterByDateRange }) => {
  const dailyData = filterByDateRange(data.dailyRevenue);
  const totalRevenue = dailyData.reduce((sum, item) => sum + item.revenue, 0);
  const totalOrders = dailyData.reduce((sum, item) => sum + item.orders, 0);
  const avgDailyRevenue = totalRevenue / dailyData.length;
  const avgDailyOrders = totalOrders / dailyData.length;
  const avgOrderValue = totalRevenue / totalOrders;

  return (
    <div className="statistical-dashboard">
      <Row>
        <Col md={8}>
          <Card className="chart-card mb-4">
            <Card.Header className="chart-card__header">
              <div className="d-flex justify-content-between align-items-center">
                <span>Biểu đồ doanh thu</span>
                <Form.Select size="sm" style={{ width: '150px' }}>
                  <option>Theo ngày</option>
                  <option>Theo tuần</option>
                  <option>Theo tháng</option>
                  <option>Theo năm</option>
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="chart-card__body">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" orientation="left" stroke={CHART_COLORS.revenue} />
                  <YAxis yAxisId="right" orientation="right" stroke={CHART_COLORS.orders} />
                  <Tooltip 
                    formatter={(value, name) => [
                      name === 'revenue' ? formatCurrency(value) : value,
                      name === 'revenue' ? 'Doanh thu' : 'Đơn hàng'
                    ]}
                    labelFormatter={(label) => `Ngày: ${label}`}
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
        </Col>
        <Col md={4}>
          <Card className="chart-card mb-4">
            <Card.Header className="chart-card__header">Phân tích doanh thu</Card.Header>
            <Card.Body className="chart-card__body">
              <div className="analysis__container">
                <div className="analysis__item">
                  <div className="analysis__label">Doanh thu trung bình ngày</div>
                  <div className="analysis__value">
                    {formatCurrency(avgDailyRevenue)}
                    <GrowthIndicator 
                      value={calculateGrowthRate(
                        avgDailyRevenue,
                        data.dailyRevenue.length > 0 
                          ? data.dailyRevenue.reduce((sum, item) => sum + item.revenue, 0) / data.dailyRevenue.length 
                          : 0
                      )} 
                    />
                  </div>
                </div>
                <div className="analysis__item">
                  <div className="analysis__label">Đơn hàng trung bình ngày</div>
                  <div className="analysis__value">
                    {Math.round(avgDailyOrders)}
                    <GrowthIndicator 
                      value={calculateGrowthRate(
                        avgDailyOrders,
                        data.dailyRevenue.length > 0 
                          ? data.dailyRevenue.reduce((sum, item) => sum + item.orders, 0) / data.dailyRevenue.length 
                          : 0
                      )} 
                    />
                  </div>
                </div>
                <div className="analysis__item">
                  <div className="analysis__label">Giá trị đơn hàng trung bình</div>
                  <div className="analysis__value">
                    {formatCurrency(avgOrderValue)}
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="chart-card">
            <Card.Header className="chart-card__header">Doanh thu theo năm</Card.Header>
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
      <Card className="chart-card">
        <Card.Header className="chart-card__header">
          <div className="d-flex justify-content-between align-items-center">
            <span>Chi tiết doanh thu</span>
            <Button variant="outline-primary" size="sm">
              <BiDownload className="me-1" /> Xuất Excel
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="chart-card__body">
          <Table striped hover responsive className="table--statistical">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Doanh thu</th>
                <th>Số đơn hàng</th>
                <th>Giá trị trung bình</th>
                <th>Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{formatCurrency(item.revenue)}</td>
                  <td>{item.orders}</td>
                  <td>{item.orders !== 0 ? formatCurrency(item.revenue / item.orders) : 'N/A'}</td>
                  <td>
                    <GrowthIndicator 
                      value={calculateGrowthRate(
                        item.revenue,
                        index > 0 ? dailyData[index-1].revenue : 0
                      )} 
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

RevenueReport.propTypes = {
  data: PropTypes.shape({
    dailyRevenue: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        revenue: PropTypes.number.isRequired,
        orders: PropTypes.number.isRequired
      })
    ).isRequired,
    yearlyRevenue: PropTypes.arrayOf(
      PropTypes.shape({
        year: PropTypes.string.isRequired,
        revenue: PropTypes.number.isRequired
      })
    ).isRequired
  }).isRequired,
  filterByDateRange: PropTypes.func.isRequired,
};

export default RevenueReport;