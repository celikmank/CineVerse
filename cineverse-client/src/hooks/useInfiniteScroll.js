import { useState, useEffect, useRef } from 'react';

export function useInfiniteScroll(fetchData, dependencies = []) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const observer = useRef();
  
  const lastElementRef = (node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    
    if (node) observer.current.observe(node);
  };
  
  useEffect(() => {
    setLoading(true);
    setError(null);
    
    fetchData(page)
      .then(response => {
        const newItems = response.data.results;
        setItems(prevItems => page === 1 
          ? newItems 
          : [...prevItems, ...newItems]
        );
        setHasMore(newItems.length > 0 && response.data.page < response.data.total_pages);
      })
      .catch(err => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, ...dependencies]);
  
  const refresh = () => {
    setPage(1);
    setItems([]);
  };
  
  return { items, loading, error, hasMore, lastElementRef, refresh };
}