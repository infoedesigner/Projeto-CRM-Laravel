import React from 'react';
import {Button} from "react-bootstrap";

const Pagination = ({ currentPage, lastPage, onPageChange }) => {
    const handlePageChange = (page) => {
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    const renderPaginationItems = () => {
        const items = [];
        for (let i = 1; i <= lastPage; i +=1) {
            items.push(
                <li key={i} className={i === currentPage ? 'active' : ''}>
                    <Button onClick={() => {handlePageChange(i)}}>{i}</Button>
                </li>
            );
        }
        return items;
    };

    return (
        <ul className="pagination">
            {renderPaginationItems()}
        </ul>
    );
};

export default Pagination;
