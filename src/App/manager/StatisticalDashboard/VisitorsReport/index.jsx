import { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, Table } from 'react-bootstrap';
import { BiDownload } from 'react-icons/bi';
import { 
  ResponsiveContainer,
  PieChart, Pie, Cell, Tooltip, Legend
} from 'recharts';
import { formatNumber } from '../shared/Formatters';
import VisitorsChartCard from './VisitorsChartCard';
import * as XLSX from 'xlsx';

const CHART_COLORS = {
  visitors: '#ffc658',
  revenue: '#8884d8'
};

const VisitorsReport = ({ data, filterByDateRange }) => {
  const [timeRange, setTimeRange] = useState('day');

  const filteredData = useMemo(() => {
    const dataToFilter = timeRange === 'week' ? data.weekly : 
                        timeRange === 'month' ? data.monthly : 
                        data.daily;
    
    const filtered = filterByDateRange(dataToFilter) || [];
    
    return filtered.map(item => ({
      ...item,
      // Convert week/month to string for display
      week: timeRange === 'week' ? `Tuần ${item.week}` : item.week?.toString(),
      month: timeRange === 'month' ? `Tháng ${item.month}` : item.month?.toString(),
      // Ensure numeric values
      count: item.count || 0,
      new: item.new || 0,
      returning: item.returning || 0
    }));
  }, [timeRange, data, filterByDateRange]);

  const stats = useMemo(() => {
    if (timeRange === 'day') {
      return {
        total: data.total || 0,
        new: data.new || 0,
        returning: data.returning || 0,
        conversion: data.conversion || 0
      };
    }
    
    const total = filteredData.reduce((sum, item) => sum + item.count, 0);
    const newVisitors = filteredData.reduce((sum, item) => sum + item.new, 0);
    const returningVisitors = filteredData.reduce((sum, item) => sum + item.returning, 0);
    const conversionRate = total > 0 ? ((newVisitors / total) * 100).toFixed(2) : 0;
    
    return {
      total,
      new: newVisitors,
      returning: returningVisitors,
      conversion: parseFloat(conversionRate)
    };
  }, [timeRange, data, filteredData]);

  const pieData = useMemo(() => [
    { name: 'Mới', value: stats.new },
    { name: 'Quay lại', value: stats.returning }
  ], [stats.new, stats.returning]);

  const exportToExcel = () => {
    // Chuẩn bị dữ liệu cho Excel
    const excelData = filteredData.map(item => ({
      [timeRange === 'day' ? 'Ngày' : timeRange === 'week' ? 'Tuần' : 'Tháng']: 
        timeRange === 'day' ? item.date : 
        timeRange === 'week' ? item.week : item.month,
      'Tổng truy cập': item.count,
      'Khách mới': item.new,
      'Khách quay lại': item.returning,
      'Tỉ lệ quay lại (%)': item.count > 0 ? Math.round((item.returning / item.count) * 100) : 0
    }));

    // Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "TruyCap");

    // Xuất file Excel
    XLSX.writeFile(wb, `ThongKeTruyCap_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <div className="visitors-report statistical__mobile">
      <Row>
        <Col md={8}>
          <VisitorsChartCard 
            filteredData={filteredData}
            timeRange={timeRange}
            onTimeRangeChange={setTimeRange}
          />
        </Col>
        <Col md={4}>
          <Card className="chart-card mb-4">
            <Card.Header className="chart-card__header">Thống kê truy cập</Card.Header>
            <Card.Body className="chart-card__body">
              <div className="stats__container">
                <div className="stats__item">
                  <div className="stats__label">Tổng lượt truy cập</div>
                  <div className="stats__value">{formatNumber(stats.total)}</div>
                </div>
                <div className="stats__item">
                  <div className="stats__label">Khách mới</div>
                  <div className="stats__value">{formatNumber(stats.new)}</div>
                  <div className="stats__percentage">
                    {stats.total > 0 ? Math.round((stats.new / stats.total) * 100) : 0}%
                  </div>
                </div>
                <div className="stats__item">
                  <div className="stats__label">Khách quay lại</div>
                  <div className="stats__value">{formatNumber(stats.returning)}</div>
                  <div className="stats__percentage">
                    {stats.total > 0 ? Math.round((stats.returning / stats.total) * 100) : 0}%
                  </div>
                </div>
                <div className="stats__item">
                  <div className="stats__label">Tỉ lệ chuyển đổi</div>
                  <div className="stats__value">{stats.conversion}%</div>
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
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    <Cell fill={CHART_COLORS.revenue} />
                    <Cell fill={CHART_COLORS.visitors} />
                  </Pie>
                  <Tooltip 
                    formatter={(value) => formatNumber(value)}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="chart-card mt-4">
        <Card.Header className="chart-card__header">
          <div className="flex w-full justify-between">
            <span>Chi tiết truy cập</span>
            <div 
              className="flex gap-2 cursor-pointer items-center hover:text-blue-500" 
              size="sm"
              onClick={exportToExcel}
            >
              <BiDownload className="me-1" /> Xuất Excel
            </div>
          </div>
        </Card.Header>
        <Card.Body className="chart-card__body">
          <Table striped hover responsive className="table--statistical w-full">
            <thead>
              <tr>
                <th>{timeRange === 'day' ? 'Ngày' : timeRange === 'week' ? 'Tuần' : 'Tháng'}</th>
                <th>Tổng truy cập</th>
                <th>Khách mới</th>
                <th>Khách quay lại</th>
                <th>Tỉ lệ quay lại</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={index}>
                  <td>
                    {timeRange === 'day' ? item.date : 
                     timeRange === 'week' ? item.week : item.month}
                  </td>
                  <td>{formatNumber(item.count)}</td>
                  <td>{formatNumber(item.new)}</td>
                  <td>{formatNumber(item.returning)}</td>
                  <td>
                    {item.count > 0 ? Math.round((item.returning / item.count) * 100) : 0}%
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

VisitorsReport.propTypes = {
  data: PropTypes.shape({
    daily: PropTypes.array.isRequired,
    weekly: PropTypes.array,
    monthly: PropTypes.array,
    total: PropTypes.number,
    new: PropTypes.number,
    returning: PropTypes.number,
    conversion: PropTypes.number
  }).isRequired,
  filterByDateRange: PropTypes.func.isRequired
};

export default VisitorsReport;