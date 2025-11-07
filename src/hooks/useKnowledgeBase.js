import { useState, useEffect } from 'react';

export function useKnowledgeBase() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const res = await fetch('/api/hostbill/get-all-articles');
        if (!res.ok) {
          throw new Error(`Failed to fetch knowledge base: ${res.status}`);
        }
        const data = await res.json();
        if (data.success) {
          setCategories(data.categories);
        } else {
          throw new Error(data.error || 'Unknown API error');
        }
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return { categories, loading, error };
}
