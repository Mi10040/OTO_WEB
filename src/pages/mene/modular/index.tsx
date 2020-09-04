import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Table,
  Space,
  message,
  Card,
  Row,
  Col,
  Button,
  Modal,
  Select,
  Spin,
} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import PageCard from '@/components/PageCard';
import { InboxOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import io from 'socket.io-client';
import { ModularListListState, setPackageList } from './model';
import styles from './index.less';
import { UmiComponentProps } from '@/types';
import { connect } from 'umi';
import debounce from 'lodash/debounce';
import TextArea from 'antd/lib/input/TextArea';
import Upload from '@/components/upload';
import UploadProgress from '@/components/uploadProgress';

const { Option } = Select;

const socket = io('http://localhost:8082/system');
const npms = io('http://localhost:8082/npm');

type PageProps = {
  modularList: ModularListListState;
} & UmiComponentProps;

const Page: FC<PageProps> = props => {
  const { dispatch, modularList } = props;
  const [packageLoading, setPackageLoading] = useState(false);
  const [packageCallModel, setPackageCallModel] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [npmList, setNpmList] = useState([]);
  const [npmValue, setNpmValue] = useState([]);
  const [npmCMD, setNpmCMD] = useState('');
  const [npmCMDLoding, setNpmCMDLoding] = useState(false);
  const [upload, setUpload] = useState([]);

  useEffect(() => {
    setPackageLoading(true);
    socket.emit('package');
  }, []);

  socket.on('getPackage', (data: JSON) => {
    const datas = Object.entries(data).map((value: Array<string>) => {
      return {
        name: value[0],
        version: value[1],
      };
    });
    dispatch(setPackageList({ datas: datas }));
    setPackageLoading(false);
  });

  npms.on('installCmd', (data: ArrayBuffer) => {
    setNpmCMDLoding(false);
    const bl = new Blob([data]);
    const fr = new FileReader();
    fr.readAsText(bl, 'utf-8');
    fr.onload = () => {
      setNpmCMD(e => e + fr.result);
    };
  });

  const packageCallModelFc = () => {
    setPackageCallModel(v => !v);
  };

  const packageColumns: ColumnsType<any> = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '版本',
      dataIndex: 'version',
      key: 'version',
    },
  ];

  const fetchUser = (value: string) => {
    setNpmList([]);
    setFetching(true);
    npms.emit('suggestions', value);
    npms.on('getSuggestions', (data: Array<any>) => {
      setNpmList(JSON.parse([`${data}`].join()));
      setFetching(false);
    });
  };

  const NpmInstallCall = () => {
    setNpmCMDLoding(true);
    npms.emit('install', npmValue);
  };

  const handleChange = (value: any) => {
    setNpmValue(value);
    setFetching(false);
  };

  const cilckFile = (fileList: FileList) => {
    setUpload(fileList as any);
  };

  const dropFile = (fileList: FileList) => {
    setUpload(fileList as any);
  };

  const load = (result: string | ArrayBuffer | null) => {
    console.log(result);
  };

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
            <PageCard
              title={'依赖'}
              extra={<Button onClick={packageCallModelFc}>安装依赖</Button>}
            >
              <Table
                dataSource={modularList.packageList}
                columns={packageColumns}
                rowKey={'name'}
                loading={{
                  spinning: packageLoading,
                  delay: 500,
                }}
              />
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
            <Upload
              style={{ width: '100%', height: '300px' }}
              cilckFileFc={cilckFile}
              dropFileFc={dropFile}
            >
              {[...upload].map((v: File, i: number) => {
                return (
                  <UploadProgress file={v} key={i} text={v.name} load={load} />
                );
              })}
            </Upload>
          </PageCard>
        </Col>
      </Row>
      <Modal
        title="装载依赖"
        visible={packageCallModel}
        maskClosable={false}
        footer={null}
        width={'60vw'}
        onCancel={packageCallModelFc}
      >
        <Row>
          <Col span={21}>
            <Select
              mode="multiple"
              labelInValue
              placeholder="NPM Pakcage 搜索"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              value={npmValue}
              onSearch={debounce(fetchUser, 800)}
              onChange={handleChange}
              style={{ width: '100%' }}
            >
              {npmList.map((value: { name: string }, index) => (
                <Option value={value.name} key={index}>
                  {value.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={1}>
            <Button
              icon={<AppstoreAddOutlined />}
              loading={npmCMDLoding}
              onClick={NpmInstallCall}
            >
              INSTALL
            </Button>
          </Col>
        </Row>
        <Spin spinning={npmCMDLoding}>
          <TextArea
            style={{ marginTop: '20px', width: '100%' }}
            value={npmCMD}
            disabled={true}
            autoSize={{ minRows: 10, maxRows: 20 }}
          />
        </Spin>
      </Modal>
    </>
  );
};

export default connect(({ modularList }: PageProps) => ({ modularList }))(Page);
