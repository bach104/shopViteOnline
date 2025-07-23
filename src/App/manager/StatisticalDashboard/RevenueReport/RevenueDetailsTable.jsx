import PropTypes from 'prop-types';
import { Card, Table } from 'react-bootstrap';
import { BiDownload } from 'react-icons/bi';
import { formatCurrency, calculateGrowthRate } from '../shared/Formatters';
import GrowthIndicator from '../DashboardOverview/GrowthIndicator';
import * as XLSX from 'xlsx';

const RevenueDetailsTable = ({ filteredData, timeRange, formatPeriodValue }) => {
  const exportToExcel = () => {
    // Chuẩn bị dữ liệu cho Excel
    const excelData = filteredData.map((item, index) => ({
      [timeRange === 'day' ? 'Ngày' : 
       timeRange === 'week' ? 'Tuần' : 
       timeRange === 'month' ? 'Tháng' : 'Năm']: 
        timeRange === 'day' ? item.date :
        timeRange === 'year' ? item.year :
        formatPeriodValue(timeRange === 'week' ? item.week : item.month),
      'Doanh thu': item.revenue || 0,
      'Số đơn hàng': item.orders || 0,
      'Giá trị trung bình': (item.orders && item.orders > 0) ? 
        (item.revenue || 0) / item.orders : 0,
      'Tăng trưởng (%)': calculateGrowthRate(
        item.revenue || 0,
        index > 0 ? (filteredData[index - 1].revenue || 0) : 0
      )
    }));

    // Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.json_to_sheet(excelData);
    
    // Tạo workbook và thêm worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "DoanhThu");

    // Xuất file Excel
    XLSX.writeFile(wb, `DoanhThu_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  return (
    <Card className="chart-card mt-4">
      <Card.Header className="chart-card__header">
        <div className="flex justify-between w-full">
          <span>
            {timeRange === 'day' ? 'Chi tiết doanh thu ngày' :
              timeRange === 'week' ? 'Chi tiết doanh thu tuần' :
                timeRange === 'month' ? 'Chi tiết doanh thu tháng' : 'Chi tiết doanh thu năm'}
          </span>
          <div 
            className="flex hover:text-blue-400 items-center gap-2 cursor-pointer"
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
              <th>{timeRange === 'day' ? 'Ngày' :
                timeRange === 'week' ? 'Tuần' :
                  timeRange === 'month' ? 'Tháng' : 'Năm'}</th>
              <th>Doanh thu</th>
              <th>Số đơn hàng</th>
              <th>Giá trị trung bình</th>
              <th>Tăng trưởng</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index}>
                <td>
                  {timeRange === 'day' ? item.date :
                    timeRange === 'year' ? item.year :
                      formatPeriodValue(timeRange === 'week' ? item.week : item.month)}
                </td>
                <td>{formatCurrency(item.revenue || 0)}</td>
                <td>{item.orders || 0}</td>
                <td>{(item.orders && item.orders > 0) ? formatCurrency((item.revenue || 0) / item.orders) : 'N/A'}</td>
                <td>
                  <GrowthIndicator
                    value={calculateGrowthRate(
                      item.revenue || 0,
                      index > 0 ? (filteredData[index - 1].revenue || 0) : 0
                    )}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

RevenueDetailsTable.propTypes = {
  filteredData: PropTypes.array.isRequired,
  timeRange: PropTypes.oneOf(['day', 'week', 'month', 'year']).isRequired,
  formatPeriodValue: PropTypes.func.isRequired,
};

export default RevenueDetailsTable;