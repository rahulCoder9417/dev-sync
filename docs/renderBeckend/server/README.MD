# Express Server Documentation

## Overview
This is the main Express server file that handles HTTP requests, WebSocket upgrades, and reverse proxy functionality for a collaborative development platform. It provides secure preview functionality for user projects, VNC-based GUI access, and terminal WebSocket connections.

---

## Server Architecture

### Core Components
```
┌──────────────────────────────────────────┐
│         Express HTTP Server              │
├──────────────────────────────────────────┤
│  • CORS & Body Parsing                   │
│  • API Routes (/api)                     │
│  • Static File Serving                   │
│  • Asset Referer Rewriting               │
│  • Preview Reverse Proxy                 │
│  • VNC/noVNC Integration                 │
│  • WebSocket Upgrade Handler             │
└──────────────────────────────────────────┘
```

---

## Middleware Configuration

### CORS Setup
```typescript
app.use(cors({
  origin: config.cors.origin,           // Allowed origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true                      // Allow cookies
}));
```

**Purpose:** Enables cross-origin requests from frontend applications

---

### Body Parsing
```typescript
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
```

**Limits:** 10MB max payload size for JSON and URL-encoded bodies

---

## Asset Referer Rewriting Middleware

### Purpose
Automatically redirects asset requests (images, CSS, JS, fonts) to the correct preview path when they're missing the full preview URL structure.

### How It Works

**Scenario:** A browser requests `/vite.svg` from within a preview page

**Detection Logic:**
1. Extracts the `Referer` header from the request
2. Checks if the URL is already in preview format (skips if yes)
3. Detects asset types by file extension
4. Extracts `userId`, `port`, and `token` from referer
5. Redirects to properly formatted preview URL

**Example Flow:**
```
Request:  GET /vite.svg
Referer:  https://domain.com/preview/user123/3000?token=abc123

Result:   302 Redirect → /preview/user123/3000/vite.svg?token=abc123
```

### Supported Asset Extensions
```typescript
/\.(png|jpe?g|gif|svg|ico|webp|avif|css|map|js|woff2?|ttf|otf)$/i
```

**Categories:**
- **Images:** png, jpg, jpeg, gif, svg, ico, webp, avif
- **Styles:** css, map
- **Scripts:** js
- **Fonts:** woff, woff2, ttf, otf

---

## Routes

### 1. API Routes
```typescript
app.use("/api", router);;
```
[Router -Link](../route/README.MD)
**Purpose:** Handles all API endpoints (user management, projects, file operations, etc.)

---

### 2. Health Check
```typescript
app.get("/health", (req, res) => {
  res.json({ ok: true });
});
```

**Purpose:** Simple health check endpoint for monitoring/load balancers

---

### 3. Static Project Files
```typescript
app.use("/projects", express.static("/usr/src/app/projects"));
```

**Purpose:** Serves static files from the projects directory (user workspaces)

---

### 4. noVNC Static Files
```typescript
app.use("/novnc", express.static("/usr/share/novnc"));
```

**Purpose:** Serves noVNC web client for browser-based VNC access

---

### 5. GUI Access Route
```typescript
app.get("/gui/:userId", async (req, res) => {
  const { userId } = req.params;
  const gui = await VNCSessionService.ensureSession(userId);
  const encodedUser = encodeURIComponent(userId);
  const url = `/novnc/vnc.html?path=websockify/${encodedUser}&autoconnect=true&resize=scale`;
  res.redirect(url);
});
```

**Purpose:** Creates/retrieves VNC session for a user and redirects to noVNC client

**Flow:**
1. Ensures VNC session exists for user (creates if needed)
2. Constructs noVNC URL with WebSocket path
3. Redirects browser to noVNC interface

**Query Parameters:**
- `path=websockify/${userId}`: WebSocket endpoint for VNC connection
- `autoconnect=true`: Automatically connect on load
- `resize=scale`: Scale VNC display to fit viewport

---

## Preview Reverse Proxy

### Overview
Secure reverse proxy that allows users to preview their built applications while maintaining authentication and URL rewriting.

### Route Pattern
```typescript
app.use("/preview/:userId/:port*", ...)
```

**Path Parameters:**
- `userId`: User identifier
- `port`: Local port where user's app is running
- `*`: Wildcard to match any subsequent path

---

### Authentication Flow

**Step 1: Extract Parameters**
```typescript
const { userId, port } = req.params;
const { token } = req.query;
```

**Step 2: Validate Token**
```typescript
const isValid = verifyPreviewToken(token as string, userId, port);
if (!isValid) {
  return res.status(403).send("Invalid or expired preview token");
}
```

**Security:** Prevents unauthorized access to other users' preview servers

---

### Proxy Configuration

#### Target & Path Rewriting
```typescript
{
  target: `http://localhost:${port}`,
  changeOrigin: true,
  ws: true,  // Enable WebSocket proxying
  selfHandleResponse: true,  // Custom response handling
  pathRewrite: (path: string, req: any) => {
    const prefix = `/preview/${userId}/${port}`;
    let newPath = path
      .replace(prefix, '')             // Remove preview prefix
      .replace(/[?&]token=[^&]+/, '')  // Remove token query param
      .replace(/\?$/, '')              // Remove trailing ?
      || '/';                          // Default to root
    return newPath;
  }
}
```

**Example Path Rewrite:**
```
Incoming:  /preview/user123/3000/assets/index.js?token=abc123
Target:    http://localhost:3000/assets/index.js
```

---

### Response Handling

#### HTML Response Rewriting
When serving HTML, the proxy rewrites all asset URLs to include the preview prefix and token:

```typescript
if (contentType.includes('text/html')) {
  let body = '';
  proxyRes.on('data', (chunk) => {
    body += chunk.toString('utf8');
  });
  
  proxyRes.on('end', () => {
    const baseUrl = `/preview/${userId}/${port}`;
    
    // Rewrite src/href attributes
    body = body.replace(
      /((?:src|href))="\/([^"]*)"/g,
      (match, key, path) => `${key}="${baseUrl}/${path}?token=${token}"`
    );
    
    // Rewrite CSS url() references
    body = body.replace(
      /(url\(['"]?)(\/[^'")]+)(['"]?\))/g,
      (match, prefix, path, suffix) => 
        `${prefix}${baseUrl}${path}?token=${token}${suffix}`
    );
    
    res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
    res.end(body);
  });
}
```

**Rewrite Examples:**

| Original | Rewritten |
|----------|-----------|
| `<img src="/logo.png">` | `<img src="/preview/user123/3000/logo.png?token=abc123">` |
| `<link href="/style.css">` | `<link href="/preview/user123/3000/style.css?token=abc123">` |
| `url('/bg.jpg')` | `url('/preview/user123/3000/bg.jpg?token=abc123')` |

---

#### Non-HTML Response Pass-through
For all other content types (images, CSS, JS, fonts), responses are piped directly:

```typescript
else {
  console.log('📦 Passing through:', contentType);
  res.writeHead(proxyRes.statusCode || 200, proxyRes.headers);
  proxyRes.pipe(res);
}
```

**Supported Types:**
- Images (PNG, JPG, GIF, SVG, WebP)
- Stylesheets (CSS)
- Scripts (JS)
- Fonts (WOFF, TTF)
- Source maps
- Any other binary/text content

---

### Error Handling

**Proxy Error Response:**
```typescript
onError: (err, req, res) => {
  console.error('❌ PROXY ERROR:', err.message);
  res.statusCode = 502;
  res.end(`
    <h1>Proxy Error</h1>
    <p>${err.message}</p>
    <p>Make sure your app is built and running with 'npm start'</p>
  `);
}
```

**Common Error Scenarios:**
- User's app not running on specified port
- Build artifacts not generated
- Network connectivity issues
- Port conflicts

---

## WebSocket Handling

### Upgrade Listener
```typescript
server.on("upgrade", handleUpgrade); * [Upgrade - Link](../upgradeRouter/README.MD)
```
* [Upgrade - Link](../upgradeRouter/README.MD)
**Purpose:** Delegates WebSocket upgrade requests to specialized handlers

**Supported WebSocket Types:**
1. **Terminal WebSockets** (`guu` handler): Interactive terminal sessions
2. **VNC WebSockets** (via noVNC): Remote desktop access
3. **Preview WebSockets**: Hot reload, dev server connections

---

## Logging System

### Request Logging Format
```
🌐 ============ HTTP PROXY REQUEST ============
📍 Full URL: https://domain.com/preview/user123/3000/index.html?token=abc123
📂 Path: /preview/user123/3000/index.html
👤 UserId: user123
🔌 Port: 3000
🎫 Token: eyJhbGciOiJIUzI1NiI...
✅ Token verified, creating proxy...
🔄 Path rewrite: /preview/user123/3000/index.html → /index.html
➡️  Proxying to: http://localhost:3000/index.html
⬅️  Response received: 200 OK
📄 Content-Type: text/html
```

**Icons Used:**
- 🌐 Request start
- 📍 URL details
- 👤 User info
- 🔌 Port info
- 🎫 Token status
- ✅ Success
- ❌ Failure
- 🔄 Transformation
- ➡️ Outgoing
- ⬅️ Incoming
- 📦 Pass-through
- 🔧 Modification

---

## Graceful Shutdown

### Shutdown Sequence
```typescript
async function shutdown() {
  console.log("Shutting down split WebSocket server gracefully...");
  
  // 1. Stop accepting new connections
  server.close((err) => {
    if (err) {
      console.error("Error closing HTTP server:", err);
    } else {
      console.log("HTTP server closed");
    }
  });
  
  // 2. Close WebSocket handlers
  try {
    // await close(); // Custom cleanup
    console.log("All WebSocket handlers closed");
  } catch (err) {
    console.error("Error closing WebSocket handlers:", err);
  }
  
  // 3. Force exit after timeout
  setTimeout(() => process.exit(0), 2000);
}
```

**Triggers:**
- `SIGINT`: Ctrl+C in terminal
- `SIGTERM`: Container orchestration (Docker, Kubernetes)

**Timeout:** 2 seconds grace period before forced exit

---

## Security Features

### 1. Token-Based Preview Authentication
Every preview request must include a valid JWT token:
```typescript
const isValid = verifyPreviewToken(token, userId, port);
```

**Token Contents:**
- User ID
- Port number
- Expiration timestamp

---

### 2. URL Rewriting for Security
All assets are rewritten to include authentication tokens, preventing:
- Unauthorized access to preview assets
- Direct asset linking without authentication
- Cross-user resource access

---

### 3. CORS Protection
Strict CORS policy prevents unauthorized cross-origin requests

---

## Configuration

### External Dependencies
```typescript
import config from "./config/index.js";
```

**Expected Config Structure:**
```typescript
{
  port: number,           // Server port (e.g., 4000)
  cors: {
    origin: string        // Allowed CORS origin
  }
}
```

---

## Services Integration

### VNCSessionService
```typescript
import VNCSessionService from "./utils/VNC.js";
```

**Purpose:** Manages VNC sessions for remote desktop access

**Methods:**
- `ensureSession(userId)`: Creates or retrieves VNC session

---

### Terminal Handler
```typescript
import guu from "./ws/terminalHandler.js";
```

**Purpose:** Handles WebSocket connections for terminal sessions

---

## Error Scenarios & Responses

| Scenario | Status Code | Response |
|----------|-------------|----------|
| Missing token | 403 | "Missing token" |
| Invalid token | 403 | "Invalid or expired preview token" |
| Missing params | 403 | "Missing params" |
| Proxy error | 502 | HTML error page with message |
| Not found | 404 | (Express default) |

---

## Usage Examples

### Starting a Preview
```bash
# User builds their app
npm run build

# App starts on port 3000
npm start

# Frontend requests preview with token
GET /preview/user123/3000?token=eyJhbGci...
```

---

### Accessing VNC
```bash
# Request GUI access
GET /gui/user123

# Redirects to noVNC client
→ /novnc/vnc.html?path=websockify/user123&autoconnect=true&resize=scale
```

---

### Health Check
```bash
GET /health

Response: { "ok": true }
```

---

## Key Dependencies

- **express**: Web framework
- **http**: HTTP server creation
- **cors**: Cross-origin resource sharing
- **http-proxy-middleware**: Reverse proxy functionality
- **Custom modules:**
  - `handleUpgrade`: WebSocket routing
  - `verifyPreviewToken`: JWT validation
  - `VNCSessionService`: VNC session management
  - `terminalHandler`: Terminal WebSocket handling

---

## Performance Considerations

### 1. Response Streaming
Non-HTML responses are streamed directly using `pipe()` to avoid memory buffering

### 2. HTML Buffering
HTML responses are buffered for URL rewriting—acceptable for typical HTML page sizes

### 3. Connection Pooling
HTTP server reuses connections via `changeOrigin: true` in proxy config

### 4. Graceful Shutdown
2-second timeout prevents hanging connections on shutdown

---

## Docker Integration

### File Paths
```typescript
app.use("/projects", express.static("/usr/src/app/projects"));
app.use("/novnc", express.static("/usr/share/novnc"));
```

**Indicates:** Server runs in Docker container with mounted volumes:
- `/usr/src/app/projects`: User project workspaces
- `/usr/share/novnc`: noVNC installation