
const SECRET_GATEWAY_PATH = "/xapiSecusreba1xllanC1er";

const STATUS_PAGE_TEMPLATE = `
<!DOCTYPE html>
<html>
<head>
<title>System Status</title>
<style>
body { font-family: sans-serif; background: #f4f7f6; color: #333; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
.card { background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
.status { color: #2ecc71; font-weight: bold; }
</style>
</head>
<body>
<div class="card">
<h2>Service Monitor</h2>
<p>Status: <span class="status">Operational</span></p>
<p>Region: <b>Global Edge</b></p>
<p>Uptime: 99.99%</p>
<hr>
<small>Last checked: ${new Date().toUTCString()}</small>
</div>
</body>
</html>`;

export default async function handleRequest(req, res) {

    if (!req.url || !req.url.startsWith(SECRET_GATEWAY_PATH)) {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(STATUS_PAGE_TEMPLATE);
    }


    const targetDomain = process.env.TARGET_DOMAIN;
    if (!targetDomain) {
        return res.status(500).end();
    }

    try {
        const upstreamUrl = new URL(req.url, targetDomain);


        const proxiedHeaders = {};
        for (const [headerKey, headerValue] of Object.entries(req.headers)) {
            const lowerKey = headerKey.toLowerCase();
            if (lowerKey === 'host' || lowerKey.startsWith('x-vercel-')) {
                continue;
            }
            proxiedHeaders[headerKey] = headerValue;
        }


        const upstreamResponse = await fetch(upstreamUrl.toString(), {
            method: req.method,
            headers: proxiedHeaders,
            body: !['GET', 'HEAD'].includes(req.method) ? req : null,
                                             duplex: 'half',
                                             redirect: 'manual'
        });


        res.status(upstreamResponse.status);

        // Forward headers back to client
        upstreamResponse.headers.forEach((value, key) => {
            if (key.toLowerCase() !== 'transfer-encoding') {
                res.setHeader(key, value);
            }
        });


        if (upstreamResponse.body) {
            const reader = upstreamResponse.body.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                res.write(value);
            }
        }

        return res.end();
    } catch (error) {
        return res.status(502).end();
    }
}
