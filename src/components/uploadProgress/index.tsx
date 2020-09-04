import React, { FC, useEffect, useState } from 'react';
import { Progress } from 'antd';
import io from 'socket.io-client';

const modules = io('http://localhost:8082/modules');

type PropsTpye = {
  text: string;
  file: File;
  load: (result: string | ArrayBuffer | null) => void;
};

const UploadProgress: FC<PropsTpye> = ({ text, file, load }) => {
  const [percent, setPercent] = useState(0);
  const [state, setState] = useState('active');

  modules.on('up', data => {
    console.log(`${data}`);
  });

  useEffect(() => {
    const bl = new Blob([file]);
    const fr = new FileReader();
    fr.readAsArrayBuffer(bl);
    fr.onprogress = e => {
      setPercent(Math.ceil((e.loaded / e.total) * 100) / 2);
    };
    fr.onload = e => {
      load(fr.result);
      console.log(`${fr.result}`);
      modules.emit('upload', fr.result);
      // setState('success');
    };
  }, []);
  return (
    <>
      {text}
      <Progress
        percent={percent}
        size="small"
        status={
          state as 'success' | 'active' | 'normal' | 'exception' | undefined
        }
      />
    </>
  );
};

export default UploadProgress;
