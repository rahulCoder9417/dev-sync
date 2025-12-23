import { Express, Request, Response, NextFunction } from "express";

/**
 * Middleware to fix asset loading in preview mode
 * Redirects assets to include preview prefix and token
 * this is used because when vite is build and to go to image or any other asset it will fetch  renderUrl/usr/ptoject/name..../imag.jpg ,thats why this refrer is used to intercept it 
 */
export function setupAssetRedirect(app: Express): void {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const url = req.path;
    const referer = req.get("referer");

    // Skip if no referer or already in preview route
    const previewPattern = /^\/preview\/[^/]+\/\d+\//;
    if (!referer || previewPattern.test(url)) {
      return next();
    }

    // Check if this is an asset request
    const assetExtensions = /\.(png|jpe?g|gif|svg|ico|webp|avif|css|map|js|woff2?|ttf|otf|eot)$/i;
    if (!assetExtensions.test(url)) {
      return next();
    }

    // Extract preview info from referer
    const refererMatch = referer.match(/\/preview\/([^/]+)\/(\d+).*[?&]token=([^&]+)/);
    if (!refererMatch) {
      return next();
    }

    const [, userId, port, token] = refererMatch;

    // Construct rewritten URL
    const rewrittenUrl = `/preview/${userId}/${port}${url}?token=${token}`;

    console.log(`🔁 Asset redirect: ${url} → ${rewrittenUrl}`);

    res.redirect(rewrittenUrl);
  });
}