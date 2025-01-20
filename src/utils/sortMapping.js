const sortMapping = {
  recent: { createdAt: 'desc' },
  old: { createdAt: 'asc' },
  high: { price: 'desc' },
  low: { price: 'asc' },
};

export default sortMapping;
