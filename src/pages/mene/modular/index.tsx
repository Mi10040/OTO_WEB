import React, { FC, useEffect } from 'react';
import { Table, Space, Upload, message, Card, Row, Col } from 'antd';
import PageCard from '@/components/PageCard';
import { InboxOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import styles from './index.less';

const socket = io('http://192.168.0.103:8082/system');
const { Dragger } = Upload;

const config = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};

const Page: FC<any> = props => {
  useEffect(() => {
    socket.emit('package');
  }, []);

  socket.on('getPackage', data => {
    console.log(data);
  });

  return (
    <>
      <Row>
        <Col span={16}>
          <Row>
            <PageCard title={'模块'}>
              <Table />
            </PageCard>
          </Row>
          <Row>
            <PageCard title={'依赖'}>
              <Table />
            </PageCard>
          </Row>
        </Col>
        <Col span={8}>
          <PageCard
            title={'模块上传'}
            extra={
              <InboxOutlined style={{ fontSize: '18px', color: '#1E90FF' }} />
            }
          >
            <Dragger {...config}>
              <div className={styles.bord}>
                <p className="ant-upload-text">点击或拖拽上传</p>
                <p className="ant-upload-hint">上传需要ZIP包并按照模块规则</p>
                <p
                  className="ant-upload-hint"
                  style={{
                    textAlign: 'left',
                    margin: '10px',
                  }}
                >
                  1:入口文件名称为app.js
                  <br />
                  2:使用CommonJS规范编写
                  <br />
                  3:使用非node原生模块前请查看模块服务依赖表
                </p>
              </div>
            </Dragger>
          </PageCard>
        </Col>
      </Row>
    </>
  );
};

export default Page;
