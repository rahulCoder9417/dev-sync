import { createProxyMiddleware, RequestHandler } from "http-proxy-middleware";
import { verifyPreviewToken } from "./verifyToken.js";

export function authenticatePreview(req, res, next) {
    const { userId, port } = req.params;
    const { token } = req.query;
    
    // Create a unique key for this user+port combination
    const sessionKey = `${userId}:${port}`;
    
    console.log('\n🔐 ============ AUTHENTICATION CHECK ============');
    console.log(`👤 User: ${userId}`);
    console.log(`🔌 Port: ${port}`);
    console.log(`🎫 Token in URL: ${token ? 'YES' : 'NO'}`);
    console.log(`📝 Session exists: ${req.session.authenticated?.[sessionKey] ? 'YES' : 'NO'}`);
      // 🐛 DEBUG: Check session details
  console.log('🐛 Session Debug:');
  console.log('  - Session ID:', req.sessionID);
  console.log('  - Session object exists:', !!req.session);
  console.log('  - Session data:', JSON.stringify(req.session, null, 2));
  console.log('  - Cookie header:', req.headers.cookie);
  console.log(`📝 Session exists: ${req.session?.authenticated?.[sessionKey] ? 'YES' : 'NO'}`);
  

    // Check if already authenticated via session
    if (req.session.authenticated?.[sessionKey]) {
      console.log('✅ Already authenticated via session');
      return next(); // Continue to proxy
    }
    
    // Not authenticated - check if token is provided
    if (!token) {
      console.log('❌ Not authenticated and no token provided');
      return res.status(403).send(`
        <h1>Authentication Required</h1>
        <p>Please use the preview link provided to you.</p>
      `);
    }
    
    // Verify the token
    const isValid = verifyPreviewToken(token, userId, port);
    
    if (!isValid) {
      console.log('❌ Invalid token');
      return res.status(403).send(`
        <h1>Invalid Token</h1>
        <p>The preview token is invalid or expired.</p>
      `);
    }
    
    // Token is valid - create session
    console.log('✅ Token valid - creating session');
    
    // Initialize the authenticated object if it doesn't exist
    if (!req.session.authenticated) {
      req.session.authenticated = {};
    }
    
    // Mark this user+port as authenticated
    req.session.authenticated[sessionKey] = {
      authenticatedAt: Date.now(),
      userId,
      port
    };
    
    // Save session and redirect to clean URL (remove token)
    req.session.save((err) => {
      if (err) {
        console.error('❌ Session save error:', err);
        return res.status(500).send('Session error');
      }
      
      console.log('💾 Session saved successfully');
      console.log('🍪 Session ID after save:', req.sessionID);
      
      // Remove token from URL and redirect
      const cleanUrl = req.originalUrl.replace(/[?&]token=[^&]+/, '').replace(/\?$/, '');
      console.log('🔄 Redirecting to:', cleanUrl);
      res.redirect(cleanUrl);
    });
  }
export function createPreviewProxy(userId, port) {
    return createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
      ws: true, // Enable WebSocket proxying
      
      // Rewrite paths to remove the /preview/:userId/:port prefix
      pathRewrite: (path, req) => {
        const prefix = `/preview/${userId}/${port}`;
        const newPath = path.replace(prefix, '') || '/';
        
        console.log(`🔄 Proxying: ${path} → http://localhost:${port}${newPath}`);
        return newPath;
      },
      
      // Add custom headers if needed
      onProxyReq: (proxyReq, req, res) => {
        // You can add headers here if your app needs to know it's being proxied
        proxyReq.setHeader('X-Forwarded-User', userId);
        proxyReq.setHeader('X-Forwarded-Port', port);
        proxyReq.setHeader('X-Forwarded-Prefix', `/preview/${userId}/${port}`);
      },
      
      // Simply pass through the response - NO REWRITING!
      onProxyRes: (proxyRes, req, res) => {
        console.log(`⬅️  Response: ${proxyRes.statusCode} ${proxyRes.headers['content-type']}`);
        // The proxy library handles this automatically - we don't need to do anything!
      },
      
      // Error handling
      onError: (err, req, res: any) => {
        console.error('❌ Proxy Error:', err.message);
        res.status(502).send(`
          <h1>Service Unavailable</h1>
          <p>The application on port ${port} is not responding.</p>
          <p>Error: ${err.message}</p>
          <p>Make sure your app is running with 'npm start'</p>
        `);
      }
    }) as RequestHandler;
  }
  