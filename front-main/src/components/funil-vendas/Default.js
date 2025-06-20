import React, {useEffect} from 'react';
import {ResponsiveFunnel} from '@nivo/funnel';

const FunilDefault = (props) => {

    const data = [
        {
            id: 'step_sent',
            value: 94665,
            label: 'Consultas',
        },
        {
            id: 'step_viewed',
            value: 66492,
            label: 'Qualificados',
        },
        {
            id: 'step_clicked',
            value: 47560,
            label: 'Contato realizado',
        },
        {
            id: 'step_add_to_card',
            value: 43890,
            label: 'Contrato em andamento',
        },
        {
            id: 'step_purchased',
            value: 37309,
            label: 'Contratado',
        },
    ];

    return <ResponsiveFunnel
        data={data}
        margin={{top: 30, right: 30, bottom: 30, left: 30}}
        valueFormat=">-.4s"
        colors={{scheme: 'spectral'}}
        borderWidth={30}
        labelColor={{
            from: 'color',
            modifiers: [['darker', 3]],
        }}
        beforeSeparatorLength={100}
        beforeSeparatorOffset={20}
        afterSeparatorLength={100}
        afterSeparatorOffset={20}
        currentPartSizeExtension={10}
        currentBorderWidth={40}
        motionConfig="wobbly"
    />;

};

export default FunilDefault;
