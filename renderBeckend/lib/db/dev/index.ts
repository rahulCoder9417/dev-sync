
import httpProxy from "http-proxy";

export function getPortFromHost(host?: string): number | null {
  if (!host) return null;
  const match = host.match(/-(\d+)\./);
  return match ? Number(match[1]) : null;
}
export  const devProxy = httpProxy.createProxyServer({
  ws: true,
  changeOrigin: true,
  xfwd: true,
});

export function testDev(app:any){
   
app.use((req, res, next) => {
  const host = req.headers.host;

  if (!host || !host.includes(".dev.")) {
    return next(); // not a dev preview
  }

  const port = getPortFromHost(host);
  if (!port) {
    return res.status(400).send("Invalid dev preview host");
  }

  devProxy.web(req, res, {
    target: `http://127.0.0.1:${port}`,
  });
});
}