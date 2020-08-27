import React, { FC, useMemo, useState, useCallback } from 'react';
import styles from './layout.less';
import { history, useLocation } from 'umi';
import {
  WindowsOutlined,
  LayoutOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
const Page: FC<any> = props => {
  const { children } = props;

  const { pathname } = useLocation();

  const [moneState, setMoneState] = useState(true);

  const [ment, setMent] = useState([]);

  const [mentShow, setMentShow] = useState(false);

  const Ldata = useMemo(() => {
    return [
      {
        name: '配置中心',
        Icon: LayoutOutlined,
        contentMonel: [
          {
            name: 'PM2',
            url: '/mene/pm2',
          },
          {
            name: '模块配置',
            url: '/mene/modular',
          },
        ],
      },
    ];
  }, []);

  const toUpDel = () => {
    setMoneState(!moneState);
  };

  const toMone = useCallback(
    (v: any) => {
      return () => {
        if (v[0] === 'main') {
          setMentShow(false);
          setMent(v);
          history.push('/mene');
          return;
        }
        if (v === ment) {
          setMentShow(!mentShow);
        } else {
          setMentShow(true);
          setMent(v);
        }
      };
    },
    [mentShow, ment],
  );

  const historys = (url: any) => {
    return () => {
      history.push(url);
    };
  };

  return (
    <div className={styles.man}>
      <div className={moneState ? styles.moneUp : styles.moneDel}>
        {moneState ? (
          <WindowsOutlined
            className={'main' === ment[0] ? styles.kinUp : undefined}
            onClick={toMone(['main'])}
          />
        ) : (
          <span
            className={'main' === ment[0] ? styles.kinDel : undefined}
            onClick={toMone(['main'])}
          >
            <div>控制台</div>
            <WindowsOutlined />
          </span>
        )}
        {Ldata.map((v: any, i: number) => {
          return moneState ? (
            <v.Icon
              className={v.contentMonel === ment ? styles.kinUp : undefined}
              key={i}
              onClick={toMone(v.contentMonel)}
            />
          ) : (
            <span
              className={v.contentMonel === ment ? styles.kinDel : undefined}
              key={i}
              onClick={toMone(v.contentMonel)}
            >
              <div>{v.name}</div>
              <v.Icon />
            </span>
          );
        })}

        <div
          onClick={toUpDel}
          className={moneState ? styles.toUp : styles.toDel}
        >
          {moneState ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </div>
      {
        <div className={mentShow ? styles.toMentUp : styles.toMentDel}>
          {ment.map((v: any, i: number) => {
            return (
              <div
                className={pathname === v.url ? styles.toMentText : undefined}
                key={i}
                onClick={historys(v.url)}
              >
                {v.name}
              </div>
            );
          })}
        </div>
      }
      <div className={styles.content}>{children}</div>
    </div>
  );
};

export default Page;
