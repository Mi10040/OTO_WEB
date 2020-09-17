import React, { FC, useEffect, useState } from 'react';
import { Progress } from 'antd';
import io from 'socket.io-client';
//@ts-ignore
import ss from 'socket.io-stream';

const modules = io('http://localhost:8082/modules');

type PropsTpye = {
  text: string;
  blob: Blob;
  load: (result: string | ArrayBuffer | null) => void;
};

const UploadProgress: FC<PropsTpye> = ({ text, blob, load }) => {
  const [percent, setPercent] = useState(0);
  const [state, setState] = useState('active');

  modules.on('up', data => {
    console.log(`${data}`);
  });

  useEffect(() => {
    const stream = ss.createStream();
    ss(modules).emit('file', stream, { size: blob.size });
    const blobStream = ss.createBlobReadStream(blob);

    let size = 0;
    blobStream.on('data', function(chunk) {
      size += chunk.length;
      console.log(Math.floor((size / blob.size) * 100) + '%');
      setPercent(Math.floor((size / blob.size) * 100));
    });

    blobStream.pipe(stream);
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
