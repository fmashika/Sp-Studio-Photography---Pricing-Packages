import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

// Middleware to disable HTTP caching and force instant fresh delivery
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

// Periodic cache and system state synchronization every 20 seconds to maintain maximum speed and freshness
setInterval(() => {
  try {
    loadInitialState();
  } catch (err) {
    // Non-blocking cleanup log
  }
}, 20000);

app.use(express.json({ limit: '10mb' }));

// Persistence directory and file
const DATA_DIR = path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'system_state.json');

try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (err) {
  console.error('Error creating data directory:', err);
}

// In-memory state cache
let systemState: any = null;

function loadInitialState() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      systemState = JSON.parse(content);
      return;
    }
  } catch (e) {
    console.error('Error reading system_state.json:', e);
  }
  systemState = null;
}

loadInitialState();

function saveStateToDisk() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(systemState, null, 2), 'utf-8');

    // Also write directly to src/data/pricingData.ts so the code file is permanently synced
    const pricingDataPath = path.join(process.cwd(), 'src', 'data', 'pricingData.ts');
    if (systemState && (systemState.packages || systemState.categories)) {
      const contacts = systemState.contacts || {};
      const categories = systemState.categories || [];
      const terms = systemState.terms || [];
      const packages = systemState.packages || [];

      const fileContent = `import { PricingPackage, ContactInfo, AppCategory, TermSection } from '../types';

export const contactDetails: ContactInfo = ${JSON.stringify(contacts, null, 2)};

export const defaultCategories: AppCategory[] = ${JSON.stringify(categories, null, 2)};

export const defaultTerms: TermSection[] = ${JSON.stringify(terms, null, 2)};

export const packagesData: PricingPackage[] = ${JSON.stringify(packages, null, 2)};
`;
      fs.writeFileSync(pricingDataPath, fileContent, 'utf-8');
    }
  } catch (e) {
    console.error('Error saving system state or updating pricingData.ts:', e);
  }
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Fetch current live system configuration
app.get('/api/system', (req, res) => {
  res.json({
    success: true,
    data: systemState,
    version: systemState?.version || 1,
    updatedAt: systemState?.updatedAt || null,
  });
});

// Direct admin update/publish to live system with zero delay
app.post('/api/system/sync', (req, res) => {
  try {
    const payload = req.body;
    if (!payload || typeof payload !== 'object') {
      return res.status(400).json({ success: false, error: 'Invalid payload' });
    }

    const version = Date.now();
    systemState = {
      ...payload,
      version,
      updatedAt: new Date().toISOString(),
    };

    saveStateToDisk();

    return res.json({
      success: true,
      version,
      updatedAt: systemState.updatedAt,
      message: 'System updated directly and published live with 0 delay',
    });
  } catch (error: any) {
    console.error('Error syncing system state:', error);
    return res.status(500).json({ success: false, error: error?.message || 'Failed to sync state' });
  }
});

async function startServer() {
  // Vite middleware for development mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
