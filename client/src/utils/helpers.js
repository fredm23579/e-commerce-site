// ─── Pluralisation ────────────────────────────────────────────────────────────

/**
 * Returns the singular or plural form of a word based on count.
 * Example: pluralize("item", 3) → "items"
 */
export function pluralize(name, count) {
  return count === 1 ? name : `${name}s`;
}

// ─── IndexedDB helper ─────────────────────────────────────────────────────────

const DB_NAME = 'shop-shop';
const DB_VERSION = 1;

/**
 * Thin promise wrapper around the browser's IndexedDB API.
 *
 * @param {'products'|'categories'|'cart'} storeName - Which object store to use.
 * @param {'put'|'get'|'delete'} method - The operation to perform.
 * @param {object} [object] - The record to write or delete (not needed for 'get').
 * @returns {Promise} Resolves with the requested data (for 'get') or the written
 *   object (for 'put'), and resolves with undefined for 'delete'.
 */
export function idbPromise(storeName, method, object) {
  return new Promise((resolve, reject) => {
    // IndexedDB is only available in browser contexts.
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this environment.'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    // Called the first time the database is opened, or when DB_VERSION increases.
    // Create the three object stores we need for offline support.
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('products')) {
        db.createObjectStore('products', { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains('categories')) {
        db.createObjectStore('categories', { keyPath: '_id' });
      }
      if (!db.objectStoreNames.contains('cart')) {
        db.createObjectStore('cart', { keyPath: '_id' });
      }
    };

    request.onerror = () => {
      console.error('[idbPromise] Failed to open IndexedDB:', request.error);
      reject(request.error);
    };

    request.onsuccess = () => {
      const db = request.result;

      // All operations are wrapped in a single readwrite transaction.
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);

      tx.onerror = () => {
        console.error('[idbPromise] Transaction error:', tx.error);
        reject(tx.error);
      };

      tx.oncomplete = () => {
        db.close();
      };

      switch (method) {
        case 'put':
          // Insert or update a single record in the store.
          store.put(object);
          resolve(object);
          break;

        case 'get': {
          // Retrieve all records from the store.
          const getAllRequest = store.getAll();
          getAllRequest.onsuccess = () => resolve(getAllRequest.result);
          getAllRequest.onerror = () => reject(getAllRequest.error);
          break;
        }

        case 'delete':
          // Remove the record with the matching _id.
          store.delete(object._id);
          resolve();
          break;

        default:
          console.warn(`[idbPromise] Unknown method: "${method}"`);
          reject(new Error(`Unknown idbPromise method: ${method}`));
      }
    };
  });
}
