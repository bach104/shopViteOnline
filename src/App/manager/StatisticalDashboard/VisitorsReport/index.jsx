import PropTypes from 'prop-types';
import { Row, Col, Card, Table, Button, Form } from 'react-bootstrap';
import { BiDownload } from 'react-icons/bi';
import { 
  ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell
} from 'recharts';
import { formatNumber } from '../shared/Formatters';

const CHART_COLORS = {
  visitors: '#ffc658',
  revenue: '#8884d8'
};

const VisitorsReport = ({ data, filterByDateRange }) => {
  const dailyData = filterByDateRange(data.daily);
  
  return (
    <div className="statistical-dashboard">
      <Row>
        <Col md={8}>
          <Card className="chart-card mb-4">
            <Card.Header className="chart-card__header">
              <div className="d-flex justify-content-between align-items-center">
                <span>Biểu đồ lượng truy cập</span>
                <Form.Select size="sm" style={{ width: '150px' }}>
                  <option>Theo ngày</option>
                  <option>Theo tuần</option>
                  <option>Theo tháng</option>
                </Form.Select>
              </div>
            </Card.Header>
            <Card.Body className="chart-card__body">
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke={CHART_COLORS.visitors} 
                    fill={CHART_COLORS.visitors} 
                    fillOpacity={0.2} 
                    name="Tổng truy cập"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="new" 
                    stroke={CHART_COLORS.revenue} 
                    fill={CHART_COLORS.revenue} 
                    fillOpacity={0.2} 
                    name="Khách mới"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="chart-card mb-4">
            <Card.Header className="chart-card__header">Thống kê truy cập</Card.Header>
            <Card.Body className="chart-card__body">
              <div className="stats__container">
                <div className="stats__item">
                  <div className="stats__label">Tổng lượt truy cập</div>
                  <div className="stats__value">{formatNumber(data.total)}</div>
                </div>
                <div className="stats__item">
                  <div className="stats__label">Khách mới</div>
                  <div className="stats__value">{formatNumber(data.new)}</div>
                  <div className="stats__percentage">{Math.round(data.new / data.total * 100)}%</div>
                </div>
                <div className="stats__item">
                  <div className="stats__label">Khách quay lại</div>
                  <div className="stats__value">{formatNumber(data.returning)}</div>
                  <div className="stats__percentage">{Math.round(data.returning / data.total * 100)}%</div>
                </div>
                <div className="stats__item">
                  <div className="stats__label">Tỉ lệ chuyển đổi</div>
                  <div className="stats__value">{data.conversion}%</div>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Card className="chart-card">
            <Card.Header className="chart-card__header">Phân bổ truy cập</Card.Header>
            <Card.Body className="chart-card__body">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Mới', value: data.new },
                      { name: 'Quay lại', value: data.returning }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill={CHART_COLORS.revenue} />
                    <Cell fill={CHART_COLORS.visitors} />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="chart-card">
        <Card.Header className="chart-card__header">
          <div className="flex w-full justify-between items-end">
            <span>Chi tiết truy cập</span>
            <Button variant="outline-primary flex" size="sm">
              <BiDownload className="me-1" /> Xuất Excel
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="chart-card__body">
          <Table striped hover responsive className="table--statistical">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Tổng truy cập</th>
                <th>Khách mới</th>
                <th>Khách quay lại</th>
                <th>Tỉ lệ quay lại</th>
              </tr>
            </thead>
            <tbody>
              {dailyData.map((item, index) => (
                <tr key={index}>
                  <td>{item.date}</td>
                  <td>{item.count}</td>
                  <td>{item.new}</td>
                  <td>{item.returning}</td>
                  <td>{Math.round(item.returning / item.count * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

VisitorsReport.propTypes = {
  data: PropTypes.object.isRequired,
  filterByDateRange: PropTypes.func.isRequired,
};

export default VisitorsReport;