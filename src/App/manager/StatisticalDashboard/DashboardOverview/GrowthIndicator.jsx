import PropTypes from 'prop-types';

const GrowthIndicator = ({ value }) => {
  const isPositive = value >= 0;
  return (
    <span className={`growth-indicator growth-indicator--${isPositive ? 'positive' : 'negative'}`}>
      {isPositive ? '↑' : '↓'} {Math.abs(value).toFixed(1)}%
    </span>
  );
};

GrowthIndicator.propTypes = {
  value: PropTypes.number.isRequired,
};
export default GrowthIndicator;