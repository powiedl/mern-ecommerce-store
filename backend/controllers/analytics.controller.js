import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';

export const getAnalytics = async (req, res) => {
  try {
    const analyticsData = await getAnalyticsData();
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000); // 7 days before today
    const dailySalesData = await getDailySalesData(startDate, endDate);
    res.json({ analyticsData, dailySalesData });
  } catch (error) {
    console.log('Error in getAnalytics controller', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

async function getAnalyticsData() {
  const totalUsers = await User.countDocuments();
  const totalProducts = await Product.countDocuments();
  const salesData = await Order.aggregate([
    {
      $group: {
        _id: null, // it groups all documents together
        totalSales: { $sum: 1 }, // count the orders, because for every order we sum up 1
        totalRevenue: { $sum: '$totalAmount' }, // get the total revenue by summing up the totalAmount of each order
      },
    },
  ]);

  const { totalSales, totalRevenue } = salesData[0] || {
    totalSales: 0,
    totalRevenue: 0,
  };
  return {
    users: totalUsers,
    products: totalProducts,
    totalSales,
    totalRevenue,
  };
}

async function getDailySalesData(startDate, endDate) {
  const dailySalesData = await Order.aggregate([
    {
      $match: {
        // get all orders of the last week
        createdAt: {
          $gte: startDate,
          $lte: endDate,
        },
      },
    },
    {
      $group: {
        // group the matched orders by the date of the createdAt
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        sales: { $sum: 1 },
        revenue: { $sum: '$totalAmount' },
      },
    },
    {
      $sort: {
        // sort it by the id (which is the createdAt date in the format YYYY-MM-DD)
        _id: 1,
      },
    },
  ]);
  const dateArray = getDatesInRange(startDate, endDate);

  const result = dateArray.map((date) => {
    const foundData = dailySalesData.find((item) => item._id === date);
    return {
      date,
      sales: foundData?.sales || 0,
      revenue: foundData?.revenue || 0,
    };
  });
  return result;
}

function getDatesInRange(startDate, endDate) {
  const dates = [];
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    dates.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dates;
}
