import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductRow from './ProductRow';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const ProductTable = () => {
    // 1. Data & Pagination States
    const [products, setProducts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);
    const limit = 10;

    // 2. Feature States: Search, Sort, and Toast Notifications
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
    const [toastMessage, setToastMessage] = useState(null);

    // --- API Fetching ---
    const fetchProducts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await fetch(`https://dummyjson.com/products?limit=${limit}&skip=${skip}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch products. Status: ${response.status}`);
            }
            
            const data = await response.json();

            // Artificial delay to let the nice shimmer skeleton animation play
            await new Promise(resolve => setTimeout(resolve, 400));

            setProducts((prev) => {
                // Deduplicate items just in case the observer triggers twice rapidly
                // Always generate a unique ID so React doesn't complain about duplicates 
                // when looping over the same products again
                const loopedProducts = data.products.map(p => ({
                    ...p,
                    // Append current skip value to make the ID globally unique even on loops
                    id: `${p.id}-${skip}`
                }));

                const newProducts = loopedProducts.filter(
                    newP => !prev.some(p => p.id === newP.id)
                );
                return [...prev, ...newProducts];
            });

            // The assignment explicitly wants true infinite scroll, stopping at the end of the data. 
            // So we disable the loop to strictly follow assignment requirements.
            if (data.skip + data.products.length >= data.total) {
                setHasMore(false);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [skip, limit]);

    // Initial and subsequent data loads
    useEffect(() => {
        if (hasMore) {
            fetchProducts();
        }
    }, [fetchProducts, hasMore]);

    // Intersection observer callback
    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            setSkip((prev) => prev + limit);
        }
    }, [isLoading, hasMore, limit]);

    const observerTarget = useInfiniteScroll(loadMore, hasMore, isLoading);


    // --- Feature 3: Toast Notifications ---
    const showToast = (message) => {
        setToastMessage(message);
        setTimeout(() => {
            setToastMessage(null);
        }, 3000); // Autohide after 3s
    };

    const handleTitleChange = (id, newTitle) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === id ? { ...product, title: newTitle } : product
            )
        );
        showToast('✨ Title saved successfully!');
    };


    // --- Feature 2: Sorting ---
    const requestSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const renderSortIcon = (key) => {
        if (sortConfig.key !== key) {
            return <span className="sort-indicator placeholder">↕</span>;
        }
        return sortConfig.direction === 'asc' 
            ? <span className="sort-indicator active">↑</span> 
            : <span className="sort-indicator active">↓</span>;
    };


    // --- Feature 1: Filter and Sort application logic ---
    const processedProducts = useMemo(() => {
        let result = [...products];

        // Apply Search Filter locally across loaded items
        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            result = result.filter(p => 
                p.title.toLowerCase().includes(lowerCaseQuery) ||
                (p.brand && p.brand.toLowerCase().includes(lowerCaseQuery)) ||
                (p.category && p.category.toLowerCase().includes(lowerCaseQuery))
            );
        }

        // Apply Sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aVal = a[sortConfig.key];
                let bVal = b[sortConfig.key];
                
                // Compare strings case-insensitively
                if (typeof aVal === 'string') aVal = aVal.toLowerCase();
                if (typeof bVal === 'string') bVal = bVal.toLowerCase();

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [products, searchQuery, sortConfig]);


    // Skeleton UI placeholders
    const skeletons = Array.from({ length: 4 }).map((_, idx) => (
        <tr key={`skeleton-${idx}`}>
            <td><div className="skeleton w-3-4"></div></td>
            <td><div className="skeleton w-1-2"></div></td>
            <td><div className="skeleton" style={{ width: '80%', borderRadius: '99px' }}></div></td>
            <td><div className="skeleton w-1-2"></div></td>
            <td><div className="skeleton w-1-2"></div></td>
        </tr>
    ));

    return (
        <div className="table-container">
            
            {/* Feature 1: Search Bar */}
            <div className="controls-container">
                <input 
                    type="text" 
                    placeholder="Search titles, brands, or categories..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            <div className="table-wrapper">
                <table className="product-table">
                    <thead>
                        <tr>
                            <th onClick={() => requestSort('title')} className="sortable-header">
                                Product Title {renderSortIcon('title')}
                            </th>
                            <th onClick={() => requestSort('brand')} className="sortable-header">
                                Brand {renderSortIcon('brand')}
                            </th>
                            <th onClick={() => requestSort('category')} className="sortable-header">
                                Category {renderSortIcon('category')}
                            </th>
                            <th onClick={() => requestSort('price')} className="sortable-header">
                                Price {renderSortIcon('price')}
                            </th>
                            <th onClick={() => requestSort('rating')} className="sortable-header">
                                Rating {renderSortIcon('rating')}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {processedProducts.length > 0 ? (
                            processedProducts.map((product, index) => (
                                <ProductRow
                                    key={product.id}
                                    product={product}
                                    onTitleChange={handleTitleChange}
                                    index={index}
                                />
                            ))
                        ) : (
                            !isLoading && (
                                <tr>
                                    <td colSpan="5">
                                        <div className="empty-state">
                                            No products found matching "{searchQuery}"
                                        </div>
                                    </td>
                                </tr>
                            )
                        )}
                        {isLoading && skeletons}
                    </tbody>
                </table>
            </div>

            {error && <div className="indicator error">Oops! {error}</div>}

            {/* Removing the loop means we need to show the end message again */}
            {!hasMore && !isLoading && processedProducts.length > 0 && (
                <div className="indicator end-message">
                    ✨ You've reached the end of the catalog! ✨
                </div>
            )}

            {/* Feature 3: Toast Notification Layer */}
            {toastMessage && (
                <div className="toast-container">
                    <div className="toast">{toastMessage}</div>
                </div>
            )}

            {/* Only observe scroll if we're not actively searching heavily (optional UX choice, keeping it enabled here) */}
            <div ref={observerTarget} className="observer-target" />
        </div>
    );
};

export default ProductTable;