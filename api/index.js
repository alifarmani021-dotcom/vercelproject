/**
 * Production Gateway Service & Personal Portfolio Website
 * Version: 1.0.0
 */

const SECRET_GATEWAY_PATH = "/xapiSecusreba1xllanC1er";

const CECOY_PORTFOLIO_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Alex Mercer | Creative Frontend Developer & UI Designer</title>
    <style>
        :root {
            --bg: #0f172a;
            --card-bg: #1e293b;
            --text: #f8fafc;
            --text-muted: #94a3b8;
            --accent: #38bdf8;
            --accent-gradient: linear-gradient(135deg, #38bdf8, #818cf8);
        }
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: var(--bg);
            color: var(--text);
            line-height: 1.6;
            padding: 2rem 1rem;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
        }
        header {
            text-align: center;
            margin-bottom: 3rem;
        }
        header h1 {
            font-size: 2.5rem;
            font-weight: 800;
            background: var(--accent-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 0.5rem;
        }
        header p {
            color: var(--text-muted);
            font-size: 1.1rem;
        }
        .section-title {
            font-size: 1.4rem;
            margin-bottom: 1.5rem;
            border-left: 4px solid var(--accent);
            padding-left: 0.75rem;
        }
        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 1.5rem;
            margin-bottom: 3rem;
        }
        .card {
            background-color: var(--card-bg);
            border: 1px solid #334155;
            padding: 1.5rem;
            border-radius: 12px;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .card:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 20px rgba(0,0,0,0.2);
        }
        .card h3 {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
            color: var(--accent);
        }
        .card p {
            color: var(--text-muted);
            font-size: 0.95rem;
        }
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 3rem;
        }
        .skill-tag {
            background: #334155;
            color: var(--text);
            padding: 0.4rem 0.9rem;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }
        footer {
            text-align: center;
            margin-top: 4rem;
            border-top: 1px solid #1e293b;
            padding-top: 1.5rem;
            color: var(--text-muted);
            font-size: 0.85rem;
        }
        .contact-btn {
            display: inline-block;
            margin-top: 1rem;
            background: var(--accent-gradient);
            color: white;
            text-decoration: none;
            padding: 0.6rem 1.2rem;
            border-radius: 8px;
            font-weight: 600;
            transition: opacity 0.2s ease;
        }
        .contact-btn:hover {
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>Alex Mercer</h1>
            <p>Full-Stack Developer & Product Enthusiast</p>
            <a href="mailto:alex.mercer@example.com" class="contact-btn">Get In Touch</a>
        </header>

        <main>
            <h2 class="section-title">Recent Work</h2>
            <div class="grid">
                <div class="card">
                    <h3>Project Polaris</h3>
                    <p>An open-source performance analytics dashboard built with Next.js, GraphQL, and Tailwind CSS. Helps tracking latency spikes in microservices.</p>
                </div>
                <div class="card">
                    <h3>SwiftNote CLI</h3>
                    <p>A fast, decentralized markdown note-taking app written in Rust and Node.js. Optimized for speed and developer local storage security.</p>
                </div>
            </div>

            <h2 class="section-title">Core Skills</h2>
            <div class="skills-container">
                <span class="skill-tag">JavaScript / TypeScript</span>
                <span class="skill-tag">React.js & Next.js</span>
                <span class="skill-tag">Node.js</span>
                <span class="skill-tag">REST & GraphQL APIs</span>
                <span class="skill-tag">Docker & Kubernetes</span>
                <span class="skill-tag">UI/UX Design</span>
            </div>

            <h2 class="section-title">About Me</h2>
            <p style="color: var(--text-muted); margin-bottom: 2rem;">
                I am a passionate software engineer with 5+ years of experience designing and optimizing modern web apps. 
                My focus centers around improving digital performance, low-latency API architecture, and dynamic streaming pipelines.
            </p>
        </main>

        <footer>
            <p>&copy; ${new Date().getFullYear()} Alex Mercer. Handcrafted with React and Serverless Edge.</p>
        </footer>
    </div>
</body>
</html>
`;

export default async function handleRequest(req, res) {
    // Return the convincing decoy portfolio if the URL doesn't match the hidden gateway path
    if (!req.url || !req.url.startsWith(SECRET_GATEWAY_PATH)) {
        res.setHeader('Content-Type', 'text/html');
        return res.status(200).send(CECOY_PORTFOLIO_TEMPLATE);
    }

    // Proxy the connection downstream to the VPS
    const targetDomain = process.env.TARGET_DOMAIN;
    if (!targetDomain) {
        return res.status(500).end();
    }

    try {
        const upstreamUrl = new URL(req.url, targetDomain);

        // Sanitize headers to prevent Vercel metadata leaks
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
