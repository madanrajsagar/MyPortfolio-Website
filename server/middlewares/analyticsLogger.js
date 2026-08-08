import Analytics from '../models/Analytics.js';

const analyticsLogger = (eventType, targetExtractor) => {
  return async (req, res, next) => {
    // Execute next middleware first so request processing isn't blocked
    next();

    try {
      const ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '';
      const userAgent = req.headers['user-agent'] || '';
      
      // Geoip info can be extracted if deployed on Vercel/Railway/Cloudflare, e.g., headers:
      const country = req.headers['cf-ipcountry'] || req.headers['x-vercel-ip-country'] || 'Unknown';
      
      let target = '';
      if (typeof targetExtractor === 'function') {
        target = targetExtractor(req);
      } else if (typeof targetExtractor === 'string') {
        target = req.params[targetExtractor] || req.body[targetExtractor] || '';
      } else {
        target = req.originalUrl;
      }

      // Save analytics record asynchronously (no await blocking response)
      Analytics.create({
        eventType,
        target,
        ipAddress,
        country,
        userAgent,
      }).catch(err => console.error('Analytics log failed:', err.message));
    } catch (error) {
      console.error('Analytics middleware error:', error.message);
    }
  };
};

export default analyticsLogger;
