import React, { FC, useState } from 'react';
import jsZip from 'jszip';
import style from './index.less';
import { UploadOutlined, Loading3QuartersOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';

type PropsTpye = {
  onChange?: Function;
};

const input: HTMLInputElement = document.createElement('input');

const Upload: FC<PropsTpye> = ({ onChange = () => {} }) => {
  const [load, setLoad] = useState(false);
  const [bls, setBls] = useState(0);
  const [name, setName] = useState('无');
  const [size, setSize] = useState(0);

  const toBl = (file: File) => {
    const bl = new Blob([file]);
    setBls(e => e + 1);
    return bl;
  };

  const packaging = (data: any, zips: jsZip) =>
    new Promise(
      (resolve: (value?: unknown) => void, reject: (reason?: any) => void) => {
        try {
          const folderZip = zips.folder(data.name);
          data.createReader().readEntries(async (res: any[]) => {
            for (let i in res) {
              res[i].isFile
                ? folderZip?.file(res[i].name, toBl(res[i]))
                : await packaging(res[i], folderZip as jsZip);
            }
            resolve();
          });
        } catch (error) {
          reject(error);
        }
      },
    );

  const folderPackaging = async (results: any) => {
    const zip = new jsZip();
    setName(results.name);
    await packaging(results, zip);
    await zip.generateAsync({ type: 'blob' }).then(data => {
      onChange(data);
      setSize(data.size);
      setLoad(false);
    });
  };

  const upload = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 1) {
      return;
    }
    setLoad(true);
    folderPackaging(e.dataTransfer.items[0].webkitGetAsEntry());
  };

  const over = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const cilck = () => {
    input.type = 'file';
    input.webkitdirectory = true;
    input.mozdirectory = true;
    input.click();
    input.onchange = () => {
      if (input.files) {
        const zip = new jsZip();
        const folader = new Map();
        let i = 0;
        setLoad(true);
        while (i < input.files.length) {
          const foladerName = `${
            input?.files?.item(i)?.webkitRelativePath
          }`.split('/');
          for (let i in foladerName) {
            if (+i !== foladerName.length - 1) {
              if (+i === 0) {
                const zipfolader = zip.folder(foladerName[+i]);
                folader.set(foladerName[+i], zipfolader);
                setName(foladerName[+i]);
              } else {
                const zipfolader = folader.get(foladerName[+i - 1]);
                const zipret = zipfolader.folder(foladerName[+i]);
                folader.set(foladerName[+i], zipret);
              }
            }
          }
          folader
            .get(foladerName[foladerName.length - 2])
            .file(
              input?.files?.item(i)?.name,
              toBl(input?.files?.item(i) as File),
            );
          i++;
        }
        zip.generateAsync({ type: 'blob' }).then(data => {
          onChange(data);
          setSize(data.size);
          setLoad(false);
        });
        input.value = '';
      }
    };
  };
  return (
    <div onDrop={upload} onDragOver={over} className={style.box}>
      <Row justify={'center'} align={'middle'} style={{ height: '100%' }}>
        <Col span={6}>
          <div onClick={load ? undefined : cilck} className={style.icon}>
            {load ? (
              <Loading3QuartersOutlined spin style={{ color: '#1d9ee9' }} />
            ) : (
              <UploadOutlined />
            )}
          </div>
        </Col>
        <Col span={18}>
          <Row>当前加载文件</Row>
          <Row>名称：{name}</Row>
          <Row>文件数：{bls}</Row>
          <Row>大小：{size}</Row>
        </Col>
      </Row>
    </div>
  );
};

export default Upload;
