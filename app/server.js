const express = require('express');
const client = require('prom-client');

const app = express();
const PORT = 3000;

// Create a Registry to register metrics
const register = new client.Registry();

// Add default metrics
client.collectDefaultMetrics({ register });

// Create custom metrics
const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status']
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

register.registerMetric(httpRequestCounter);
register.registerMetric(httpRequestDuration);

// Middleware to track requests
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestCounter.inc({ method: req.method, route: req.path, status: res.statusCode });
    httpRequestDuration.observe({ method: req.method, route: req.path, status: res.statusCode }, duration);
  });
  
  next();
});

// Routes
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>Monitoring Demo</title></head>
      <body style="font-family: Arial; padding: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
        <h1>🚀 Docker Monitoring Project</h1>
        <p>Welcome to your monitored application!</p>
        <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px;">
          <h2>Available Endpoints:</h2>
          <ul style="font-size: 18px;">
            <li><a href="/api/status" style="color: #ffd700;">API Status</a></li>
            <li><a href="/api/data" style="color: #ffd700;">Sample Data</a></li>
            <li><a href="/metrics" style="color: #ffd700;">Prometheus Metrics</a></li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

app.get('/api/status', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/api/data', (req, res) => {
  res.json({ 
    message: 'Sample data endpoint',
    data: [1, 2, 3, 4, 5],
    random: Math.random(),
    timestamp: new Date().toISOString()
  });
});

// Metrics endpoint for Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
  console.log(`📊 Metrics available at http://0.0.0.0:${PORT}/metrics`);
});
