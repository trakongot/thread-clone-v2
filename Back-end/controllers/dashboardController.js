import moment from 'moment';
import Thread from '../models/threadModel.js';
import User from '../models/userModel.js';
export const getBarChartNewThreads = async (req, res) => {
  try {
    // Lấy ngày hiện tại và ngày 6 tháng trước
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6); // Trừ 6 tháng từ tháng hiện tại

    // Lọc bài viết trong 6 tháng gần nhất
    const result = await Thread.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lt: currentDate }, // Chỉ lấy dữ liệu trong 6 tháng gần đây
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalPosts: { $sum: 1 }, // Đếm số lượng bài đăng
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }, // Sắp xếp theo năm và tháng
      },
    ]);

    // Mảng tên các tháng
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Chuyển dữ liệu sang định dạng dễ hiểu
    const formattedResult = result.map((item) => ({
      month: monthNames[item._id.month - 1], // Tên tháng từ mảng monthNames
      threads: item.totalPosts,
    }));

    // Tạo dữ liệu cho 6 tháng gần nhất
    const completeData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(currentDate.getMonth() - i); // Tính tháng từ hiện tại

      const month = monthNames[monthDate.getMonth()];
      const monthData = formattedResult.find((data) => data.month === month);
      completeData.push({
        month,
        newThreads: monthData ? monthData.threads : 0, // Nếu không có dữ liệu, trả về 0
      });
    }

    res.status(200).json({ success: true, data: completeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
export const getAreaChartNewUser = async (req, res) => {
  try {
    // Lấy ngày hiện tại và ngày 6 tháng trước
    const currentDate = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(currentDate.getMonth() - 6); // Trừ 6 tháng từ tháng hiện tại

    // Lọc người dùng trong 6 tháng gần nhất
    const result = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo, $lt: currentDate }, // Chỉ lấy dữ liệu trong 6 tháng gần đây
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          totalRegistrations: { $sum: 1 }, // Đếm số lượng người đăng ký
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }, // Sắp xếp theo năm và tháng
      },
    ]);

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    // Chuyển dữ liệu sang định dạng dễ hiểu
    const formattedResult = result.map((item) => ({
      month: monthNames[item._id.month - 1],
      totalRegistrations: item.totalRegistrations,
    }));

    // Tạo dữ liệu cho 6 tháng gần nhất
    const completeData = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date();
      monthDate.setMonth(currentDate.getMonth() - i);

      const month = monthNames[monthDate.getMonth()];
      const monthData = formattedResult.find((data) => data.month === month);
      completeData.push({
        month,
        newusers: monthData ? monthData.totalRegistrations : 0, // Nếu không có dữ liệu, trả về 0
      });
    }

    res.status(200).json({ success: true, data: completeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getBarChartNewUser = async (req, res) => {
  try {
    // Truy vấn dữ liệu người dùng và nhóm theo tháng
    const result = await User.aggregate([
      {
        $project: {
          month: { $month: '$createdAt' },
          year: { $year: '$createdAt' },
        },
      },
      {
        $group: {
          _id: { year: '$year', month: '$month' },
          totalUsers: { $sum: 1 },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Chuyển đổi dữ liệu thành cấu trúc mong muốn
    let cumulativeTotal = 0;
    const formattedData = result.map((item) => {
      cumulativeTotal += item.totalUsers;

      // Tạo tháng theo tên
      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      const monthName = monthNames[item._id.month - 1];

      return {
        month: monthName,
        user: cumulativeTotal,
      };
    });

    // Trả về dữ liệu qua API
    res.status(200).json({ success: true, data: formattedData });
  } catch (err) {
    console.error('Error fetching user growth data for chart:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getTotalNewUser = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // Thiết lập mặc định cho startDate và endDate
    const currentDate = new Date();
    if (!startDate) {
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      startDate = firstDayOfMonth.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
    }
    if (!endDate) {
      endDate = currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
    }

    // Chuyển đổi chuỗi ngày tháng thành Date object
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Đảm bảo `end` bao gồm cả ngày cuối (thêm thời gian 23:59:59)
    end.setHours(23, 59, 59, 999);

    // Truy vấn tổng số người dùng mới trong khoảng thời gian
    const result = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }, // Lọc theo khoảng thời gian
        },
      },
      {
        $group: {
          _id: null, // Không nhóm theo bất kỳ trường nào
          totalNewUsers: { $sum: 1 }, // Tính tổng số người dùng mới
        },
      },
    ]);

    const totalNewUsers = result.length > 0 ? result[0].totalNewUsers : 0;

    res.status(200).json({ success: true, totalNewUsers });
  } catch (error) {
    console.error('Error fetching user statistics:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getTotalComments = async (req, res) => {
  try {
    let { startDate, endDate } = req.query;

    // Thiết lập mặc định cho startDate và endDate
    const currentDate = new Date();
    if (!startDate) {
      const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      );
      startDate = firstDayOfMonth.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
    }
    if (!endDate) {
      endDate = currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD
    }

    // Chuyển đổi chuỗi ngày tháng thành Date object
    const start = new Date(startDate);
    const end = new Date(endDate);

    // Đảm bảo `end` bao gồm cả ngày cuối (thêm thời gian 23:59:59)
    end.setHours(23, 59, 59, 999);

    // Truy vấn tổng số comment từ các thread trong khoảng thời gian
    const result = await Thread.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }, // Lọc theo khoảng thời gian
        },
      },
      {
        $group: {
          _id: null, // Không nhóm theo bất kỳ trường nào
          totalComments: { $sum: '$commentCount' }, // Tính tổng số comment
        },
      },
    ]);

    const totalComments = result.length > 0 ? result[0].totalComments : 0;

    res.status(200).json({ success: true, totalComments });
  } catch (error) {
    console.error('Error fetching comment statistics:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getTotalNewThreads = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    // Thiết lập mặc định cho startDate và endDate
    const currentDate = new Date();
    const defaultStartDate =
      startDate ||
      new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        .toISOString()
        .split('T')[0]; // Định dạng YYYY-MM-DD
    const defaultEndDate = endDate || currentDate.toISOString().split('T')[0]; // Định dạng YYYY-MM-DD

    // Chuyển đổi chuỗi ngày tháng thành Date object
    const start = new Date(defaultStartDate);
    const end = new Date(defaultEndDate);

    // Đảm bảo `end` bao gồm cả ngày cuối (thêm thời gian 23:59:59)
    end.setHours(23, 59, 59, 999);

    // Truy vấn tổng số thread mới trong khoảng thời gian
    const result = await Thread.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end }, // Lọc theo khoảng thời gian
          parentId: null, // Chỉ chọn thread có parentId là null
        },
      },
      {
        $group: {
          _id: null, // Không nhóm theo tháng, chỉ tính tổng
          totalThreads: { $sum: 1 }, // Tính tổng số thread
        },
      },
    ]);

    const totalThreads = result.length > 0 ? result[0].totalThreads : 0;

    res.status(200).json({ success: true, totalThreads });
  } catch (error) {
    console.error('Error fetching thread statistics:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getActiveUsers = async (req, res) => {
  try {
    // Thời gian hiện tại
    const currentTime = new Date();

    // Xác định thời gian tối đa mà người dùng được coi là "đang hoạt động" (ví dụ: trong 5 phút qua)
    const activeThreshold = new Date(currentTime - 5 * 60 * 1000); // 5 phút tính từ hiện tại

    // Truy vấn những người dùng có lastActive trong khoảng thời gian này
    const activeUsersCount = await User.countDocuments({
      lastActive: { $gte: activeThreshold },
      accountStatus: 'active', // Đảm bảo chỉ tính người dùng đang hoạt động
    });

    // Trả về số lượng người dùng đang hoạt động
    res.status(200).json({
      success: true,
      activeUsersCount,
    });
  } catch (err) {
    console.error('Error fetching active users:', err);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

export const getThreadsByQuery = async (req, res) => {
  try {
    // Lấy tham số phân trang và các tham số khác từ query (mặc định là trang 1 và số bài viết mỗi trang là 10)
    const {
      isHidden,
      hasMedia,
      postedBy,
      sortBy = 'createdAt', // Mặc định sắp xếp theo trường 'createdAt'
      order = 'desc', // Mặc định theo thứ tự giảm dần
      pageNumber = 1,
      pageSize = 10,
      startDate, // Ngày bắt đầu
      endDate, // Ngày kết thúc
    } = req.query;

    const skipAmount = (pageNumber - 1) * pageSize; // Tính số lượng bài viết cần bỏ qua

    // Xử lý sắp xếp nhiều trường
    const sortFields = sortBy.split(','); // Tách các trường (VD: ['likeCount', 'commentCount'])
    const sortOrders = order.split(','); // Tách các thứ tự (VD: ['desc', 'asc'])

    const sortOptions = {};
    sortFields.forEach((field, index) => {
      sortOptions[field] = sortOrders[index] === 'asc' ? 1 : -1; // Tăng dần hoặc giảm dần
    });

    // Tạo bộ lọc (filters)
    const filters = {
      parentId: null, // Lọc các bài viết gốc (không phải trả lời)
    };

    // Lọc theo ngày bắt đầu và kết thúc nếu có
    if (startDate) {
      filters.createdAt = { $gte: moment(startDate).startOf('day').toDate() };
    }
    if (endDate) {
      filters.createdAt = filters.createdAt || {}; // Nếu chưa có filter ngày bắt đầu, khởi tạo
      filters.createdAt.$lte = moment(endDate).endOf('day').toDate();
    }

    // Các bộ lọc khác
    if (postedBy) filters.postedBy = postedBy; // Lọc theo người đăng
    if (isHidden !== undefined) filters.isHidden = isHidden === 'true'; // Lọc theo trạng thái ẩn
    if (hasMedia !== undefined)
      filters.media = hasMedia === 'true' ? { $ne: [] } : []; // Lọc theo bài viết có media

    // Truy vấn các bài viết theo bộ lọc
    const threads = await Thread.find(filters)
      .sort(sortOptions) // Áp dụng nhiều trường sắp xếp
      .skip(skipAmount) // Bỏ qua số lượng bài viết tính từ đầu
      .limit(parseInt(pageSize)) // Giới hạn số lượng bài viết trên mỗi trang
      .populate('postedBy', 'name') // Populate thông tin người đăng
      .select(
        'text media likeCount commentCount shareCount repostCount createdAt postedBy ishidden',
      ); // Chỉ lấy các trường cần thiết

    // Lấy tổng số bài viết theo bộ lọc
    const totalThreads = await Thread.countDocuments(filters);

    // Trả về kết quả với phân trang
    res.status(200).json({
      success: true,
      data: threads,
      isNext: totalThreads > skipAmount + threads.length, // Kiểm tra nếu còn bài viết trong trang tiếp theo
      pageNumber: parseInt(pageNumber),
      pageSize: parseInt(pageSize),
      totalThreads,
    });
  } catch (err) {
    console.error('Error fetching top threads:', err.message); // Đảm bảo ghi lại chi tiết lỗi
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
