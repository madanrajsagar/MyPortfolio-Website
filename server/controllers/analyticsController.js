import Analytics from '../models/Analytics.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Message from '../models/Message.js';

// Get aggregated dashboard statistics (Admin only)
export const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Core counters
    const [
      totalPageViews,
      totalDownloads,
      totalMessages,
      totalProjects,
      totalBlogs,
      unreadMessagesCount,
    ] = await Promise.all([
      Analytics.countDocuments({ eventType: 'pageView' }),
      Analytics.countDocuments({ eventType: 'downloadResume' }),
      Message.countDocuments({}),
      Project.countDocuments({}),
      Blog.countDocuments({}),
      Message.countDocuments({ isRead: false }),
    ]);

    // 2. Geographic traffic distributions
    const geoStats = await Analytics.aggregate([
      { $match: { eventType: 'pageView' } },
      { $group: { _id: '$country', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // 3. Most viewed items
    const topProjects = await Project.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title views slug heroImage');

    const topBlogs = await Blog.find({})
      .sort({ views: -1 })
      .limit(5)
      .select('title views slug category');

    // 4. Monthly/daily traffic trends (past 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const trafficTrend = await Analytics.aggregate([
      {
        $match: {
          eventType: 'pageView',
          timestamp: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // 5. Total counts of AI assistant questions
    const aiQueriesCount = await Analytics.countDocuments({ eventType: 'aiQuestion' });

    res.status(200).json({
      success: true,
      data: {
        summary: {
          pageViews: totalPageViews,
          downloads: totalDownloads,
          messages: totalMessages,
          unreadMessages: unreadMessagesCount,
          projects: totalProjects,
          blogs: totalBlogs,
          aiQueries: aiQueriesCount,
        },
        geoStats: geoStats.map(item => ({
          country: item._id,
          count: item.count,
        })),
        topProjects,
        topBlogs,
        trafficTrend: trafficTrend.map(item => ({
          date: item._id,
          views: item.count,
        })),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Log a custom analytical event (Public endpoint - e.g. when resume is clicked)
export const logEvent = async (req, res, next) => {
  try {
    const { eventType, target } = req.body;

    if (!eventType) {
      return res.status(400).json({
        success: false,
        message: 'Event type is required',
      });
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
    const userAgent = req.headers['user-agent'] || '';
    const country = req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || 'Unknown';

    await Analytics.create({
      eventType,
      target,
      ipAddress,
      country,
      userAgent,
    });

    res.status(200).json({
      success: true,
      message: 'Event logged successfully',
    });
  } catch (error) {
    next(error);
  }
};
