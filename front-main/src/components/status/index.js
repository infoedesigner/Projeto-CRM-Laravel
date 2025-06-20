import React, {useEffect, useState} from "react";
import {Accordion, Badge, Col, Row, Spinner} from "react-bootstrap";
import CheckboxTree from "react-checkbox-tree";
import { Icon } from '@iconify/react';

const StatusSideBar = (props) => {

    const {rotinas} = props;
    const [isLoading, setIsLoading] = useState(true);
    const [checked, setChecked] = useState([]);
    const [expanded, setExpanded] = useState([]);

    useEffect(()=>{
        if(rotinas.length > 0){
            setIsLoading(false);
        }
    },[rotinas]);

    return (
        isLoading ? <Spinner variant="primary" animation="border" size="20"/> : <CheckboxTree
            nodes={rotinas}
            checked={checked}
            expanded={expanded}
            onCheck={(c) => setChecked(c)}
            onExpand={(e) => setExpanded(e)}
            icons={{
                check: <Icon icon="solar:folder-check-outline" style={{ width: '16px', height: '16px' }}/>,
                uncheck: <Icon icon="solar:folder-linear" style={{ width: '16px', height: '16px' }}/>,
                halfCheck: <Icon icon="tabler:discount-check" style={{ width: '16px', height: '16px' }} />,
                expandClose: <Icon icon="tabler:list" style={{ width: '16px', height: '16px' }} />,
                expandOpen: <Icon icon="tabler:list-details" style={{ width: '16px', height: '16px' }} />,
                expandAll: <Icon icon="tabler:list-tree" style={{ width: '16px', height: '16px' }} />,
                collapseAll: <Icon icon="tabler:list" style={{ width: '16px', height: '16px' }} />,
                parentClose: <Icon icon="tabler:eye-exclamation" style={{ width: '16px', height: '16px' }} />,
                parentOpen: <Icon icon="tabler:eye-check" style={{ width: '16px', height: '16px' }} />,
                leaf: <Icon icon="tabler:arrow-move-right" style={{ width: '16px', height: '16px' }} />
            }}
        />
    );
}

export default StatusSideBar;
