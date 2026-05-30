const crypto = require('crypto');
const mongoose = require('mongoose');

const useDemoStore = process.env.DEMO_MODE === 'true' || (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI);

if (useDemoStore) {
  const links = [];

  const matchesValue = (actual, expected) => {
    if (expected && typeof expected === 'object') {
      if ('$exists' in expected) {
        return expected.$exists ? actual !== undefined : actual === undefined;
      }
      if ('$gt' in expected) {
        return actual && new Date(actual) > expected.$gt;
      }
    }

    return actual === expected;
  };

  const matchesQuery = (doc, query = {}) => {
    return Object.entries(query).every(([key, expected]) => {
      if (key === '$or') {
        return expected.some((condition) => matchesQuery(doc, condition));
      }

      return matchesValue(doc[key], expected);
    });
  };

  class DemoQuery {
    constructor(items) {
      this.items = [...items];
    }

    sort(sortConfig) {
      const [[field, direction]] = Object.entries(sortConfig);
      this.items.sort((a, b) => {
        const left = new Date(a[field]).getTime();
        const right = new Date(b[field]).getTime();
        return direction < 0 ? right - left : left - right;
      });
      return this;
    }

    limit(count) {
      return Promise.resolve(this.items.slice(0, count));
    }
  }

  class DemoUrl {
    constructor(data) {
      this._id = data._id || crypto.randomUUID();
      this.originalUrl = data.originalUrl;
      this.shortCode = data.shortCode;
      this.clicksCount = data.clicksCount || 0;
      this.createdAt = data.createdAt || new Date();
      this.expiresAt = data.expiresAt;
      this.clicks = data.clicks || [];
    }

    async save() {
      const index = links.findIndex((link) => link._id === this._id);
      if (index >= 0) {
        links[index] = this;
      } else {
        links.push(this);
      }
      return this;
    }

    static async findOne(query) {
      return links.find((link) => matchesQuery(link, query)) || null;
    }

    static find(query) {
      return new DemoQuery(links.filter((link) => matchesQuery(link, query)));
    }

    static async findByIdAndDelete(id) {
      const index = links.findIndex((link) => link._id === id);
      if (index === -1) {
        return null;
      }

      const [deleted] = links.splice(index, 1);
      return deleted;
    }
  }

  module.exports = DemoUrl;
} else {
  const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clicksCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    clicks: [{
      timestamp: { type: Date, default: Date.now },
      referrer: { type: String, default: 'Direct' },
      browser: { type: String, default: 'Unknown' },
      platform: { type: String, default: 'Unknown' }
    }]
  });

  module.exports = mongoose.model('Url', urlSchema);
}
