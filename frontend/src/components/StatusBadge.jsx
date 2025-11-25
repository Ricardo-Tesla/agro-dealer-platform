// src/components/StatusBadge.jsx


const StatusBadge = ({ status, type = 'stock' }) => {
  const getStatusStyles = () => {
    if (type === 'stock') {
      switch (status) {
        case 'in_stock':
          return 'bg-emerald-100 text-emerald-700';
        case 'out_of_stock':
          return 'bg-gray-100 text-gray-700';
        default:
          return 'bg-gray-100 text-gray-700';
      }
    }

    return 'bg-blue-100 text-blue-700';
  };

  const formatStatus = (txt) =>
    txt.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyles()}`}
    >
      {formatStatus(status)}
    </span>
  );
};

export default StatusBadge;
