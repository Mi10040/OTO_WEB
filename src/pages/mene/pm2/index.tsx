import React, { FC, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'umi';
import { Table, Button, notification, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {
  AppstoreAddOutlined,
  DeleteOutlined,
  RedoOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { Pm2ListState, setList } from './model';
import io from 'socket.io-client';
import { UmiComponentProps } from '@/types';
import PageCard from '@/components/PageCard';
import styles from './index.less';

const socket = io('http://192.168.0.103:8082/pm2');

type PageProps = {
  pm2List: Pm2ListState;
} & UmiComponentProps;

const Page: FC<PageProps> = props => {
  const { pm2List, dispatch } = props;
  socket.on('getList', (data: Array<any>) => {
    console.log(data[0]);
    dispatch(setList({ datas: data }));
  });

  socket.on('pmToErr', (data: string) => {
    console.log(data);
    notification['error']({
      message: 'PM2 Error',
      description: `${data}`,
    });
  });

  const getList = () => socket.emit('list');

  useEffect(() => {
    getList();
  }, []);

  const columns: ColumnsType<any> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '命名空间',
      dataIndex: 'namespace',
      key: 'namespace',
      render: (_, record) => record.pm2_env.namespace,
    },
    {
      title: '进程PID',
      dataIndex: 'pid',
      key: 'pid',
    },
    {
      title: 'PM2PID',
      dataIndex: 'pm_id',
      key: 'pm_id',
    },
    {
      title: '进程正常启动时间',
      dataIndex: 'uptime',
      key: 'uptime',
      render: (_, record) => {
        const tiem = new Date(record.pm2_env.pm_uptime);

        return (
          tiem.toLocaleDateString().replace(/\//g, '-') +
          ' ' +
          tiem.toTimeString().substr(0, 8)
        );
      },
    },
    {
      title: '不稳定重启次数',
      dataIndex: 'unstable_restarts',
      key: 'unstable_restarts',
      render: (_, record) => record.pm2_env.unstable_restarts,
    },
    {
      title: 'CPU使用量',
      dataIndex: 'cpu',
      key: 'cpu',
      render: (_, record) => `${record.monit.cpu}%`,
    },
    {
      title: '已使用内存',
      dataIndex: 'memory',
      key: 'memory',
      render: (_, record) => `${record.monit.memory / 1024 / 1024}mb`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record) => record.pm2_env.status,
    },
    {
      title: '模式',
      dataIndex: 'mode',
      key: 'mode',
      render: (_, record) => record.pm2_env.exec_mode.split('_')[0],
    },
    {
      title: '实例数',
      dataIndex: 'instances',
      key: 'instances',
      render: (_, record) => record.pm2_env.instances,
    },
    {
      title: '操作',
      dataIndex: 'tags',
      key: 'tags',
      render: (_, record) => (
        <Space>
          <Button
            onClick={() => socket.emit('restart', { name: record.name })}
            icon={<RedoOutlined />}
          >
            重启服务
          </Button>
          <Button
            onClick={() => socket.emit('stop', { name: record.name })}
            icon={<StopOutlined />}
          >
            暂停服务
          </Button>
          <Button
            onClick={() => socket.emit('deletes', { name: record.name })}
            icon={<DeleteOutlined />}
          >
            删除服务
          </Button>
        </Space>
      ),
    },
  ];
  const cardExtra = useMemo(
    () => (
      <Space>
        <Button onClick={() => getList()} icon={<RedoOutlined />}>
          更新数据
        </Button>
        <Button icon={<AppstoreAddOutlined />}>启用服务</Button>
      </Space>
    ),
    [],
  );

  return (
    <div>
      <PageCard title={'PM2'} extra={cardExtra}>
        <Table dataSource={pm2List.list} columns={columns} rowKey={'pm_id'} />
      </PageCard>
    </div>
  );
};

export default connect(({ pm2List }: PageProps) => ({ pm2List }))(Page);
