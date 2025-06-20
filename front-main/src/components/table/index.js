import React from 'react';
import DataTable from 'react-data-table-component';

function CustomTable({ columns, data }) {
    return (
        <>
            <DataTable
                columns={columns}
                data={data}
                pagination
                fixedHeader
                selectableRows
            />
        </>
    );
}

export default CustomTable;
