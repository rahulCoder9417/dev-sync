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
  export function createPreviewProxy(userId: string, port: string) {
    return createProxyMiddleware({
      target: `http://localhost:${port}`,
      changeOrigin: true,
      ws: true,
      selfHandleResponse: true, // ✅ We need to handle HTML responses
      
      pathRewrite: (path, req) => {
        const prefix = `/preview/${userId}/${port}`;
        const newPath = path.startsWith(prefix) 
          ? path.substring(prefix.length) || '/'
          : path;
        
        console.log(`🔄 Proxying: ${path} → http://localhost:${port}${newPath}`);
        return newPath;
      },
      
      onProxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('X-Forwarded-User', userId);
        proxyReq.setHeader('X-Forwarded-Port', port);
        proxyReq.setHeader('X-Forwarded-Prefix', `/preview/${userId}/${port}`);
        
        console.log(`➡️  Proxying to: http://localhost:${port}${proxyReq.path}`);
      },
      
      onProxyRes: (proxyRes, req, res) => {
        const contentType = proxyRes.headers['content-type'] || '';
        
        console.log(`⬅️  Response: ${proxyRes.statusCode} ${contentType}`);
        
        // Only modify HTML responses
        if (contentType.includes('text/html')) {
          let body = '';
          
          proxyRes.on('data', (chunk) => {
            body += chunk.toString('utf8');
          });
          
          proxyRes.on('end', () => {
            console.log('🔧 Injecting base tag into HTML...');
            
            // Inject base tag to fix absolute URLs
            const baseTag = `<base href="/preview/${userId}/${port}/">`;
            
            if (body.includes('<head>')) {
              body = body.replace('<head>', `<head>\n    ${baseTag}`);
            } else if (body.includes('<html>')) {
              body = body.replace('<html>', `<html>\n  <head>\n    ${baseTag}\n  </head>`);
            } else {
              // No head or html tag, prepend base tag
              body = baseTag + body;
            }
            
            console.log('✅ Base tag injected');
            
            // Update Content-Length header
            const headers = { ...proxyRes.headers };
            headers['content-length'] = Buffer.byteLength(body).toString();
            
            res.writeHead(proxyRes.statusCode || 200, headers);
            res.end(body);
          });
        } else {
          // Pass through non-HTML responses (CSS, JS, images, etc.)
          console.log(`📦 Passing through: ${contentType}`);
          res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
          proxyRes.pipe(res);
        }
      },
      
      onError: (err: any, req: any, res: any) => {
        console.error('❌ Proxy Error:', err.message);
        console.error('❌ Target:', `http://localhost:${port}`);
        console.error('❌ Path:', req.url);
        
        res.status(502).send(`
          <h1>Service Unavailable</h1>
          <p>The application on port ${port} is not responding.</p>
          <p>Error: ${err.message}</p>
          <p><strong>Make sure Vite dev server is running:</strong></p>
          <pre>cd your-project && npm run dev</pre>
        `);
      }
    }) as RequestHandler;
  }