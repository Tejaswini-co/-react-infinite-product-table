import { useState } from 'react';

const ProductRow = ({ product, onTitleChange, index }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(product.title);

    const handleBlur = () => {
        setIsEditing(false);
        if (title.trim() !== product.title.trim() && title.trim().length > 0) {
            onTitleChange(product.id, title.trim());
        } else {
            setTitle(product.title);
        }
    };

    const rowStyle = {
        animationDelay: `${(index % 10) * 0.05}s`
    };

    return (
        <tr style={rowStyle}>
            <td>
                {isEditing ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
                        autoFocus
                        className="edit-input"
                        placeholder="Product Title"
                    />
                ) : (
                    <div className="title-cell-content" onClick={() => setIsEditing(true)}>
                        <span className="editable-text" title="Click to edit">
                            {title}
                        </span>
                        <span className="edit-hint-icon" title="Edit">✎</span>
                    </div>
                )}
            </td>
            <td style={{ color: '#6B7280', fontWeight: 500 }}>{product.brand || '—'}</td>
            <td>
                <span className="badge category">{product.category}</span>
            </td>
            <td className="price-tag">${parseFloat(product.price).toFixed(2)}</td>
            <td>
                <div className="rating-container">
                    <span className="star-icon">★</span>
                    <span>{product.rating}</span>
                </div>
            </td>
        </tr>
    );
};

export default ProductRow;