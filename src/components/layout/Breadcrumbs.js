import React from 'react';
import { Breadcrumb, } from 'antd';
import "./styles.css";

const Breadcrumbs = (props) => {
    const url = window.location.href;
    if(url.includes('/visit')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/visit'>Vizitai</Breadcrumb.Item>
            </Breadcrumb> )

    } else if(url.includes("/doctor")) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item href='/doctor'>Gydytojai</Breadcrumb.Item>
            </Breadcrumb> )

    }else if(url.includes('/admindelivery')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item>Vizitai</Breadcrumb.Item>
            </Breadcrumb> )

    } else if(url.includes('/settings')) {
        return (
            <Breadcrumb className='breadcrumb-style'>
                <Breadcrumb.Item href='/'>Pagrindinis</Breadcrumb.Item>
                <Breadcrumb.Item>Vizitai</Breadcrumb.Item>
            </Breadcrumb> )
    } else {
        return null;
    }

};

export default Breadcrumbs;