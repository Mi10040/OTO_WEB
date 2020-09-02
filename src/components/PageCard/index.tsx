import React, { FC, useEffect, useState } from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

type PropsTpye = {} & CardProps;

const PageCard: FC<PropsTpye> = ({ children, ...props }) => {
  return (
    <Card style={{ margin: '20px', width: 'calc(100% - 40px)' }} {...props}>
      {children}
    </Card>
  );
};

export default PageCard;
