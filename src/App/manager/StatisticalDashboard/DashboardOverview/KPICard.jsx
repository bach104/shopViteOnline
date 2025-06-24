import PropTypes from 'prop-types';
import { Card } from 'react-bootstrap';
import { 
  BiDollar, 
  BiCart, 
  BiUser, 
  BiTrendingUp,
  BiTrendingDown
} from 'react-icons/bi';

const KPICard = ({ title, value, growth, icon, color }) => {
  const isPositive = growth >= 0;
  const IconComponent = {
    dollar: BiDollar,
    cart: BiCart,
    users: BiUser,
    trend: isPositive ? BiTrendingUp : BiTrendingDown
  }[icon];

  return (
    <Card className={`kpi-card kpi-card--${color}`}>
      <Card.Body className="kpi-card__body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="kpi-card__title">{title}</h6>
            <h3 className="kpi-card__value">{value}</h3>
            <span className={`text-${isPositive ? 'success' : 'danger'} d-flex align-items-center`}>
              <IconComponent className="me-1" />
              {Math.abs(growth).toFixed(1)}%
            </span>
          </div>
          <div className={`kpi-card__icon kpi-card__icon--${color}`}>
            <IconComponent size={20} />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

KPICard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  growth: PropTypes.number.isRequired,
  icon: PropTypes.oneOf(['dollar', 'cart', 'users', 'trend']).isRequired,
  color: PropTypes.oneOf(['primary', 'success', 'warning', 'info']).isRequired,
};

export default KPICard;