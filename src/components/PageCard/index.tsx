import React, { FC, useEffect, useState } from 'react';
import { Card } from 'antd';
import { CardProps } from 'antd/lib/card';

type PropsTpye = {} & CardProps;

const PageCard: FC<PropsTpye> = (props: any) => {
  const { children } = props;
  return (
    <Card style={{ margin: '20px' }} {...props}>
      {children}
    </Card>
  );
};

export default PageCard;
