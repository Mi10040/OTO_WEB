import React, { FC, useMemo } from 'react';
import { history } from 'umi';
import { DeploymentUnitOutlined } from '@ant-design/icons';
import styles from './index.less';

const Page: FC<any> = props => {
  const { children } = props;

  const memo = useMemo(() => {
    let data: Array<any> = [
      { tite: '首页', url: '/' },
      { tite: '功能', url: '/mene' },
    ];
    return data.map((v: any, i: number) => {
      return (
        <div
          onClick={() => {
            history.push(v.url);
          }}
          key={i}
        >
          {v.tite}
        </div>
      );
    });
  }, [children]);
  return (
    <div>
      <div className={styles.memo}>
        <div className={styles.logoTite}>
          <DeploymentUnitOutlined />
        </div>
        <div className={styles.historycss}>{memo}</div>
        <div className={styles.porInfo}></div>
      </div>
      <div className={styles.children}>{children}</div>
    </div>
  );
};

export default Page;
